import { canvasHeight, ctx } from "../init";
import { ServerHandler } from "../server/serverHandler";
import { Vector } from "../utils/vector";
import { GameMenu } from "./menu/gameMenu";
import { Tile } from "./world/tile";
import { groundAssets } from "./imports/ground";
import { ERROR_COLOR, TILE_SIZE } from "../settings";
import { Point } from "../utils/point";
import { MapType } from "../types/gameType";
import { Camera } from "./camera/camera";
import { Building } from "./building/building";
import { Dimension } from "../utils/dimension";
import { building } from "./imports/building";

export class Game {
  private gameMenu: GameMenu;
  private world: Tile[][] = [];

  private mousePos: Point;
  private key: string;

  private camera: Camera;

  private buildings: Building[] = [];

  constructor() {
    this.gameMenu = new GameMenu(
      new Vector(0, (canvasHeight - 500) / 5),
      250,
      500
    );

    this.mousePos = Point.zero();
    this.key = "";

    this.camera = new Camera();

    this.init();

    ServerHandler.receiveMessage(
      "game:build",
      ({
        x,
        y,
        image,
        width,
        height,
      }: {
        x: number;
        y: number;
        image: string;
        width: number;
        height: number;
      }) => {
        this.build(x, y, image, width, height);
      }
    );
  }

  init(): void {
    ServerHandler.receiveMessage("game:createWorld", (data: MapType[][]) => {
      for (let i = 0; i < data.length; ++i) {
        this.world.push([]);
        for (let j = 0; j < data[i].length; ++j) {
          this.world[i].push(new Tile(i, j, groundAssets[data[i][j].type]));
        }
      }
    });
  }

  draw(): void {
    this.world.forEach((tiles) => {
      tiles.forEach((tile) => {
        // tile.drawNormalGrid();
        tile.drawIsometricGrid();
        tile.draw();
      });
    });

    this.buildings.forEach((building) => building.draw());
    this.printMouseCoords();
    this.gameMenu.draw();
  }

  update(dt: number) {
    this.gameMenu.update(this.mousePos);
    this.camera.update(dt, this.mousePos, this.key);

    this.world.forEach((tiles) => {
      tiles.forEach((tile) => {
        tile.updateRenderPos(this.camera.getCameraScroll());
      });
    });

    this.buildings.forEach((building) =>
      building.update(this.camera.getCameraScroll())
    );
  }

  handleClick() {
    this.gameMenu.handleClick(this.mousePos);
    const point = this.convertIsometricCoordsToCartesianCoords(
      new Point(this.mousePos.x, this.mousePos.y)
    );

    const type = building.woodCutter;

    if (
      point.x >= 0 &&
      point.x < this.world.length &&
      point.y >= 0 &&
      point.y < this.world.length
    ) {
      ServerHandler.sendMessage("game:build", {
        x: point.x,
        y: point.y,
        image: type.image,
        width: type.width,
        height: type.height,
      });
    }
  }

  handleMouseMove(pos: Point): void {
    this.mousePos.setPoint(pos);
  }

  handleKeyPress(key: string): void {
    this.key = key;
  }

  resize(): void {}

  private build(
    x: number,
    y: number,
    image: string,
    width: number,
    height: number
  ): void {
    const pos: Point = this.world[x][y].getBuildingPos();

    const building: Building = new Building(image, width, height);
    const boundary: Dimension = building.getBoundary();

    const buildingPos: Point = new Point(
      pos.x - boundary.width / 2,
      pos.y - boundary.height
    );

    building.setPos(buildingPos);

    this.buildings.push(building);
    console.log("new Building");
  }

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
