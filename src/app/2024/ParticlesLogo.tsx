"use client";

import { useFBO } from "@react-three/drei";
import {
  Canvas,
  ReactThreeFiber,
  createPortal,
  extend,
  useFrame,
} from "@react-three/fiber";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js";

import { BladeState } from "@tweakpane/core";
import { clamp, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { BufferGeometryUtils, SVGLoader } from "three/examples/jsm/Addons.js";
import { Pane } from "tweakpane";
import useMatchMedia from "../hooks/useMatchMedia";
import { toast } from "../ui/Toast";
import { getBrandColor } from "../util";
import SimulationMaterial from "./SimulationMaterial";

extend({ SimulationMaterial: SimulationMaterial });

function remap(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
) {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      simulationMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof SimulationMaterial
      >;
    }
  }
}

function getColorVec() {
  const color = getBrandColor();
  const col = new THREE.Color(color);
  return new THREE.Vector3(col.r, col.g, col.b);
}

const useSampler = (
  geometry: THREE.BufferGeometry,
  count: number,
  scale: number
) => {
  const mesh = new THREE.Mesh(geometry);
  const [points, setPoints] = useState(new Float32Array());

  useEffect(() => {
    const sampler = new MeshSurfaceSampler(mesh).build();

    const points = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const sample = new THREE.Vector3();
      sampler.sample(sample);

      points.set(sample.toArray().concat(1), i * 4);

      points[i * 4] *= scale;
      points[i * 4 + 1] *= scale;
      points[i * 4 + 2] *= scale;
    }

    setPoints(points);
  }, [geometry, count, scale]);

  return points;
};

const useMouseRef = () => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mouse.current;
};

// inspired by https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/
const ParticlesLogo = ({
  count,
  active,
  color,
  scale,
  geometry,
  disableDropoff,
}: {
  count: number;
  active: boolean;
  color?: THREE.Vector3;
  scale: number;
  geometry: THREE.BufferGeometry;
  disableDropoff?: boolean;
}) => {
  const isTouchDevice = useMatchMedia("(pointer: coarse)");
  const { resolvedTheme } = useTheme();

  const points = useRef<THREE.Points>(null);
  const simulationMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const baseMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1
  );
  const positions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO(count, count, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const sampler = useSampler(geometry, count * count, scale);

  const particlesPosition = useMemo(() => {
    const length = count * count;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % count) / count;
      particles[i3 + 1] = i / count / count;
    }
    return particles;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      uPositions: {
        value: null,
      },
      uColor: {
        value: color || getColorVec(),
      },
      uDisableDropoff: {
        value: disableDropoff,
      },
    }),
    []
  );

  const touchOffsetSpring = useSpring(0, { stiffness: 300, damping: 100 });
  const mouseXSpring = useSpring(0, { stiffness: 300, damping: 100 });
  const mouseYSpring = useSpring(0, { stiffness: 300, damping: 100 });

  const mouse = useMouseRef();

  useEffect(() => {
    if (active) {
      touchOffsetSpring.set(1);
    } else {
      touchOffsetSpring.set(0);
    }
  }, [active]);

  const col = color || getColorVec();

  useFrame((state) => {
    if (!simulationMaterialRef.current) return;

    const { gl, clock } = state;

    mouseXSpring.set(mouse.x);
    mouseYSpring.set(mouse.y);

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    const pointsMaterial = points.current!.material as THREE.ShaderMaterial;

    pointsMaterial.uniforms.uPositions.value = renderTarget.texture;
    pointsMaterial.uniforms.uDisableDropoff.value =
      disableDropoff === undefined
        ? resolvedTheme === "light"
        : Boolean(disableDropoff);

    if (!pointsMaterial.uniforms.uColor.value.equals(col)) {
      pointsMaterial.uniforms.uColor.value = col;
      pointsMaterial.needsUpdate = true;
    }
    pointsMaterial.uniforms.uTime.value = clock.elapsedTime;

    simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    if (isTouchDevice) {
      simulationMaterialRef.current.uniforms.uMouseX.value =
        touchOffsetSpring.get();
      simulationMaterialRef.current.uniforms.uMouseY.value =
        touchOffsetSpring.get();
    } else {
      simulationMaterialRef.current.uniforms.uMouseX.value = mouseXSpring.get();
      simulationMaterialRef.current.uniforms.uMouseY.value = mouseYSpring.get();
    }
  });

  if (!sampler.length) return null;
  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial
            ref={simulationMaterialRef}
            args={[count, sampler]}
          />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          ref={baseMaterialRef}
          fragmentShader={`
            uniform vec3 uColor;
            uniform float uTime;
            uniform bool uDisableDropoff;

            void main() {
              vec2 xy = gl_PointCoord.xy - vec2(0.5);

              float dropoff = uDisableDropoff ? 1. : smoothstep(0.6, 0.1, length(xy));

              float fadeIn = smoothstep(0.0, 1.0, uTime);

              gl_FragColor = vec4(uColor, fadeIn * dropoff);
            }
            `}
          vertexShader={`
            uniform sampler2D uPositions;
            uniform float uTime;
            
            void main() {
              vec3 pos = texture2D(uPositions, position.xy).xyz;
            
              vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectedPosition = projectionMatrix * viewPosition;
            
              gl_Position = projectedPosition;
            
              gl_PointSize = 20. * (1.0 / - viewPosition.z);
            }
            `}
          uniforms={uniforms}
        />
      </points>
    </>
  );
};

