import Cell from "./cell";
import grass from "../../assets/grounds/grass_0.png";
import grassWithFlowers from "../../assets/grounds/grass_1.png";
import grassWithRocks from "../../assets/grounds/grass_2.png";
import { TILESIZE } from "../../settings";

import type { CoordsType } from "../../types/coordsType";
import Camera from "../camera/camera";
import { canvasWidth, canvasHeight } from "../../init";

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
        const rnd = Math.floor(Math.random() * 100);
        let tile = "";
        if (rnd < 8) {
          const rnd2 = Math.random();
          if (rnd2 < 0.5) {
            tile = grassWithRocks;
          } else {
            tile = grassWithFlowers;
          }
        } else {
          tile = grass;
        }
        board[i].push(new Cell(i, j, tile));
      }
    }
    return board;
  };

  getCoords = (pos: CoordsType): CoordsType => {
    // const world_x = e.clientX - canvasWidth / 2;
    // const world_y = e.clientY - canvasHeight / 4 - TILESIZE / 2;
    // const world_x = pos[0] - canvasWidth / 2;
    // const world_y = pos[1] - canvasHeight / 4 - TILESIZE / 2;

    const world_x = pos[0] - canvasWidth / 2 + TILESIZE;
    const world_y = pos[1] + canvasHeight / 2 - TILESIZE / 2;

    const cart_y = (2 * world_y - world_x) / 2;
    const cart_x = cart_y + world_x;

    const grid_x = Math.abs(Math.round(cart_x / TILESIZE));
    const grid_y = Math.abs(Math.round(cart_y / TILESIZE));

    return [grid_x, grid_y];
  };

  setTile = (x: number, y: number) => {
    // this.board[x][y].setImageSrc(water);
  };

  draw = (): void => {
    for (let i = 0; i < this.board.length; ++i) {
      for (let j = 0; j < this.board[i].length; ++j) {
        this.board[i][j].drawImage();
        this.board[i][j].drawIsometricGrid();
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
