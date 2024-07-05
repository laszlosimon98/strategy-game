import Cell from "./cell";
import grass from "../../assets/grass.png";

interface WorldInterface {}

export class World implements WorldInterface {
  private rows: number;
  private cols: number;
  private board: Cell[][];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.board = this.createBoard();
  }

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

  draw = (): void => {
    // this.board.map((rows) => rows.map((cols) => cols.drawNormalGrid()));

    this.board.map((rows) =>
      rows.map((cols) => {
        cols.drawImage();
        cols.drawIsometricGrid();
      })
    );
  };

  getBoard = (): Cell[][] => {
    return this.board;
  };
}
