import { canvasHeight, ctx } from "../init";
import { ServerHandler } from "../server/serverHandler";
import { Vector } from "../utils/vector";
import { GameMenu } from "./menu/gameMenu";
import { Tile } from "./world/tile";
import { ERROR_COLOR, TILE_SIZE } from "../settings";
import { Position } from "../utils/position";
import { Camera } from "./camera/camera";
import { Building } from "./building/building";
import { Dimension } from "../utils/dimension";
import { MouseButtons } from "./utils/mouseEnum";
import { TileType } from "../types/gameType";
import { Indices } from "../utils/indices";
import { images } from "../data/images";

export class Game {
  private gameMenu: GameMenu;
  private world: Tile[][] = [];

  private mousePos: Position;
  private key: string;

  private camera: Camera;

  private buildings: Building[] = [];

  private pathStart: Indices;
  private pathEnd: Indices;
  private path: Indices[] = [];

  public constructor() {
    this.pathStart = Indices.zero();
    this.pathEnd = Indices.zero();

    this.gameMenu = new GameMenu(
      new Vector(0, (canvasHeight - 500) / 5),
      250,
      500
    );

    this.mousePos = Position.zero();
    this.key = "";

    this.camera = new Camera();
    this.init();
    this.handleCommunication();
    console.log(images.game);
  }

  private init(): void {
    ServerHandler.receiveMessage("game:createWorld", (tiles: TileType[][]) => {
      for (let row = 0; row < tiles.length; ++row) {
        this.world.push([]);
        for (let col = 0; col < tiles[row].length; ++col) {
          this.world[row].push(
            new Tile(row, col, images.game.ground[tiles[row][col]])
          );
        }
      }

      ServerHandler.receiveMessage("game:startPos", (pos: Indices) => {
        // this.camera.setScroll(this.world[pos.i][pos.j].getCameraPos());
      });
    });
  }

  public draw(): void {
    this.world.forEach((tiles) => {
      tiles.forEach((tile) => {
        // tile.drawNormalGrid();
        tile.drawIsometricGrid();
        tile.draw();
      });
    });

    this.buildings.forEach((building) => building.draw());
    this.printMouseCoords();
    // this.gameMenu.draw();
  }

  public update(dt: number) {
    this.gameMenu.update(this.mousePos);
    this.camera.update(dt, this.mousePos, this.key);

    this.world.forEach((tiles) => {
      tiles.forEach((tile) => {
        tile.updateRenderPos(this.camera.getScroll());
      });
    });

    this.buildings.forEach((building) =>
      building.update(this.camera.getScroll())
    );
  }

  public handleClick(e: MouseEvent) {
    const button = e.button;
    this.gameMenu.handleClick(this.mousePos);

    const indices: Indices = this.convertIsometricCoordsToCartesianCoords(
      new Position(this.mousePos.x, this.mousePos.y)
    );

    switch (button) {
      case MouseButtons.Left:
        this.pathStart.setIndices(new Indices(indices.i, indices.j));
        break;
      case MouseButtons.Right:
        this.pathEnd.setIndices(new Indices(indices.i, indices.j));
        ServerHandler.sendMessage("game:pathFind", {
          start: this.pathStart,
          end: this.pathEnd,
        });
        break;
      case MouseButtons.Middle:
        const image = images.game.buildings.woodcutter6;

        if (this.isClickOnTheMap(indices)) {
          ServerHandler.sendMessage("game:build", {
            indices,
            image,
          });
        }
        break;
      case MouseButtons.Forward:
        ServerHandler.sendMessage("game:destroy", indices);
        break;
    }
  }

  public handleMouseMove(pos: Position): void {
    this.mousePos.setPosition(pos);
  }

  public handleKeyPress(key: string): void {
    this.key = key;
  }

  public resize(): void {}

  private isClickOnTheMap(indices: Indices): boolean {
    return (
      indices.i >= 0 &&
      indices.i < this.world.length &&
      indices.j >= 0 &&
      indices.j < this.world.length
    );
  }

  private build(indices: Indices, image: string): void {
    if (image) {
      const i = indices.i;
      const j = indices.j;

      const pos: Position = this.world[i][j].getBuildingPos();

      const building: Building = new Building(new Indices(i, j), image);
      building.setDimension(
        new Dimension(building.image.width, building.image.height)
      );
      const dimension: Dimension = building.getDimension();
      console.log(building);

      const buildingPos: Position = new Position(
        pos.x - dimension.width / 2,
        pos.y - dimension.height
      );

      building.setPos(buildingPos);

      this.buildings.push(building);
    }
  }

  private destroy(indices: Indices): void {
    for (let i = this.buildings.length - 1; i >= 0; --i) {
      const buildingIndices = this.buildings[i].getIndices();

      if (buildingIndices.i === indices.i && buildingIndices.j === indices.j) {
        this.buildings.splice(i, 1);
      }
    }
  }

  private printMouseCoords(): void {
    ctx.save();

    ctx.fillStyle = ERROR_COLOR;
    const position = this.convertIsometricCoordsToCartesianCoords(
      new Position(this.mousePos.x, this.mousePos.y)
    );
    const text = `i: ${position.i}, j: ${position.j}`;

    ctx.fillText(
      text,
      this.mousePos.x - ctx.measureText(text).width / 2,
      this.mousePos.y - 5
    );

    ctx.restore();
  }

  private convertIsometricCoordsToCartesianCoords = (
    position: Position
  ): Indices => {
    const world_x = position.x - this.camera.getScroll().x;
    const world_y = position.y - this.camera.getScroll().y;

    const cart_y = (2 * world_y - world_x) / 2;
    const cart_x = cart_y + world_x;

    const grid_x = Math.floor(cart_x / TILE_SIZE);
    const grid_y = Math.floor(cart_y / TILE_SIZE);

    return new Indices(grid_x, grid_y);
  };

  private handleCommunication(): void {
    ServerHandler.receiveMessage(
      "game:build",
      ({ indices, image }: { indices: Indices; image: string }) => {
        this.build(indices, image);
      }
    );

    ServerHandler.receiveMessage("game:destroy", (indices: Indices) => {
      this.destroy(indices);
    });

    ServerHandler.receiveMessage("game:pathFind", (path: Indices[]) => {
      this.path = path;
      this.path.forEach((indices) =>
        this.world[indices.i][indices.j].setTemp()
      );
    });
  }
}
