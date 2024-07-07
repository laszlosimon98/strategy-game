import Cell from "./cell";
import grass from "../../assets/grass.png";
import water from "../../assets/water.png";
import { canvasHeight, canvasWidth } from "../../init";
import { TILESIZE } from "../../settings";

import type { CoordsType } from "../../types/coordsType";
import Camera from "../camera/camera";

export class World {
  private rows: number;
  private cols: number;
  private board: Cell[][];
  private camera: Camera;

  constructor(rows: number, cols: number, camera: Camera) {
    this.rows = rows;
    this.cols = cols;
    this.board = this.createBoard();
    this.camera = camera;
    console.log(`width: ${this.camera.x}, ${this.camera.x + this.camera.w}`);
    console.log(`height: ${this.camera.y}, ${this.camera.y + this.camera.h}`);
  }

  getBoard = (): Cell[][] => {
    return this.board;
  };

  private createBoard = (): Cell[][] => {
    const board: Cell[][] = [];
    for (let i = 0; i < this.rows; ++i) {
      board.push([]);
      for (let j = 0; j < this.cols; ++j) {
        board[i].push(new Cell(i, j, grass));
      }
    }
    return board;
  };

  getCoords = (e: MouseEvent): CoordsType => {
    const world_x = e.clientX - canvasWidth / 2;
    const world_y = e.clientY - canvasHeight / 4 - TILESIZE / 2;

    const cart_y = (2 * world_y - world_x) / 2;
    const cart_x = cart_y + world_x;

    const grid_x = Math.abs(Math.round(cart_x / TILESIZE));
    const grid_y = Math.abs(Math.round(cart_y / TILESIZE));

    return [grid_x, grid_y];
  };

  setTile = (x: number, y: number) => {
    this.board[x][y].setImageSrc(water);
  };

  isCoordsCollideWithCamera = (coords: CoordsType): boolean => {
    const [x, y] = coords;
    const xAxis = x > this.camera.x && x < this.camera.x + this.camera.w;
    const yAxis = y > this.camera.y && y < this.camera.y + this.camera.h;

    return xAxis && yAxis;
  };

  draw = (): void => {
    // this.board.map((rows) => rows.map((cols) => cols.drawNormalGrid()));
    const xStart = Math.floor(Math.max(0, this.camera.x / TILESIZE));
    const xEnd = Math.floor(
      Math.min(
        canvasWidth / TILESIZE,
        (this.camera.x + this.camera.w) / TILESIZE + 1
      )
    );
    const yStart = Math.floor(Math.max(0, this.camera.y / TILESIZE));
    const yEnd = Math.floor(
      Math.min(
        canvasHeight / TILESIZE,
        (this.camera.y + this.camera.h) / TILESIZE + 1
      )
    );

    for (let x = xStart; x < xEnd; ++x) {
      for (let y = yStart; y < yEnd; ++y) {
        this.board[x][y].drawImage();
        this.board[x][y].drawIsometricGrid();
      }
    }

    // this.board.map((cells) =>
    //   cells.map((cell) => {
    //     const coords = cell.getCoords();
    //     for (let i = 0; i < coords.length; ++i) {
    //       const currentCoords = coords[i];
    //       if (this.isCoordsCollideWithCamera(currentCoords)) {
    //         cell.drawImage();
    //         cell.drawIsometricGrid();
    //         break;
    //       }
    //     }
    //   })
    // );
  };

  update = (dt: number): void => {};

  resize = (): void => {
    this.board.map((cells) =>
      cells.map((cell) => {
        cell.resize();
      })
    );
  };
}
