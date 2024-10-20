import { state } from "../../data/state";
import { ctx } from "../../init";
import { ServerHandler } from "../../server/serverHandler";
import { ERROR_COLOR } from "../../settings";
import { TileType } from "../../types/gameType";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { convertIsometricCoordsToCartesianCoords } from "../../utils/utils";
import { Camera } from "../camera/camera";
import { Builder } from "./builder/builder";
import { Tile } from "./tile";
import { Unit } from "./unit/unit";

export class World {
  private mousePos: Position;
  private world: Tile[][];
  private camera: Camera;

  private builder: Builder;

  private units: Unit[] = [];

  public constructor() {
    this.mousePos = Position.zero();
    this.world = [];
    this.camera = new Camera();

    this.builder = new Builder();

    const testUnit = {
      data: {
        ...state.images.colors[state.game.players[ServerHandler.getId()].color]
          .soldieridle,
        indices: new Indices(5, 5),
        owner: "",
      },
    };
    const testUnit1 = {
      data: {
        ...state.images.colors[state.game.players[ServerHandler.getId()].color]
          .soldieridle,
        indices: new Indices(2, 11),
        owner: "",
      },
    };
    const testUnit2 = {
      data: {
        ...state.images.colors[state.game.players[ServerHandler.getId()].color]
          .soldieridle,
        indices: new Indices(13, 8),
        owner: "",
      },
    };

    this.units.push(new Unit(testUnit));
    this.units.push(new Unit(testUnit1));
    this.units.push(new Unit(testUnit2));

    this.handleCommunication();
  }

  public init(): void {
    ServerHandler.receiveMessage("game:createWorld", (tiles: TileType[][]) => {
      for (let row = 0; row < tiles.length; ++row) {
        this.world.push([]);
        for (let col = 0; col < tiles[row].length; ++col) {
          this.world[row].push(
            new Tile(
              new Indices(row, col),
              state.images.ground[tiles[row][col]].url
            )
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
    this.units.forEach((unit) => unit.draw());
  }

  public update(dt: number, mousePos: Position, key: string): void {
    this.mousePos = mousePos;
    this.camera.update(dt, this.mousePos, key);

    this.world.forEach((tiles) => {
      tiles.forEach((tile) => tile.update(this.camera.getScroll()));
    });

    this.builder.update(dt, this.mousePos, this.camera.getScroll());
    this.units.forEach((unit) => unit.update(dt, this.camera.getScroll()));

    // EZ NEM FOG KELLENI
    // this.printMouseCoords(this.mousePos);
  }

  public handleLeftClick(): void {
    const indices: Indices = convertIsometricCoordsToCartesianCoords(
      new Position(this.mousePos.x, this.mousePos.y),
      this.getCameraScroll()
    );

    if (this.isActionInsideOfTheMap(indices)) {
      this.builder.setBuildingPos(
        this.world[indices.i][indices.j].getBuildingPos()
      );
      this.builder.handleLeftClick(
        indices,
        this.mousePos,
        this.getCameraScroll()
      );
    }

    this.units.forEach((unit) => {
      const unitIndices: Indices = unit.getIndices();
      const unitPos: Position =
        this.world[unitIndices.i][unitIndices.j].getUnitPos();
      const dimension: Dimension = unit.getDimension();

      const newUnitPos: Position = new Position(
        unitPos.x - dimension.width / 2,
        unitPos.y - dimension.height
      );
      unit.setPosition(newUnitPos);
    });
  }

  public handleRightClick(): void {
    this.builder.handleRightClick();
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
      indices.i < this.world.length - 1 &&
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

  public getCameraScroll(): Position {
    return this.camera.getScroll();
  }

  private handleCommunication(): void {
    ServerHandler.receiveMessage("game:pathFind", (path: Indices[]) => {
      path.forEach((indices) => this.world[indices.i][indices.j].setTemp());
    });
  }
}
