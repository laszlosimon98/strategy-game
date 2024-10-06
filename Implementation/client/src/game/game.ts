import { canvasHeight, canvasWidth, ctx } from "../init";
import { ServerHandler } from "../server/serverHandler";
import { Vector } from "../utils/vector";
import { GameMenu } from "./components/menu/gameMenu";
import { Tile } from "./world/tile";
import { groundAssets } from "./imports/ground";
import { ERROR_COLOR, TILE_SIZE } from "../settings";
import { globalState } from "../data/data";
import { Point } from "../utils/point";
import { MapType } from "../types/gameType";
import { Camera } from "./camera/camera";

export class Game {
  private gameMenu: GameMenu;
  private world: Tile[][] = [];
  private mousePos: Point;

  private camera: Camera;

  constructor() {
    this.gameMenu = new GameMenu(
      new Vector(0, (canvasHeight - 500) / 5),
      250,
      500
    );

    this.mousePos = Point.zero();

    this.camera = new Camera();

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

  handleClick() {
    this.gameMenu.handleClick(this.mousePos);
    const point = this.convertIsometricCoordsToCartesianCoords(
      new Point(this.mousePos.x, this.mousePos.y)
    );

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
    // this.gameMenu.draw();
  }

  update(dt: number) {
    this.gameMenu.update(this.mousePos);
    this.camera.update(this.mousePos);

    this.world.forEach((tiles) => {
      tiles.forEach((tile) => {
        tile.updateRenderPos(this.camera.getCameraScroll());
      });
    });
  }

  updateMousePos(pos: Point): void {
    this.mousePos.setPoint(pos);
  }

  resize(): void {}

  private printMouseCoords(): void {
    ctx.save();

    ctx.fillStyle = ERROR_COLOR;
    const point = this.convertIsometricCoordsToCartesianCoords(
      new Point(this.mousePos.x, this.mousePos.y)
    );
    const text = `x: ${point.x}, y: ${point.y}`;

    ctx.fillText(
      text,
      this.mousePos.x - ctx.measureText(text).width / 2,
      this.mousePos.y - 5
    );

    ctx.restore();
  }

  private convertIsometricCoordsToCartesianCoords = (point: Point): Point => {
    const world_x = point.x - this.camera.getCameraScroll().x;
    const world_y = point.y - this.camera.getCameraScroll().y;

    const cart_y = (2 * world_y - world_x) / 2;
    const cart_x = cart_y + world_x;

    const grid_x = Math.floor(cart_x / TILE_SIZE);
    const grid_y = Math.floor(cart_y / TILE_SIZE);

    return new Point(grid_x, grid_y);
  };
}
