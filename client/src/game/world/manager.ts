import { MainMenuState } from "@/enums/gameMenuState";
import { GameState } from "@/enums/gameState";
import { Building } from "@/game/world/building/building";
import { Cell } from "@/game/world/cell";
import { Unit } from "@/game/world/unit/unit";
import type { RendererInterface } from "@/interfaces/rendererInterface";
import type { MouseHandlerInterface } from "@/interfaces/mouseHandlerInterface";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import type { EntityType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { isMouseIntersect } from "@/utils/utils";

export abstract class Manager<T> implements MouseHandlerInterface {
  protected pos: Position;
  protected world: Cell[][];

  protected constructor() {
    this.pos = Position.zero();
    this.world = [];
    this.handleCommunication();
  }

  public abstract handleLeftClick(...args: any[]): void;
  public abstract handleMiddleClick(...args: any[]): void;
  public abstract handleRightClick(...args: any[]): void;
  public abstract handleMouseMove(...args: any[]): void;

  protected abstract handleCommunication(): void;

  protected draw<T extends RendererInterface>(objectKey: string): void {
    Object.keys(StateManager.getPlayers()).forEach((key) => {
      const arr: T[] = StateManager.getPlayers()[key][
        objectKey
      ] as unknown as T[];
      arr.forEach((object) => object.draw());
    });
  }

  protected update<T extends RendererInterface>(
    dt: number,
    cameraScroll: Position,
    objectKey: string
  ): void {
    Object.keys(StateManager.getPlayers()).forEach((key) => {
      const arr: T[] = StateManager.getPlayers()[key][
        objectKey
      ] as unknown as T[];
      arr.forEach((object) => object.update(dt, cameraScroll));
    });
  }

  public setWorld(world: Cell[][]): void {
    this.world = world;
  }

  protected creator<T>(
    Creator: new (...args: any[]) => T,
    ...args: ConstructorParameters<typeof Creator>
  ): T {
    return new Creator(...args);
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }

  protected initObject(): EntityType {
    return {
      data: {
        ...StateManager.getInitData().data,
        owner: ServerHandler.getId(),
      },
    };
  }

  protected setObjectPosition<T extends RendererInterface>(
    object: T,
    objectPos: Position
  ): void {
    const dimension: Dimension = object.getDimension();
    const newObjectPos: Position = new Position(
      objectPos.x - dimension.width / 2,
      objectPos.y - dimension.height
    );
    object.setPosition(newObjectPos);
  }

  protected hoverObject<T extends RendererInterface>(
    mousePos: Position,
    cameraScroll: Position,
    key: string
  ): void {
    if (StateManager.getState() !== GameState.Build) {
      const objectArray: T[] = StateManager.getPlayers()[ServerHandler.getId()][
        key
      ] as unknown as T[];

      objectArray.forEach((object) => {
        object.setHover(isMouseIntersect(mousePos.sub(cameraScroll), object));
      });
    }
  }

  protected selectObject<T extends Building & Unit>(
    mousePos: Position,
    cameraScroll: Position,
    key: string
  ): T | undefined {
    const objectArray: T[] = StateManager.getPlayers()[ServerHandler.getId()][
      key
    ] as unknown as T[];

    const selectedObject = objectArray.find((object) => {
      if (isMouseIntersect(mousePos.sub(cameraScroll), object)) {
        return object;
      }
    });

    if (selectedObject) {
      StateManager.setInfoPanelData(selectedObject);
      StateManager.setGameState(GameState.Selected);
      StateManager.setPrevMenuState(StateManager.getGameMenuState());
      StateManager.setGameMenuState(MainMenuState.Info);
    } else {
      StateManager.setGameState(GameState.Default);
    }

    return selectedObject;
  }
}
