import { canvasHeight, ctx } from "../init";
import { ServerHandler } from "../server/serverHandler";
import { Vector } from "../utils/vector";
import { GameMenu } from "./components/menu/gameMenu";
import { Tile } from "./world/tile";
import { groundAssets } from "./imports/ground";
import { ERROR_COLOR, TILE_SIZE } from "../settings";
import { globalState } from "../data/data";
import { Point } from "../utils/point";
import { MapType } from "../types/gameType";

export class Game {
  private gameMenu: GameMenu;
  private world: Tile[][] = [];

  constructor() {
    this.gameMenu = new GameMenu(
      new Vector(0, (canvasHeight - 500) / 5),
      250,
      500
    );

    this.init();

    ServerHandler.receiveMessage(
      "game:build",
      ({ x, y, type }: { x: number; y: number; type: string }) => {
        this.world[x][y].setTile(type);
      }
    );
  }

  init(): void {
    ServerHandler.receiveMessage("game:createWorld", (data: MapType[][]) => {
      console.log(data);
      for (let i = 0; i < data.length; ++i) {
        this.world.push([]);
        for (let j = 0; j < data[i].length; ++j) {
          this.world[i].push(new Tile(i, j, groundAssets[data[i][j].type]));
        }
      }
    });
  }

  handleClick(e: MouseEvent) {
    this.gameMenu.handleClick();
    const { x, y } = globalState.mousePos;
    const point = this.isoToCart(new Point(x, y));

    const type = groundAssets.rock;
    ServerHandler.sendMessage("game:build", { x: point.x, y: point.y, type });

    // this.world[point.x][point.y].setTile();
  }

  draw(): void {
    this.world.forEach((tiles) => {
      tiles.forEach((tile) => {
        // tile.drawNormalGrid();
        tile.drawIsometricGrid();
        tile.draw();
      });
    });
    this.printMouseCoords();
    this.gameMenu.draw();
  }

  update(dt: number) {
    this.gameMenu.update();
  }

  resize(): void {
    this.gameMenu.resize();
  }

  private printMouseCoords(): void {
    ctx.save();

    ctx.fillStyle = ERROR_COLOR;
    const { x, y } = globalState.mousePos;
    const point = this.isoToCart(new Point(x, y));
    const text = `x: ${point.x}, y: ${point.y}`;

    ctx.fillText(text, x - ctx.measureText(text).width / 2, y - 5);

    ctx.restore();
  }

  private isoToCart = (point: Point): Point => {
    const world_x = point.x;
    const world_y = point.y;

    const cart_y = (2 * world_y - world_x) / 2;
    const cart_x = cart_y + world_x;

    const grid_x = Math.floor(cart_x / TILE_SIZE);
    const grid_y = Math.floor(cart_y / TILE_SIZE);

    return new Point(grid_x, grid_y);
  };
}
