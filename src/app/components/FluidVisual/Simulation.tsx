"use client";

import { randFloat } from "three/src/math/MathUtils";
import { clamp } from "~/app/math";
import SpatialHash from "./SpatialHash";

interface PointerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isOver: boolean;
}

export interface PhysicsParams {
  gravity: number;
  scrollVelocity: number;
  pointer: PointerState;
  fluidDensity: number;
}

export const CellType = {
  Fluid: 0,
  Air: 1,
  Solid: 2,
} as const;

interface BilinearResult {
  value: number;
  weights: number[];
  indices: number[];
}

class Particles {
  maxParticles: number;
  radius: number;
  numParticles: number;
  positions: number[];
  velocities: number[];
  spatialHash: SpatialHash;

  constructor(
    sceneWidth: number,
    sceneHeight: number,
    radius: number,
    maxParticles: number
  ) {
    this.maxParticles = maxParticles;
    this.radius = radius;
    this.numParticles = 0;

    this.positions = new Array(2 * maxParticles);
    this.velocities = new Array(2 * maxParticles);

    const hashSpacing = 2.2 * radius;

    this.spatialHash = new SpatialHash(
      sceneWidth,
      sceneHeight,
      hashSpacing,
      maxParticles
    );
  }

  initialize(
    particlesPerCell: number,
    cellSize: number,
    fluidCellsX: number,
    fluidCellsY: number
  ): void {
    const particlesPerDim = Math.sqrt(particlesPerCell);

    this.numParticles = Math.min(
      this.maxParticles,
      fluidCellsX * fluidCellsY * particlesPerCell
    );

    for (let p = 0; p < this.numParticles; p++) {
      const cellIndex = Math.floor(p / particlesPerCell);
      const particleIndex = p % particlesPerCell;

      const cellI = Math.floor(cellIndex / fluidCellsY);
      const cellJ = cellIndex % fluidCellsY;

      const row = Math.floor(particleIndex / particlesPerDim);
      const col = particleIndex % particlesPerDim;

      const particleX = (cellI + (col + 0.5) / particlesPerDim) * cellSize;
      const particleY = (cellJ + (row + 0.5) / particlesPerDim) * cellSize;

      this.positions[2 * p] = particleX;
      this.positions[2 * p + 1] = particleY;

      this.velocities[2 * p] = randFloat(0, 10);
      this.velocities[2 * p + 1] = randFloat(0, 10);
    }
  }

  integrate(deltaTime: number, gravity: number, scrollVelocity: number): void {
    for (let i = 0; i < this.numParticles; i++) {
      this.velocities[2 * i + 1] += scrollVelocity;
      this.velocities[2 * i + 1] += deltaTime * gravity;
      this.positions[2 * i] += this.velocities[2 * i] * deltaTime;
      this.positions[2 * i + 1] += this.velocities[2 * i + 1] * deltaTime;
    }
  }

  pushApart(numIterations: number): void {
    this.spatialHash.update(this.positions, this.numParticles);
    const minDistance = 2.0 * this.radius;
    const minDistanceSquared = minDistance * minDistance;

    for (let iter = 0; iter < numIterations; iter++) {
      for (let i = 0; i < this.numParticles; i++) {
        const particleX = this.positions[2 * i];
        const particleY = this.positions[2 * i + 1];

        this.spatialHash.query(i, this.positions, (neighborIndex) => {
          const neighborX = this.positions[2 * neighborIndex];
          const neighborY = this.positions[2 * neighborIndex + 1];

          let deltaX = neighborX - particleX;
          let deltaY = neighborY - particleY;

          const distanceSquared = deltaX * deltaX + deltaY * deltaY;
          if (distanceSquared > minDistanceSquared || distanceSquared === 0.0) {
            return;
          }

          const distance = Math.sqrt(distanceSquared);
          const pushFactor = (0.5 * (minDistance - distance)) / distance;

          deltaX *= pushFactor;
          deltaY *= pushFactor;

          this.positions[2 * i] -= deltaX;
          this.positions[2 * i + 1] -= deltaY;
          this.positions[2 * neighborIndex] += deltaX;
          this.positions[2 * neighborIndex + 1] += deltaY;
        });
      }
    }
  }

