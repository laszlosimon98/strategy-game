import Cell from "./cell";
import grass from "../../assets/grass.png";
import water from "../../assets/water.png";
import { CAMERA_SPEED, COLS, ROWS, TILESIZE } from "../../settings";

import type { CoordsType } from "../../types/coordsType";
import Camera from "../camera/camera";
import { offset } from "../game";
import { canvasHeight, canvasWidth } from "../../init";

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
    // const world_x = e.clientX - canvasWidth / 2;
    // const world_y = e.clientY - canvasHeight / 4 - TILESIZE / 2;
    const world_x = e.clientX - offset.x;
    const world_y = e.clientY - offset.y;

    const cart_y = (2 * world_y - world_x) / 2;
    const cart_x = cart_y + world_x;

    const grid_x = Math.abs(Math.round(cart_x / TILESIZE));
    const grid_y = Math.abs(Math.round(cart_y / TILESIZE));

    return [grid_x, grid_y];
  };

  setTile = (x: number, y: number) => {
    this.board[x][y].setImageSrc(water);
  };

  draw = (): void => {
    // this.board.map((rows) => rows.map((cols) => cols.drawNormalGrid()));
    // const { dx: offsetX, dy: offsetY } = this.camera.getOffset();
    // const xStart = Math.max(0, Math.floor(offsetX / TILESIZE + 1));
    // const xEnd = ROWS;
    // const yStart = 0;
    // const yEnd = COLS;
    // console.log(xStart);
    // for (let x = xStart; x < xEnd; ++x) {
    //   for (let y = yStart; y < yEnd; ++y) {
    //     this.board[x][y].drawNormalGrid();
    //   }
    // }
    // // for (let x = xStart; x < xEnd; ++x) {
    // //   for (let y = yStart; y < yEnd; ++y) {
    // //     this.board[x][y].drawIsometricGrid();
    // //     this.board[x][y].drawImage();
    // //   }
    // // }
    for (let i = 0; i < this.board.length; ++i) {
      for (let j = 0; j < this.board[i].length; ++j) {
        this.board[i][j].drawIsometricGrid();
        this.board[i][j].drawImage();
      }
    }
  };

  update = (dt: number): void => {
    const { dx: dirX, dy: dirY } = this.camera.getDir();
    const dirVector = {
      x: dirX,
      y: dirY,
    };

    for (let i = 0; i < this.board.length; ++i) {
      for (let j = 0; j < this.board[i].length; ++j) {
        this.board[i][j].update(dirVector);
      }
    }
  };

  resize = (): void => {
    this.board.map((cells) =>
      cells.map((cell) => {
        cell.resize();
      })
    );
  };
}
