import { ctx } from "../../init";
import { TILESIZE } from "../../settings";

type CoordsType = [number, number];

class Cell {
  private x: number;
  private y: number;

  private normalCoords: CoordsType[];
  private isometricCoords: CoordsType[];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.normalCoords = this.createNormalCoords();
    this.isometricCoords = this.normalCoords.map((coords) =>
      this.convertNormalCoordstoIsometricCords(coords)
    );
  }

  getNormalCoords = (): CoordsType[] => {
    return this.normalCoords;
  };

  getIsometricCoords = (): CoordsType[] => {
    return this.isometricCoords;
  };

  drawNormalGrid = () => {
    ctx.beginPath();
    for (let i = 0; i < this.normalCoords.length - 1; ++i) {
      const [currentX, currentY] = this.normalCoords[i];
      const [nextX, nextY] = this.normalCoords[i + 1];

      ctx.moveTo(currentX, currentY);
      ctx.lineTo(nextX, nextY);
    }
    ctx.stroke();
  };

  drawIsometricGrid = () => {
    ctx.beginPath();
    for (let i = 0; i < this.isometricCoords.length - 1; ++i) {
      const [currentX, currentY] = this.isometricCoords[i];
      const [nextX, nextY] = this.isometricCoords[i + 1];

      ctx.moveTo(currentX, currentY);
      ctx.lineTo(nextX, nextY);
    }
    ctx.stroke();
  };

  private createNormalCoords = (): CoordsType[] => {
    return [
      [this.x * TILESIZE, this.y * TILESIZE],
      [this.x * TILESIZE + TILESIZE, this.y * TILESIZE],
      [this.x * TILESIZE + TILESIZE, this.y * TILESIZE + TILESIZE],
      [this.x * TILESIZE, this.y * TILESIZE + TILESIZE],
    ];
  };

  private convertNormalCoordstoIsometricCords = (
    coord: CoordsType
  ): CoordsType => {
    const [x, y] = coord;
    const iso_x = x - y;
    const iso_y = (x + y) / 2;

    return [iso_x, iso_y];
  };
}

export default Cell;