  handleCollisions(
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    pointer: PointerState
  ): void {
    for (let i = 0; i < this.numParticles; i++) {
      let x = this.positions[2 * i];
      let y = this.positions[2 * i + 1];

      if (pointer.isOver) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < pointer.radius * pointer.radius) {
          const d = Math.sqrt(d2) || 1.0;
          const repelStrength = 1.0 * (1.0 - d / pointer.radius);

          this.velocities[2 * i] += (dx / d) * repelStrength;
          this.velocities[2 * i + 1] += (dy / d) * repelStrength;
          this.velocities[2 * i] += pointer.vx * 5.0;
          this.velocities[2 * i + 1] += pointer.vy * 5.0;
        }
      }
      if (x < minX) {
        x = minX;
        this.velocities[2 * i] = 0.0;
      }
      if (x > maxX) {
        x = maxX;
        this.velocities[2 * i] = 0.0;
      }
      if (y < minY) {
        y = minY;
        this.velocities[2 * i + 1] = 0.0;
      }
      if (y > maxY) {
        y = maxY;
        this.velocities[2 * i + 1] = 0.0;
      }

      this.positions[2 * i] = x;
      this.positions[2 * i + 1] = y;
    }
  }
}

class Grid {
  cellSize: number;
  numX: number;
  numY: number;
  inverseCellSize: number;
  numCells: number;
  velocityX: number[];
  velocityY: number[];
  pressure: number[];
  solidity: number[];
  cellType: number[];
  particleDensity: number[];
  particleRestDensity: number;
  gridCellDensity: number[];
  previousVelocityX: number[];
  previousVelocityY: number[];
  sumWeightsX: number[];
  sumWeightsY: number[];

  constructor(width: number, height: number, cellSize: number) {
    this.cellSize = cellSize;

    this.numX = Math.floor(width / cellSize) + 1;
    this.numY = Math.floor(height / cellSize) + 1;

    this.inverseCellSize = 1.0 / this.cellSize;
    this.numCells = this.numX * this.numY;

    this.velocityX = new Array(this.numCells);
    this.velocityY = new Array(this.numCells);

    this.pressure = new Array(this.numCells);
    this.solidity = new Array(this.numCells);
    this.cellType = new Array(this.numCells);

    this.particleDensity = new Array(this.numCells);
    this.gridCellDensity = new Array(this.numCells);
    this.particleRestDensity = 0.0;

    this.previousVelocityX = new Array(this.numCells);
    this.previousVelocityY = new Array(this.numCells);

    this.sumWeightsX = new Array(this.numCells);
    this.sumWeightsY = new Array(this.numCells);

    this.setBoundaries();
  }

  prepareForTransfer(): void {
    this.previousVelocityX = this.velocityX;
    this.previousVelocityY = this.velocityY;
    this.sumWeightsX.fill(0.0);
    this.sumWeightsY.fill(0.0);
    this.velocityX.fill(0.0);
    this.velocityY.fill(0.0);

    for (let i = 0; i < this.numCells; i++) {
      this.cellType[i] =
        this.solidity[i] === 0.0 ? CellType.Solid : CellType.Air;
    }
  }

  setBoundaries(): void {
    for (let x = 0; x < this.numX; x++) {
      for (let y = 0; y < this.numY; y++) {
        const cellIndex = this.getIndex(x, y);
        const isLeftWall = x === 0;
        const isRightWall = x === this.numX - 1;
        const isBottomWall = y === 0;

        this.solidity[cellIndex] =
          isLeftWall || isRightWall || isBottomWall ? 0.0 : 1.0;
      }
    }
  }

