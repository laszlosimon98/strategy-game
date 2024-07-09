import { canvasHeight, canvasWidth, ctx } from "../../init";
import { TILESIZE } from "../../settings";

import type { CoordsType, IsometricWorldType } from "../../types/coordsType";

class Cell {
  private x: number;
  private y: number;

  private normalCoords: CoordsType[];
  private isometricWorld: IsometricWorldType;

  private image: HTMLImageElement;
  private building: HTMLImageElement;

  private horizontalPos: number;
  private verticalPos: number;

  constructor(x: number, y: number, imageSrc: string) {
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = imageSrc;

    this.building = new Image();

    this.horizontalPos = 0;
    this.verticalPos = 0;

    this.normalCoords = this.createNormalCoords();

    const calcCoords: CoordsType[] = this.normalCoords.map((coords) =>
      this.convertNormalCoordsToIsometricCords(coords)
    );

    this.isometricWorld = {
      isometricCoords: calcCoords,
      renderPos: [
        calcCoords[0][0] + this.horizontalPos - TILESIZE,
        calcCoords[0][1] + this.verticalPos - 1,
      ],
      buildingPos: [
        calcCoords[0][0] + this.horizontalPos - TILESIZE * 2,
        calcCoords[0][1] + this.verticalPos - this.building.height,
      ],
    };
  }

  getBuildingPos = (): CoordsType => {
    return this.isometricWorld.buildingPos;
  };

  update = (dir: { x: number; y: number }): void => {
    this.x += dir.x;
    this.y += dir.y;

    this.normalCoords = this.createNormalCoords();
    const calcCoords: CoordsType[] = this.normalCoords.map((coords) =>
      this.convertNormalCoordsToIsometricCords(coords)
    );

    this.isometricWorld = {
      ...this.isometricWorld,
      isometricCoords: calcCoords,
      renderPos: [
        calcCoords[0][0] + this.horizontalPos - TILESIZE,
        calcCoords[0][1] + this.verticalPos - 1,
      ],
      buildingPos: [
        calcCoords[2][0] + this.horizontalPos - this.building.width / 2,
        calcCoords[2][1] + this.verticalPos - this.building.height,
      ],
    };
  };

  getCoords = (): CoordsType[] => {
    return this.isometricWorld.isometricCoords;
  };

  setImageSrc = (src: string): void => {
    this.image.src = src;
  };

  setBuilding = (src: string): void => {
    this.building.src = src;
  };

  resize = (): void => {
    this.horizontalPos = canvasWidth / 2;
    this.verticalPos = canvasHeight / 4;

    this.normalCoords = this.createNormalCoords();

    const calcCoords: CoordsType[] = this.normalCoords.map((coords) =>
      this.convertNormalCoordsToIsometricCords(coords)
    );

    this.isometricWorld = {
      ...this.isometricWorld,
      isometricCoords: calcCoords,
      renderPos: [
        calcCoords[0][0] + this.horizontalPos - TILESIZE,
        calcCoords[0][1] + this.verticalPos - 1,
      ],
      buildingPos: [
        calcCoords[0][0] + this.horizontalPos - TILESIZE,
        calcCoords[0][1] + this.verticalPos - 1,
      ],
    };
  };

  drawNormalGrid = (): void => {
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

  drawIsometricGrid = (): void => {
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

  drawImage = (): void => {
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
