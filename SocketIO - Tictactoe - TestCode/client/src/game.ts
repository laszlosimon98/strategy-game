import { Socket } from "socket.io-client";
import { Rect } from "./rect";

type PlayerType = {
  id: string;
  symbol: string;
  isMyTurn: boolean;
};

type BoardType = string[][];

type ResponseType = {
  board: BoardType;
  users: PlayerType[];
};

export enum STATES {
  CONNECTED,
  WAITING,
  READY,
}

const initialState = {
  board: new Array(3).fill([]).map(() => new Array(3).fill("")),
  player: {
    id: "",
    symbol: "",
    isMyTurn: false,
  },
};

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private width: number;
  private height: number;
  private cellSize: number;

  private state: STATES = STATES.CONNECTED;
  private startButton: Rect;

  private socket: Socket;

  private board: BoardType;

  private playerState: PlayerType;
  private winner: string | null;

  constructor(width: number, height: number, socket: Socket) {
    this.width = width;
    this.height = height;
    this.socket = socket;

    this.board = initialState.board.map((x) => x.map((y) => y));
    this.playerState = { ...initialState.player };

    this.winner = null;

    [this.canvas, this.ctx] = this.createCanvas(width, height);
    const gameDiv = document.querySelector("#game") as HTMLDivElement;
    gameDiv.appendChild(this.canvas);

    this.cellSize = this.width / 3;

    this.startButton = new Rect(
      this.width / 2 - 50,
      this.height / 2 - 25,
      100,
      50,
      "Start"
    );

    window.addEventListener("contextmenu", (e) => e.preventDefault());

    this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
      console.log(document.body.clientHeight);
      console.log(document.body.clientWidth);
      switch (this.state) {
        case STATES.CONNECTED:
          this.pressStart(e);
          break;
        case STATES.READY:
          if (this.playerState.isMyTurn) {
            this.makeMove(e);
            this.checkWinner();
            if (this.winner !== null) {
              this.socket.emit("winner", socket.id);
            }
          }
          break;
      }
    });

    this.socket.on("connect", () => {
      console.log(`${this.socket.id} user connected`);
    });

    this.socket.on("gameStarts", (players: PlayerType[]) => {
      const player = players.find(
        (player) => player.id === this.socket.id
      ) as PlayerType;

      this.playerState = { ...player };
      this.state = STATES.READY;
      this.socket.emit("initialState", { board: this.board });
    });

    this.socket.on(
      "makeMoveResponse",
      ({ board, users: players }: ResponseType) => {
        const player = players.find(
          (player) => player.id === this.socket.id
        ) as PlayerType;

        this.playerState = { ...player };
        this.board = board.map((x) => x.map((y) => y));
      }
    );

    this.socket.on("winner", (winner) => {
      this.playerState.isMyTurn = false;
      console.log(`Winner is: ${winner.symbol}`);

      setTimeout(() => {
        this.socket.emit("restart", {});
      }, 1000);
    });

    this.socket.on("playerLeaves", () => this.setDefault());
    this.socket.on("restart", () => this.setDefault());
  }

  setDefault = () => {
    this.winner = null;
    this.state = STATES.CONNECTED;
    this.board = initialState.board.map((x) => x.map((y) => y));
    this.playerState = { ...initialState.player };
  };

  checkWinner = () => {
    for (let i = 0; i < this.board.length; ++i) {
      if (
        this.board[0][i] !== "" &&
        this.board[0][i] === this.board[1][i] &&
        this.board[0][i] === this.board[2][i]
      ) {
        this.winner = this.board[0][i];
      }

      if (
        this.board[i][0] !== "" &&
        this.board[i][0] === this.board[i][1] &&
        this.board[i][0] === this.board[i][2]
      ) {
        this.winner = this.board[i][0];
      }
    }

    if (
      this.board[0][0] !== "" &&
      this.board[0][0] === this.board[1][1] &&
      this.board[0][0] === this.board[2][2]
    ) {
      this.winner = this.board[0][0];
    }

    if (
      this.board[2][0] !== "" &&
      this.board[2][0] === this.board[1][1] &&
      this.board[2][0] === this.board[0][2]
    ) {
      this.winner = this.board[2][0];
    }
  };

  pressStart = (e: MouseEvent) => {
    const { x, y } = this.getCursorPos(e);
    if (this.startButton.collide({ x, y })) {
      this.setDefault();

      this.socket.emit("connectPlayer", this.socket.id);
      this.state = STATES.WAITING;
    }
  };

  makeMove = (e: MouseEvent) => {
    const { x, y } = this.getCursorPos(e);
    const [i, j] = [
      Math.floor(x / this.cellSize),
      Math.floor(y / this.cellSize),
    ];

    if (this.board[j][i] === "") {
      this.board[j][i] = this.playerState.symbol;
      this.socket.emit("makeMove", {
        id: this.socket.id,
        board: this.board,
      });
    }
  };

  createCanvas = (
    width: number,
    height: number
  ): [HTMLCanvasElement, CanvasRenderingContext2D] => {
    const canvas = <HTMLCanvasElement>document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = width;
    canvas.height = height;

    return [canvas, ctx];
  };

  draw = (): void => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    switch (this.state) {
      case STATES.CONNECTED: {
        this.startButton.draw(this.ctx);
        break;
      }
      case STATES.WAITING: {
        this.ctx.font = "48px serif";
        this.ctx.fillText(
          "Waiting...",
          this.width / 2 - this.ctx.measureText("Waiting").width / 2,
          this.height / 2 + 10
        );
        break;
      }
      case STATES.READY: {
        const cellSize = this.width / 3;

        // vertical
        for (let v = 1; v <= 2; v++) {
          this.ctx.moveTo(v * cellSize, 0);
          this.ctx.lineTo(v * cellSize, this.height);
          this.ctx.stroke();
        }

        // horizontal
        for (let v = 1; v <= 2; v++) {
          this.ctx.moveTo(0, v * cellSize);
          this.ctx.lineTo(this.width, v * cellSize);
          this.ctx.stroke();
        }

        for (let i = 0; i < 3; ++i) {
          for (let j = 0; j < 3; ++j) {
            this.drawSymbol(i, j);
          }
        }
        break;
      }
    }
  };

  update = (): void => {};

  drawSymbol = (i: number, j: number): void => {
    this.ctx.beginPath();
    if (this.board[j][i] === "X") {
      this.ctx.moveTo(i * this.cellSize + 20, j * this.cellSize + 20);
      this.ctx.lineTo(
        i * this.cellSize + this.cellSize - 20,
        j * this.cellSize + this.cellSize - 20
      );

      this.ctx.moveTo(
        i * this.cellSize + this.cellSize - 20,
        j * this.cellSize + 20
      );
      this.ctx.lineTo(
        i * this.cellSize + 20,
        j * this.cellSize + this.cellSize - 20
      );
    }

    if (this.board[j][i] === "O") {
      this.ctx.beginPath();
      this.ctx.arc(
        i * this.cellSize + this.cellSize / 2,
        j * this.cellSize + this.cellSize / 2,
        75,
        0,
        2 * Math.PI
      );
    }
    this.ctx.stroke();
    this.ctx.closePath();
  };

  getCursorPos = (e: { clientX: number; clientY: number }) => {
    let rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };
}
