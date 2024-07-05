import Cell from "./cell";
import grass from "../../assets/grass.png";
import water from "../../assets/water.png";
import { canvasHeight, canvasWidth } from "../../init";
import { TILESIZE } from "../../settings";

import type { CoordsType } from "../../types/coordsType";

export class World {
  private rows: number;
  private cols: number;
  private board: Cell[][];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.board = this.createBoard();
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

  draw = (): void => {
    // this.board.map((rows) => rows.map((cols) => cols.drawNormalGrid()));

    this.board.map((rows) =>
      rows.map((cols) => {
        cols.drawImage();
        cols.drawIsometricGrid();
      })
    );
  };

  update = (dt: number): void => {};

  resize = (): void => {
    this.board.map((rows) =>
      rows.map((cols) => {
        cols.resize();
      })
    );
  };
}
