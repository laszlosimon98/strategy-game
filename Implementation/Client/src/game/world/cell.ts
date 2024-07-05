import { ctx } from "../../init";
import { TILESIZE } from "../../settings";

type CoordsType = [number, number];

type IsometricWorldType = {
  isometricCoords: CoordsType[];
  renderPos: CoordsType;
};

class Cell {
  private x: number;
  private y: number;

  private normalCoords: CoordsType[];
  private isometricWorld: IsometricWorldType;

  private image: HTMLImageElement;

  private screenWidth: number;
  private screenHeight: number;

  private horizontalPos: number;
  private verticalPos: number;

  constructor(x: number, y: number, imageSrc: string) {
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = imageSrc;

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.horizontalPos = this.screenWidth / 2;
    this.verticalPos = this.screenHeight / 4;

    this.normalCoords = this.createNormalCoords();

    const calcCoords: CoordsType[] = this.normalCoords.map((coords) =>
      this.convertNormalCoordsToIsometricCords(coords)
    );

    this.isometricWorld = {
      isometricCoords: calcCoords,
      renderPos: [
        calcCoords[0][0] + this.screenWidth / 2 - TILESIZE,
        calcCoords[0][1] + this.screenHeight / 4 - 1,
      ],
    };
  }

  drawNormalGrid = () => {
    ctx.beginPath();
    const coords = this.normalCoords;

    for (let i = 0; i < coords.length - 1; ++i) {
      const [currentX, currentY] = coords[i];
      const [nextX, nextY] = coords[i + 1];

      ctx.moveTo(currentX, currentY);
      ctx.lineTo(nextX, nextY);
    }

    const [lastX, lastY] = coords[coords.length - 1];
    const [firstX, firstY] = coords[0];

    ctx.moveTo(lastX, lastY);
    ctx.lineTo(firstX, firstY);

    ctx.stroke();
  };

  drawIsometricGrid = () => {
    ctx.beginPath();
    const coords = this.isometricWorld.isometricCoords;

    for (let i = 0; i < coords.length - 1; ++i) {
      const [currentX, currentY] = coords[i];
      const [nextX, nextY] = coords[i + 1];

      ctx.moveTo(currentX + this.horizontalPos, currentY + this.verticalPos);
      ctx.lineTo(nextX + this.horizontalPos, nextY + this.verticalPos);
    }

    const [lastX, lastY] = coords[coords.length - 1];
    const [firstX, firstY] = coords[0];

    ctx.moveTo(lastX + this.horizontalPos, lastY + this.verticalPos);
    ctx.lineTo(firstX + this.horizontalPos, firstY + this.verticalPos);

    ctx.stroke();
  };

  drawImage = () => {
    ctx.drawImage(this.image, ...this.isometricWorld.renderPos);
  };

  private createNormalCoords = (): CoordsType[] => {
    return [
      [this.x * TILESIZE, this.y * TILESIZE],
      [this.x * TILESIZE + TILESIZE, this.y * TILESIZE],
      [this.x * TILESIZE + TILESIZE, this.y * TILESIZE + TILESIZE],
      [this.x * TILESIZE, this.y * TILESIZE + TILESIZE],
    ];
  };

  private convertNormalCoordsToIsometricCords = (
    coord: CoordsType
  ): CoordsType => {
    const [x, y] = coord;
    const iso_x = x - y;
    const iso_y = (x + y) / 2;

    return [iso_x, iso_y];
  };
}

export default Cell;
