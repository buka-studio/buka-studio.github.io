import { clamp } from "~/app/math";

class SpatialHash {
  private invSpacing: number;
  private numX: number;
  private numY: number;
  private numCells: number;
  private numCellPoints: number[];
  private firstCellPoint: number[];
  private cellPointIds: number[];

  constructor(
    width: number,
    height: number,
    spacing: number,
    maxPoints: number
  ) {
    this.invSpacing = 1.0 / spacing;

    this.numX = Math.floor(width * this.invSpacing) + 1;
    this.numY = Math.floor(height * this.invSpacing) + 1;

    this.numCells = this.numX * this.numY;

    this.numCellPoints = new Array(this.numCells);
    this.firstCellPoint = new Array(this.numCells + 1);
    this.cellPointIds = new Array(maxPoints);
  }

  update(positions: number[], numPoints: number): void {
    this.numCellPoints.fill(0);

    for (let i = 0; i < numPoints; i++) {
      const x = positions[2 * i];
      const y = positions[2 * i + 1];

      const xi = clamp(0, this.numX - 1, Math.floor(x * this.invSpacing));
      const yi = clamp(0, this.numY - 1, Math.floor(y * this.invSpacing));

      this.numCellPoints[xi * this.numY + yi]++;
    }

    let first = 0;
    for (let i = 0; i < this.numCells; i++) {
      first += this.numCellPoints[i];
      this.firstCellPoint[i] = first;
    }

    this.firstCellPoint[this.numCells] = first;

    for (let i = 0; i < numPoints; i++) {
      const x = positions[2 * i];
      const y = positions[2 * i + 1];

      const xi = clamp(0, this.numX - 1, Math.floor(x * this.invSpacing));
      const yi = clamp(0, this.numY - 1, Math.floor(y * this.invSpacing));

      const cellIndex = xi * this.numY + yi;

      this.firstCellPoint[cellIndex]--;
      this.cellPointIds[this.firstCellPoint[cellIndex]] = i;
    }
  }

  query(
    pointIndex: number,
    positions: number[],
    callback: (neighborId: number) => void
  ): void {
    const x = positions[2 * pointIndex];
    const y = positions[2 * pointIndex + 1];

    const pxi = Math.floor(x * this.invSpacing);
    const pyi = Math.floor(y * this.invSpacing);

    const x0 = Math.max(pxi - 1, 0);
    const y0 = Math.max(pyi - 1, 0);

    const x1 = Math.min(pxi + 1, this.numX - 1);
    const y1 = Math.min(pyi + 1, this.numY - 1);

    for (let xi = x0; xi <= x1; xi++) {
      for (let yi = y0; yi <= y1; yi++) {
        const cellIndex = xi * this.numY + yi;

        const first = this.firstCellPoint[cellIndex];
        const last = this.firstCellPoint[cellIndex + 1];

        for (let i = first; i < last; i++) {
          const neighborId = this.cellPointIds[i];

          if (neighborId !== pointIndex) {
            callback(neighborId);
          }
        }
      }
    }
  }
}

export default SpatialHash;
