import { state } from "../../data/state";
import { MouseClicker } from "../../interfaces/mouseClicker";
import { ServerHandler } from "../../server/serverHandler";
import { TileType } from "../../types/gameType";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { convertIsometricCoordsToCartesianCoords } from "../../utils/utils";
import { Camera } from "../camera/camera";
import { BuildingManager } from "./building/manager/buildingManager";
import { Cell } from "./cell";
import { UnitManager } from "./unit/manager/unitManager";

export class World implements MouseClicker {
  private mousePos: Position;
  private world: Cell[][];
  private camera: Camera;

  private buildingManager: BuildingManager;
  private unitManager: UnitManager;

  public constructor() {
    this.mousePos = Position.zero();
    this.world = [];
    this.camera = new Camera();

    this.buildingManager = new BuildingManager();
    this.unitManager = new UnitManager();

    this.handleCommunication();

    console.log(state.game);
  }

  public init(): void {
    console.log(state.game.players);
    ServerHandler.receiveMessage("game:createWorld", (tiles: TileType[][]) => {
      for (let row = 0; row < tiles.length; ++row) {
        this.world.push([]);
        for (let col = 0; col < tiles[row].length; ++col) {
          this.world[row].push(
            new Cell(
              new Indices(row, col),
              state.images.ground[tiles[row][col]].url
            )
          );
        }
      }

      ServerHandler.receiveMessage("game:startPos", (pos: Indices) => {
        this.camera.setScroll(this.world[pos.i][pos.j].getCameraPos());
      });

      this.unitManager.setWorld(this.world);
      this.buildingManager.setWorld(this.world);
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

    this.unitManager.draw();
    this.buildingManager.draw();
  }

  public update(dt: number, mousePos: Position, key: string): void {
    this.mousePos = mousePos;
    this.camera.update(dt, this.mousePos, key);

    this.world.forEach((tiles) => {
      tiles.forEach((tile) => tile.update(this.camera.getScroll()));
    });

    this.unitManager.update(dt, this.camera.getScroll());
    this.buildingManager.update(dt, this.camera.getScroll());
  }

  public handleLeftClick(): void {
    const indices: Indices = convertIsometricCoordsToCartesianCoords(
      new Position(this.mousePos.x, this.mousePos.y),
      this.getCameraScroll()
    );

    if (this.isActionInsideOfTheMap(indices)) {
      this.buildingManager.handleLeftClick(
        indices,
        this.mousePos,
        this.getCameraScroll()
      );

      this.unitManager.handleLeftClick(
        indices,
        this.mousePos,
        this.getCameraScroll()
      );
    }
  }

  handleMiddleClick(): void {
    const indices: Indices = convertIsometricCoordsToCartesianCoords(
      new Position(this.mousePos.x, this.mousePos.y),
      this.getCameraScroll()
    );

    if (this.isActionInsideOfTheMap(indices)) {
      this.unitManager.setPos(this.world[indices.i][indices.j].getUnitPos());
      this.unitManager.handleMiddleClick(
        indices,
        this.mousePos,
        this.getCameraScroll()
      );
    }
  }

  public handleRightClick(): void {
    const indices: Indices = convertIsometricCoordsToCartesianCoords(
      new Position(this.mousePos.x, this.mousePos.y),
      this.getCameraScroll()
    );

    this.buildingManager.handleRightClick();
    this.unitManager.handleRightClick(indices);
  }

  public handleMouseMove(mousePos: Position): void {
    const indices: Indices = convertIsometricCoordsToCartesianCoords(
      new Position(this.mousePos.x, this.mousePos.y),
      this.getCameraScroll()
    );

    if (this.isActionInsideOfTheMap(indices)) {
      this.buildingManager.setPos(
        this.world[indices.i][indices.j].getBuildingPos()
      );
      this.buildingManager.handleMouseMove(mousePos, this.getCameraScroll());
      this.unitManager.handleMouseMove(mousePos, this.getCameraScroll());
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

  public getCameraScroll(): Position {
    return this.camera.getScroll();
  }

  private handleCommunication(): void {
    ServerHandler.receiveMessage(
      "game:pathFind",
      ({ path }: { path: Indices[] }) => {
        path.forEach((index) => this.world[index.i][index.j].setTemp());
      }
    );
  }
}