const bukaSVG = `<svg
  width="257"
  height="257"
  viewBox="0 0 257 257"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
    <path
      d="M109.154 186.851C189.533 160.858 248.869 88.0762 255.052 0.615791H0.615973V187.904C0.61591 187.904 0.616037 187.904 0.615973 187.904L0.615784 256.384H256.384V108.798C216.708 147.831 165.898 175.582 109.154 186.851Z"
      fill="red"
    />
  </svg>
`;

function geometryFromSVG(svg: string, depth = 50) {
  const loader = new SVGLoader();
  const svgData = loader.parse(svg);

  const geometries = svgData.paths
    .map((p) => {
      const shapes = p.toShapes(true);
      return shapes.map((s) => {
        const geometry = new THREE.ExtrudeGeometry(s, {
          depth,
          bevelEnabled: false,
        });

        return geometry;
      });
    })
    .flat();

  const geometry = BufferGeometryUtils.mergeGeometries(geometries);
  geometry.rotateX(Math.PI / 2);
  geometry.center();

  if (!geometry.boundingBox) {
    toast.error("Bounding box not found");
  }
  const bb = geometry.boundingBox!;
  const size = new THREE.Vector3();
  bb.getSize(size);

  const scale = 1 / Math.max(size.x, size.y, size.z);
  geometry.scale(scale, scale, scale);

  return geometry;
}

const defaultSettings = {
  count: 300,
  depth: 50,
  scale: 6, // 4-8 range
  disableDropoff: undefined,
  logoSVG: bukaSVG,
};

const Scene = ({
  className,
  ...props
}: Partial<ComponentProps<typeof Canvas>>) => {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);
  const [iterationCount, setIterationCount] = useState(0);

  const settings = useRef<{
    color?: THREE.Vector3;
    background?: string;
    count: number;
    logoSVG?: string;
    depth?: number;
    disableDropoff?: boolean;
    scale: number;
  }>({ ...defaultSettings });

  function rerun() {
    setIterationCount((prev) => prev + 1);
  }

  const paneRef = useRef<Pane>();

  useEffect(() => {
    const debugConfig = {
      color: getBrandColor(),
      background: getComputedStyle(document.documentElement).getPropertyValue(
        "--page-background"
      ),
      ...defaultSettings,
      disableDropoff: false,
    };

    function handleDebug() {
      if (window.location.hash.includes("debug")) {
        if (paneRef.current) return;
        let baseState: BladeState;

        const pane = new Pane({
          title: "Debug",
          expanded: true,
        });
        paneRef.current = pane;

        pane
          .addBinding(debugConfig, "background", { view: "color" })
          .on("change", (e) => {
            if (e.last) {
              document.documentElement.style.setProperty("background", e.value);
            }
          });

        const pf = pane.addFolder({ title: "Particles" });

        pf.addBinding(debugConfig, "color", { view: "color" }).on(
          "change",
          (e) => {
            if (e.last) {
              const vec = new THREE.Vector3();
              const col = new THREE.Color(e.value);
              vec.set(col.r, col.g, col.b);

              settings.current.color = vec;
            }
          }
        );

        pf.addBinding(debugConfig, "logoSVG", { label: "logo SVG" }).on(
          "change",
          (e) => {
            if (e.last) {
              settings.current.logoSVG = e.value;
            }
          }
        );

        // pf.addBinding(debugConfig, "scale", {
        //   min: 1,
        //   max: 10,
        //   step: 1,
        // }).on("change", (e) => {
        //   if (e.last) {
        //     settings.current.scale = Number(e.value);
        //   }
        // });

        pf.addBinding(debugConfig, "depth", {
          min: 10,
          max: 100,
          step: 10,
        }).on("change", (e) => {
          if (e.last) {
            settings.current.depth = Number(e.value);
          }
        });

        pf.addBinding(debugConfig, "disableDropoff", {}).on("change", (e) => {
          if (e.last) {
            settings.current.disableDropoff = Boolean(e.value);
          }
        });

        pf.addBinding(debugConfig, "count", {
          min: 200,
          max: 1000,
          step: 100,
        }).on("change", (e) => {
          if (e.last) {
            settings.current.count = Number(e.value);
          }
        });

        pf.addButton({ title: "Reset" }).on("click", () => {
          settings.current = { ...defaultSettings };
          pane.importState(baseState);
          pane.refresh();
          document.documentElement.style.setProperty(
            "background",
            "var(--page-background)"
          );
          rerun();
        });

        baseState = pane.exportState();

        pf.addButton({ title: "Apply" }).on("click", rerun);
      } else {
        paneRef.current?.dispose();
        paneRef.current = undefined;
        document.documentElement.style.setProperty(
          "background",
          "var(--page-background)"
        );
        settings.current = { ...defaultSettings };
        rerun();
      }
    }

    handleDebug();

    window.addEventListener("hashchange", handleDebug);

    return () => {
      window.removeEventListener("hashchange", handleDebug);
    };
  }, []);

  const [geometry, setGeometry] = useState<THREE.BufferGeometry>();

  useEffect(() => {
    const { logoSVG } = settings.current;
    setGeometry(geometryFromSVG(logoSVG || bukaSVG, settings.current.depth));
  }, [iterationCount]);

  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true }}
      id="scene"
      camera={{ position: [0, 10, 0] }}
      {...props}
      onClick={() => {
        setActive(!active);
      }}
      key={iterationCount}
    >
      {geometry && (
        <ParticlesLogo
          active={active}
          {...settings.current}
          geometry={geometry}
          scale={remap(
            clamp(300, 1200, window.innerWidth / 2),
            300,
            1200,
            3,
            8
          )}
        />
      )}
    </Canvas>
  );
};

export default Scene;