  updateParticleDensity(
    particlePositions: number[],
    numParticles: number
  ): void {
    const spacing = this.cellSize;
    const invSpacing = this.inverseCellSize;
    const halfSpacing = 0.5 * spacing;

    this.particleDensity.fill(0.0);

    for (let i = 0; i < numParticles; i++) {
      let x = particlePositions[2 * i];
      let y = particlePositions[2 * i + 1];

      x = clamp(spacing, (this.numX - 1) * spacing, x);
      y = clamp(spacing, (this.numY - 1) * spacing, y);

      const x0 = Math.floor((x - halfSpacing) * invSpacing);
      const y0 = Math.floor((y - halfSpacing) * invSpacing);

      const tx = (x - halfSpacing - x0 * spacing) * invSpacing;
      const ty = (y - halfSpacing - y0 * spacing) * invSpacing;

      const x1 = Math.min(x0 + 1, this.numX - 2);
      const y1 = Math.min(y0 + 1, this.numY - 2);

      const sx = 1.0 - tx;
      const sy = 1.0 - ty;

      if (
        x0 < 0 ||
        x1 < 0 ||
        y0 < 0 ||
        y1 < 0 ||
        x1 >= this.numX ||
        y1 >= this.numY
      ) {
        continue;
      }
      this.particleDensity[x0 * this.numY + y0] += sx * sy;
      this.particleDensity[x1 * this.numY + y0] += tx * sy;
      this.particleDensity[x1 * this.numY + y1] += tx * ty;
      this.particleDensity[x0 * this.numY + y1] += sx * ty;
    }
    if (this.particleRestDensity === 0.0) {
      let sum = 0.0;
      let numFluidCells = 0;

      for (let i = 0; i < this.numCells; i++)
        if (this.cellType[i] === CellType.Fluid) {
          sum += this.particleDensity[i];
          numFluidCells++;
        }
      if (numFluidCells > 0) {
        this.particleRestDensity = sum / numFluidCells;
      }
    }
  }

  updateGridCellDensity(): void {
    for (let i = 0; i < this.numCells; i++) {
      if (this.cellType[i] === CellType.Fluid) {
        let density = this.particleDensity[i];
        if (this.particleRestDensity > 0.0) {
          density /= this.particleRestDensity;
        }
        this.gridCellDensity[i] = clamp(0.0, 1.0, density);
      } else {
        this.gridCellDensity[i] = 0.0;
      }
    }
  }

  solveIncompressibility(
    numIters: number,
    deltaTime: number,
    fluidDensity: number,
    overRelaxation: number,
    compensateDrift: boolean
  ): void {
    this.pressure.fill(0.0);

    this.previousVelocityX = [...this.velocityX];
    this.previousVelocityY = [...this.velocityY];

    const pressureCoeff = (fluidDensity * this.cellSize) / deltaTime;

    for (let iter = 0; iter < numIters; iter++) {
      for (let i = 1; i < this.numX - 1; i++) {
        for (let j = 1; j < this.numY - 1; j++) {
          const c = i * this.numY + j;

          if (this.cellType[c] !== CellType.Fluid) {
            continue;
          }
          const l = (i - 1) * this.numY + j;
          const r = (i + 1) * this.numY + j;

          const b = i * this.numY + j - 1;
          const t = i * this.numY + j + 1;

          const sumS =
            this.solidity[l] +
            this.solidity[r] +
            this.solidity[b] +
            this.solidity[t];
          if (sumS === 0.0) {
            continue;
          }
          let div =
            this.velocityX[r] -
            this.velocityX[c] +
            this.velocityY[t] -
            this.velocityY[c];
          if (
            this.particleRestDensity > 0.0 &&
            compensateDrift &&
            this.particleDensity[c] > this.particleRestDensity
          ) {
            div -= 1.0 * (this.particleDensity[c] - this.particleRestDensity);
          }
          const p = (-div / sumS) * overRelaxation;
          this.pressure[c] += pressureCoeff * p;

          this.velocityX[c] -= this.solidity[l] * p;
          this.velocityX[r] += this.solidity[r] * p;
          this.velocityY[c] -= this.solidity[b] * p;
          this.velocityY[t] += this.solidity[t] * p;
        }
      }
    }
  }

  getIndex(x: number, y: number): number {
    return x * this.numY + y;
  }

  isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.numX && y >= 0 && y < this.numY;
  }

  clampToGrid(x: number, y: number): [number, number] {
    return [
      clamp(this.cellSize, (this.numX - 1) * this.cellSize, x),
      clamp(this.cellSize, (this.numY - 1) * this.cellSize, y),
    ];
  }

  isSolidCell(x: number, y: number): boolean {
    const cellIndex = this.getIndex(x, y);
    return this.cellType[cellIndex] === CellType.Solid;
  }

  interpolateBilinear(
    x: number,
    y: number,
    values: number[],
    dx = 0,
    dy = 0
  ): BilinearResult {
    const { weights, indices } = this.calculateInterpolationData(x, y, dx, dy);
    const value = this.computeInterpolatedValue(weights, indices, values);
    return { value, weights, indices };
  }

  private calculateInterpolationData(
    x: number,
    y: number,
    dx: number,
    dy: number
  ) {
    [x, y] = this.clampToGrid(x, y);

    const x0 = Math.min(
      Math.floor((x - dx) * this.inverseCellSize),
      this.numX - 2
    );
    const y0 = Math.min(
      Math.floor((y - dy) * this.inverseCellSize),
      this.numY - 2
    );
    const x1 = Math.min(x0 + 1, this.numX - 2);
    const y1 = Math.min(y0 + 1, this.numY - 2);

    const tx = (x - dx - x0 * this.cellSize) * this.inverseCellSize;
    const ty = (y - dy - y0 * this.cellSize) * this.inverseCellSize;
    const sx = 1.0 - tx;
    const sy = 1.0 - ty;

    const weights = [sx * sy, tx * sy, tx * ty, sx * ty];
    const indices = [
      this.getIndex(x0, y0),
      this.getIndex(x1, y0),
      this.getIndex(x1, y1),
      this.getIndex(x0, y1),
    ];

    return { weights, indices };
  }

  private computeInterpolatedValue(
    weights: number[],
    indices: number[],
    values: number[]
  ): number {
    return weights.reduce(
      (sum, weight, i) => sum + weight * values[indices[i]],
      0
    );
  }

  getVelocityComponentData(component: number) {
    const h = this.cellSize;
    const h2 = 0.5 * h;

    const dx = component === 0 ? 0.0 : h2;
    const dy = component === 0 ? h2 : 0.0;

    const vel = component === 0 ? this.velocityX : this.velocityY;
    const prevVel =
      component === 0 ? this.previousVelocityX : this.previousVelocityY;
    const sumWeights = component === 0 ? this.sumWeightsX : this.sumWeightsY;

    return { dx, dy, vel, prevVel, sumWeights };
  }

  normalizeVelocitiesByWeights(): void {
    for (let i = 0; i < this.velocityX.length; i++) {
      if (this.sumWeightsX[i] > 0.0) {
        this.velocityX[i] /= this.sumWeightsX[i];
      }
      if (this.sumWeightsY[i] > 0.0) {
        this.velocityY[i] /= this.sumWeightsY[i];
      }
    }
  }

  enforceSolidBoundaryConditions(): void {
    for (let i = 0; i < this.numX; i++) {
      for (let j = 0; j < this.numY; j++) {
        const cellIndex = this.getIndex(i, j);
        const isSolid = this.cellType[cellIndex] === CellType.Solid;

        if (isSolid || (i > 0 && this.isSolidCell(i - 1, j))) {
          this.velocityX[cellIndex] = this.previousVelocityX[cellIndex];
        }

        if (isSolid || (j > 0 && this.isSolidCell(i, j - 1))) {
          this.velocityY[cellIndex] = this.previousVelocityY[cellIndex];
        }
      }
    }
  }
}

interface SimulationConfig {
  density: number;
  width: number;
  height: number;
  fluidPercentage: number;
  grid: {
    cellSize: number;
  };
  particles: {
    maxNum: number;
    radius: number;
    numPerCell: number;
  };
}

/**
 * FLIP Fluid simulation
 * Based on Matthias Müller's FLIP Fluid simulation
 * @see https://matthias-research.github.io/pages/tenMinutePhysics/18-flip.pdf
 */
export class Simulation {
  fluidDensity: number;
  grid: Grid;
  particles: Particles;

  constructor(config: SimulationConfig) {
    this.fluidDensity = config.density;
    this.grid = new Grid(config.width, config.height, config.grid.cellSize);

    this.particles = new Particles(
      config.width,
      config.height,
      config.particles.radius,
      config.particles.maxNum
    );

    const fluidCellsY = Math.floor(
      this.grid.numY * (config.fluidPercentage / 100.0)
    );

    this.particles.initialize(
      config.particles.numPerCell,
      config.grid.cellSize,
      this.grid.numX,
      fluidCellsY
    );
  }

  simulate(deltaTime: number, params: PhysicsParams): void {
    this.integrateParticles(deltaTime, params);
    this.resolveCollisions(params.pointer);
    this.updateGrid(deltaTime, params.fluidDensity);
  }

  private integrateParticles(deltaTime: number, params: PhysicsParams): void {
    const { gravity, scrollVelocity } = params;
    this.particles.integrate(deltaTime, gravity, scrollVelocity);
    this.particles.pushApart(2);
  }

