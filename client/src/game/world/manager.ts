import { MainMenuState } from "@/enums/gameMenuState";
import { GameState } from "@/enums/gameState";
import { Building } from "@/game/world/building/building";
import { Cell } from "@/game/world/cell";
import { Unit } from "@/game/world/unit/unit";
import type { CallAble } from "@/interfaces/callAble";
import type { MouseClicker } from "@/interfaces/mouseClicker";
import { GameStateManager } from "@/gameStateManager/gameStateManager";
import { ServerHandler } from "@/server/serverHandler";
import type { EntityType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { isMouseIntersect } from "@/utils/utils";

export abstract class Manager<T> implements MouseClicker {
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

  protected draw<T extends CallAble>(objectKey: string): void {
    Object.keys(GameStateManager.getPlayers()).forEach((key) => {
      const arr: T[] = GameStateManager.getPlayers()[key][
        objectKey
      ] as unknown as T[];
      arr.forEach((object) => object.draw());
    });
  }

  protected update<T extends CallAble>(
    dt: number,
    cameraScroll: Position,
    objectKey: string
  ): void {
    Object.keys(GameStateManager.getPlayers()).forEach((key) => {
      const arr: T[] = GameStateManager.getPlayers()[key][
        objectKey
      ] as unknown as T[];
      arr.forEach((object) => object.update(dt, cameraScroll));
    });
  }

  public setWorld(world: Cell[][]): void {
    this.world = world;
  }

  protected creator<K extends T>(
    Creator: new (...args: any[]) => K,
    ...args: ConstructorParameters<typeof Creator>
  ): K {
    return new Creator(...args);
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }

  protected initObject(): EntityType {
    return {
      data: {
        ...GameStateManager.getInitData().data,
        owner: ServerHandler.getId(),
      },
    };
  }

  protected setObjectPosition<T extends CallAble>(
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

  protected hoverObject<T extends CallAble>(
    mousePos: Position,
    cameraScroll: Position,
    key: string
  ): void {
    if (GameStateManager.getState() !== GameState.Build) {
      const objectArray: T[] = GameStateManager.getPlayers()[
        ServerHandler.getId()
      ][key] as unknown as T[];

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
    const objectArray: T[] = GameStateManager.getPlayers()[
      ServerHandler.getId()
    ][key] as unknown as T[];

    const selectedObject = objectArray.find((object) => {
      if (isMouseIntersect(mousePos.sub(cameraScroll), object)) {
        return object;
      }
    });

    if (selectedObject) {
      GameStateManager.setInfoPanelData(selectedObject);
      GameStateManager.setGameState(GameState.Selected);
      GameStateManager.setPrevMenuState(GameStateManager.getGameMenuState());
      GameStateManager.setGameMenuState(MainMenuState.Info);
    } else {
      GameStateManager.setGameState(GameState.Default);
    }

    return selectedObject;
  }
}
