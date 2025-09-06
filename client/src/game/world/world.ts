import { Camera } from "@/game/camera/camera";
import { imagesFromState } from "@/game/data/state";
import { MouseClicker } from "@/game/interfaces/mouse-clicker";
import { ctx } from "@/game/main";
import { ERROR_COLOR } from "@/game/settings";
import { Indices } from "@/game/utils/indices";
import { Position } from "@/game/utils/position";
import { convertMouseIsometricCoordsToCartesianCoords } from "@/game/utils/utils";
import { BuildingManager } from "@/game/world/building/building-manager";
import { Cell } from "@/game/world/cell";
import { UnitManager } from "@/game/world/unit/unit-manager";
import { ServerHandler } from "@/server/server-handler";
import { TileType } from "@/services/types/game.types";

export class World implements MouseClicker {
  private mousePos: Position; // temp for printMouseCoord
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
  }

  // FIXME: nem az igazi ez így
  public init(): void {
    ServerHandler.receiveMessage(
      "game:createWorld",
      ({ tiles, obstacles }: { tiles: TileType[][]; obstacles: any }) => {
        console.log("initWorld");
        for (let row = 0; row < tiles.length; ++row) {
          this.world.push([]);
          for (let col = 0; col < tiles[row].length; ++col) {
            if (obstacles[row][col]) {
              this.world[row].push(
                new Cell(
                  new Indices(row, col),
                  imagesFromState.ground[tiles[row][col]].url,
                  imagesFromState.obstacles[obstacles[row][col]].url
                )
              );
            } else {
              this.world[row].push(
                new Cell(
                  new Indices(row, col),
                  imagesFromState.ground[tiles[row][col]].url
                )
              );
            }
          }
        }

        ServerHandler.receiveMessage("game:startPos", (pos: Indices) => {
          this.camera.setScroll(this.world[pos.i][pos.j].getCameraPos());
        });

        this.unitManager.setWorld(this.world);
        this.buildingManager.setWorld(this.world);
      }
    );
  }
  private printMouseCoords(): void {
    ctx.save();

    ctx.fillStyle = ERROR_COLOR;
    const position = convertMouseIsometricCoordsToCartesianCoords(
      this.mousePos,
      this.camera.getScroll()
    );
    const text = `x: ${position.i}, y: ${position.j}`;

    ctx.fillText(
      text,
      this.mousePos.x - ctx.measureText(text).width / 2,
      this.mousePos.y - 5
    );

    ctx.restore();
  }

  public draw(): void {
    this.world.forEach((tiles) => {
      tiles.forEach((tile) => {
        tile.draw();
        tile.drawObstacles();
      });
    });

    this.unitManager.draw();
    this.buildingManager.draw();

    this.printMouseCoords();
  }

  public update(dt: number, mousePos: Position, key: string): void {
    this.camera.update(dt, mousePos, key);

    this.world.forEach((tiles) => {
      tiles.forEach((tile) => tile.update(this.camera.getScroll()));
    });

    this.unitManager.update(dt, this.camera.getScroll());
    this.buildingManager.update(dt, this.camera.getScroll());
  }

  public handleLeftClick(mousePos: Position): void {
    const indices: Indices = convertMouseIsometricCoordsToCartesianCoords(
      mousePos,
      this.camera.getScroll()
    );

    if (this.isActionInsideOfTheMap(indices)) {
      this.buildingManager.handleLeftClick(
        indices,
        mousePos,
        this.camera.getScroll()
      );

      this.unitManager.handleLeftClick(
        indices,
        mousePos,
        this.camera.getScroll()
      );
    }
  }

  handleMiddleClick(mousePos: Position): void {
    const indices: Indices = convertMouseIsometricCoordsToCartesianCoords(
      mousePos,
      this.camera.getScroll()
    );

    if (this.isActionInsideOfTheMap(indices)) {
      this.unitManager.setPos(this.world[indices.i][indices.j].getUnitPos());
      this.unitManager.handleMiddleClick(
        indices,
        mousePos,
        this.camera.getScroll()
      );
    }
  }

  public handleRightClick(mousePos: Position): void {
    const indices: Indices = convertMouseIsometricCoordsToCartesianCoords(
      mousePos,
      this.camera.getScroll()
    );

    this.buildingManager.handleRightClick();
    this.unitManager.handleRightClick(indices);
  }

  public handleMouseMove(mousePos: Position): void {
    this.mousePos = mousePos;

    const indices: Indices = convertMouseIsometricCoordsToCartesianCoords(
      mousePos,
      this.camera.getScroll()
    );

    if (this.isActionInsideOfTheMap(indices)) {
      this.buildingManager.setPos(
        this.world[indices.i][indices.j].getBuildingPos()
      );

      this.buildingManager.handleMouseMove(mousePos, this.camera.getScroll());
      this.unitManager.handleMouseMove(mousePos, this.camera.getScroll());
    }
  }

  public isActionInsideOfTheMap(indices: Indices): boolean {
    return (
      indices.i >= 0 &&
      indices.i < this.world.length - 1 &&
      indices.j >= 0 &&
      indices.j < this.world.length
    );
  }
}
