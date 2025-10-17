import { MainMenuState } from "@/enums/gameMenuState";
import { Camera } from "@/game/camera/camera";
import { CellTypeEnum } from "@/game/enums/cellTypeEnum";
import { BuildingManager } from "@/game/world/building/buildingManager";
import { Cell } from "@/game/world/cell";
import { UnitManager } from "@/game/world/unit/unitManager";
import type { MouseHandlerInterface } from "@/interfaces/mouseHandlerInterface";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import type { TileType } from "@/types/world.types";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";
import { convertIsometricCoordsToCartesianCoords, ySort } from "@/utils/utils";

export class World implements MouseHandlerInterface {
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
  }

  public init(): void {
    console.log(StateManager.getPlayers());

    ServerHandler.receiveMessage(
      "game:createWorld",
      ({ tiles, obstacles }: { tiles: TileType[][]; obstacles: any[][] }) => {
        this.world = tiles.map((row, i) =>
          row.map((tile, j) => {
            const groundImg = StateManager.getImages("ground", tile).url;
            const obstacle = obstacles[i][j];
            const obstacleImg =
              obstacle && obstacle !== CellTypeEnum.Empty
                ? StateManager.getImages("obstacles", obstacle).url
                : undefined;

            return new Cell(new Indices(i, j), groundImg, obstacleImg);
          })
        );

        ServerHandler.receiveMessage("game:startPos", (pos: Indices) => {
          const cell = this.world[pos.i][pos.j];
          if (cell) this.camera.setScroll(cell.getCameraPos());
        });

        this.unitManager.setWorld(this.world);
        this.buildingManager.setWorld(this.world);
      }
    );
  }

  public draw(): void {
    this.world.forEach((tiles) => {
      tiles.forEach((tile) => {
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

    StateManager.setInfoPanelData(null);

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
      "game:updateCell",
      ({ indices, obstacle }: { indices: Indices; obstacle: CellTypeEnum }) => {
        const { i, j } = indices;
        if (obstacle === CellTypeEnum.Empty) {
          this.world[i][j].setObstacleImage(CellTypeEnum.Empty);
        } else {
          this.world[i][j].setObstacleImage(
            StateManager.getImages("obstacles", obstacle).url
          );
        }
      }
    );
  }
}
