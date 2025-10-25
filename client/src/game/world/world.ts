import { Camera } from "@/game/camera/camera";
import { ObstacleEnum } from "@/game/enums/obstacleEnum";
import { BuildingManager } from "@/game/world/building/buildingManager";
import { Cell } from "@/game/world/cell";
import { UnitManager } from "@/game/world/unit/unitManager";
import type { MouseHandlerInterface } from "@/interfaces/mouseHandlerInterface";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import type { Territory, TileType } from "@/types/world.types";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";
import { convertIsometricCoordsToCartesianCoords } from "@/utils/utils";

export class World implements MouseHandlerInterface {
  private mousePos: Position;
  private camera: Camera;

  private buildingManager: BuildingManager;
  private unitManager: UnitManager;

  public constructor() {
    this.mousePos = Position.zero();
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
        const world: Cell[][] = tiles.map((row, i) =>
          row.map((tile, j) => {
            const groundImg = StateManager.getImages("ground", tile).url;
            const obstacle = obstacles[i][j];
            const obstacleImg =
              obstacle && obstacle !== ObstacleEnum.Empty
                ? StateManager.getImages("obstacles", obstacle).url
                : undefined;

            return new Cell(new Indices(i, j), groundImg, obstacleImg);
          })
        );
        StateManager.setWorld(world);

        ServerHandler.receiveMessage("game:startPos", (pos: Indices) => {
          const cell = StateManager.getWorld()[pos.i][pos.j];
          if (cell) this.camera.setScroll(cell.getCameraPos());
        });
      }
    );
  }

  public draw(): void {
    StateManager.getWorld().forEach((tiles) => {
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

    StateManager.getWorld().forEach((tiles) => {
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
      this.unitManager.setPos(
        StateManager.getWorld()[indices.i][indices.j].getUnitPos()
      );
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
        StateManager.getWorld()[indices.i][indices.j].getBuildingPos()
      );
      this.buildingManager.handleMouseMove(mousePos, this.getCameraScroll());
      this.unitManager.handleMouseMove(mousePos, this.getCameraScroll());
    }
  }

  public moveWorld(): void {}

  public isActionInsideOfTheMap(indices: Indices): boolean {
    return (
      indices.i >= 0 &&
      indices.i < StateManager.getWorld().length - 1 &&
      indices.j >= 0 &&
      indices.j < StateManager.getWorld().length
    );
  }

  public getCameraScroll(): Position {
    return this.camera.getScroll();
  }

  private handleCommunication(): void {
    ServerHandler.receiveMessage(
      "game:updateCell",
      ({
        indices,
        obstacle,
        owner,
      }: {
        indices: Indices;
        obstacle: ObstacleEnum;
        owner: string;
      }) => {
        const { i, j } = indices;
        const currentCell: Cell = StateManager.getWorld()[i][j];

        if (
          obstacle === ObstacleEnum.Empty ||
          obstacle === ObstacleEnum.Occupied
        ) {
          currentCell.setObstacleImage(ObstacleEnum.Empty);
        } else if (obstacle === ObstacleEnum.Tree) {
          currentCell.setObstacleImage(
            StateManager.getImages("obstacles", obstacle).url
          );
        } else {
          currentCell.setObstacleImage(
            StateManager.getImages(
              "utils",
              StateManager.getPlayerColor(owner),
              obstacle
            ).url
          );
        }
      }
    );

    ServerHandler.receiveMessage(
      "game:updateTerritory",
      ({ data }: { data: Territory[] }) => {
        console.log(data);
        data.forEach((cell) => {
          const { indices, owner, obstacle } = cell;
          const { i, j } = indices;

          StateManager.setCellOwner(indices, owner);

          const currentCell: Cell = StateManager.getWorld()[i][j];
          const currentObstacle = currentCell.getObstacle();

          if (
            obstacle === ObstacleEnum.Empty ||
            obstacle === ObstacleEnum.Occupied
          ) {
            currentCell.setObstacleImage(ObstacleEnum.Empty);
          } else if (obstacle !== ObstacleEnum.Border) {
            if (
              obstacle === ObstacleEnum.Tree ||
              obstacle === ObstacleEnum.Stone
            ) {
              currentCell.setObstacleImage(
                StateManager.getImages("obstacles", obstacle).url
              );
            }
          } else {
            if (!currentObstacle) {
              currentCell.setObstacleImage(
                StateManager.getImages(
                  "utils",
                  StateManager.getPlayerColor(owner as string),
                  obstacle
                ).url
              );
            }
          }
        });
      }
    );
  }
}
