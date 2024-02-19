"use client";

import { useFBO, useGLTF, useProgress } from "@react-three/drei";
import {
  Canvas,
  ReactThreeFiber,
  createPortal,
  extend,
  useFrame,
} from "@react-three/fiber";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

import { clamp, useSpring } from "framer-motion";
import SimulationMaterial from "./SimulationMaterial";
import useMatchMedia from "./useMatchMedia";
import { cn } from "./util";

extend({ SimulationMaterial: SimulationMaterial });

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
  count = 200,
  active,
  onLoaded,
}: {
  count?: number;
  active: boolean;
  onLoaded: () => void;
}) => {
  const isTouchDevice = useMatchMedia("(pointer: coarse)");

  const points = useRef<THREE.Points>(null);
  const simulationMaterialRef = useRef<THREE.ShaderMaterial>(null);

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

  const { nodes, materials } = useGLTF("/buka-logo.glb");
  const { progress } = useProgress();
  useEffect(() => {
    if (progress === 100) {
      onLoaded();
    }
  }, [progress, onLoaded]);

  const sampler = useSampler(
    (nodes?.Buka as any)?.geometry,
    count * count,
    clamp(200, 300, window.innerWidth / 4.5)
  );

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
      uPositions: {
        value: null,
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

  useFrame((state) => {
    if (!simulationMaterialRef.current) return;

    const { gl, clock } = state;

    mouseXSpring.set(mouse.x);
    mouseYSpring.set(mouse.y);

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    (
      points.current!.material as THREE.ShaderMaterial
    ).uniforms.uPositions.value = renderTarget.texture;

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
          fragmentShader={`
              void main() {
                vec3 color = vec3(1., .20, .13);
                vec2 xy = gl_PointCoord.xy - vec2(0.5);

                float dropoff = smoothstep(0.5, 0.1, length(xy));

                gl_FragColor = vec4(color * dropoff, 1.0);
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

const Scene = ({
  className,
  ...props
}: Partial<ComponentProps<typeof Canvas>>) => {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <Canvas
      camera={{ position: [0, 10, 0] }}
      {...props}
      className={cn("opacity-0 duration-1000 transition-opacity", {
        "opacity-100": loaded,
      })}
      onClick={() => {
        setActive(!active);
      }}
    >
      <ParticlesLogo onLoaded={() => setLoaded(true)} active={active} />
    </Canvas>
  );
};

export default Scene;