  private resolveCollisions(pointer: PointerState): void {
    const bounds = this.calculateParticleBounds();
    this.particles.handleCollisions(
      bounds.minX,
      bounds.maxX,
      bounds.minY,
      bounds.maxY,
      pointer
    );
  }

  private updateGrid(deltaTime: number, fluidDensity: number): void {
    this.transferParticlesToGrid();
    this.updateParticleDensityOnGrid();
    this.enforceIncompressibility(deltaTime, fluidDensity);

    const flipRatio = 0.9; // PIC vs FLIP ratio
    this.transferGridToParticles(flipRatio);

    this.grid.updateGridCellDensity();
  }

  private updateParticleDensityOnGrid(): void {
    this.grid.updateParticleDensity(
      this.particles.positions,
      this.particles.numParticles
    );
  }

  private enforceIncompressibility(
    deltaTime: number,
    fluidDensity: number
  ): void {
    const iterations = 100;
    const overRelaxation = 1.9;
    const compensateDrift = true;

    this.grid.solveIncompressibility(
      iterations,
      deltaTime,
      fluidDensity,
      overRelaxation,
      compensateDrift
    );
  }

  private calculateParticleBounds() {
    const r = this.particles.radius;
    const h = this.grid.cellSize;

    return {
      minX: h + r,
      maxX: (this.grid.numX - 1) * h - r,
      minY: h + r,
      maxY: (this.grid.numY - 1) * h - r,
    };
  }

  private transferParticlesToGrid(): void {
    this.grid.prepareForTransfer();

    this.updateCellTypesFromParticles();

    this.transferParticleVelocitiesToGrid(0);
    this.transferParticleVelocitiesToGrid(1);

    this.grid.normalizeVelocitiesByWeights();
    this.grid.enforceSolidBoundaryConditions();
  }

  private updateCellTypesFromParticles(): void {
    for (let i = 0; i < this.particles.numParticles; i++) {
      const xi = clamp(
        0,
        this.grid.numX - 1,
        Math.floor(this.particles.positions[2 * i] * this.grid.inverseCellSize)
      );
      const yi = clamp(
        0,
        this.grid.numY - 1,
        Math.floor(
          this.particles.positions[2 * i + 1] * this.grid.inverseCellSize
        )
      );

      if (this.grid.isValidPosition(xi, yi)) {
        const cellIndex = this.grid.getIndex(xi, yi);
        if (this.grid.cellType[cellIndex] === CellType.Air) {
          this.grid.cellType[cellIndex] = CellType.Fluid;
        }
      }
    }
  }

  private transferGridToParticles(flipRatio: number): void {
    this.transferGridVelocitiesToParticles(0, flipRatio);
    this.transferGridVelocitiesToParticles(1, flipRatio);
  }

  private transferParticleVelocitiesToGrid(component: number): void {
    const { dx, dy, vel, sumWeights } =
      this.grid.getVelocityComponentData(component);

    for (let i = 0; i < this.particles.numParticles; i++) {
      const x = this.particles.positions[2 * i];
      const y = this.particles.positions[2 * i + 1];
      const pVel = this.particles.velocities[2 * i + component];

      const result = this.grid.interpolateBilinear(x, y, vel, dx, dy);

      for (let j = 0; j < result.indices.length; j++) {
        const idx = result.indices[j];
        const weight = result.weights[j];
        vel[idx] += pVel * weight;
        sumWeights[idx] += weight;
      }
    }
  }

  private transferGridVelocitiesToParticles(
    component: number,
    flipRatio: number
  ): void {
    const { dx, dy, vel, prevVel } =
      this.grid.getVelocityComponentData(component);

    for (let i = 0; i < this.particles.numParticles; i++) {
      const x = this.particles.positions[2 * i];
      const y = this.particles.positions[2 * i + 1];

      const currentResult = this.grid.interpolateBilinear(x, y, vel, dx, dy);
      const previousResult = this.grid.interpolateBilinear(
        x,
        y,
        prevVel,
        dx,
        dy
      );

      const picVelocity = currentResult.value;
      const flipVelocity =
        this.particles.velocities[2 * i + component] +
        (currentResult.value - previousResult.value);

      this.particles.velocities[2 * i + component] =
        (1.0 - flipRatio) * picVelocity + flipRatio * flipVelocity;
    }
  }
}
