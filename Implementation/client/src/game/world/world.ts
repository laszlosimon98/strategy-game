import { state } from "../../data/state";
import { ctx } from "../../init";
import { ServerHandler } from "../../server/serverHandler";
import { ERROR_COLOR } from "../../settings";
import { TileType } from "../../types/gameType";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { convertIsometricCoordsToCartesianCoords } from "../../utils/utils";
import { Camera } from "../camera/camera";
import { Builder } from "./builder/builder";
import { Tile } from "./tile";

export class World {
  private mousePos: Position;
  private world: Tile[][];
  private camera: Camera;

  private builder: Builder;

  public constructor() {
    this.mousePos = Position.zero();
    this.world = [];
    this.camera = new Camera();

    this.builder = new Builder();

    this.handleCommunication();
  }

  public init(): void {
    ServerHandler.receiveMessage("game:createWorld", (tiles: TileType[][]) => {
      for (let row = 0; row < tiles.length; ++row) {
        this.world.push([]);
        for (let col = 0; col < tiles[row].length; ++col) {
          this.world[row].push(
            new Tile(row, col, state.images.game.ground[tiles[row][col]].url)
          );
        }
      }
      ServerHandler.receiveMessage("game:startPos", (pos: Indices) => {
        this.camera.setScroll(this.world[pos.i][pos.j].getCameraPos());
      });
    });
  }

  public draw(): void {
    this.world.forEach((tiles) => {
      tiles.forEach((tile) => {
        // tile.drawNormalGrid();
        // tile.drawIsometricGrid();
        tile.draw();
      });
    });

    this.builder.draw();
  }

  public update(dt: number, mousePos: Position, key: string): void {
    this.mousePos = mousePos;
    this.camera.update(dt, this.mousePos, key);

    this.world.forEach((tiles) => {
      tiles.forEach((tile) => tile.updateRenderPos(this.camera.getScroll()));
    });

    this.builder.update(dt, this.mousePos, this.camera.getScroll());

    // EZ NEM FOG KELLENI
    // this.printMouseCoords(this.mousePos);
  }

  public handleClick(): void {
    const indices: Indices = convertIsometricCoordsToCartesianCoords(
      new Position(this.mousePos.x, this.mousePos.y),
      this.getCameraScroll()
    );

    if (this.isActionInsideOfTheMap(indices)) {
      this.builder.setBuildingPos(
        this.world[indices.i][indices.j].getBuildingPos()
      );
      this.builder.handleClick(indices, this.mousePos, this.getCameraScroll());
    }
  }

  public handleMouseMove(mousePos: Position): void {
    const indices: Indices = convertIsometricCoordsToCartesianCoords(
      new Position(this.mousePos.x, this.mousePos.y),
      this.getCameraScroll()
    );

    if (this.isActionInsideOfTheMap(indices)) {
      this.builder.setBuildingPos(
        this.world[indices.i][indices.j].getBuildingPos()
      );
      this.builder.handleMouseMove(mousePos, this.getCameraScroll());
    }
  }

  public moveWorld(): void {}

  public isActionInsideOfTheMap(indices: Indices): boolean {
    return (
      indices.i >= 0 &&
      indices.i < this.world.length &&
      indices.j >= 0 &&
      indices.j < this.world.length
    );
  }

  private printMouseCoords(mousePos: Position): void {
    ctx.save();

    ctx.fillStyle = ERROR_COLOR;
    const position = convertIsometricCoordsToCartesianCoords(
      new Position(mousePos.x, mousePos.y),
      this.camera.getScroll()
    );
    const text = `i: ${position.i}, j: ${position.j}`;

    ctx.fillText(
      text,
      mousePos.x - ctx.measureText(text).width / 2,
      mousePos.y - 5
    );

    ctx.restore();
  }

  public getMap(): Tile[][] {
    return this.world;
  }

  public getCameraScroll(): Position {
    return this.camera.getScroll();
  }

  private handleCommunication(): void {
    ServerHandler.receiveMessage("game:pathFind", (path: Indices[]) => {
      path.forEach((indices) => this.world[indices.i][indices.j].setTemp());
    });
  }
}
