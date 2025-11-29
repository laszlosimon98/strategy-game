import { MainMenuState } from "@/enums/gameMenuState";
import { GameState } from "@/enums/gameState";
import { Building } from "@/game/world/building/building";
import type { MouseHandlerInterface } from "@/interfaces/mouseHandlerInterface";
import { StateManager } from "@/manager/stateManager";
import { CommunicationHandler } from "@/communication/communicationHandler";
import type { EntityType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { isMouseIntersect } from "@/utils/utils";
import type { Entity } from "@/game/world/entity";
import type { Soldier } from "@/game/world/unit/units/soldier";

/**
 * Absztrakt osztály a játék objektumok kezeléséhez.
 * Tartalmaz függvényeket a megrajzoláshoz, frissítéshez, létrehozáshoz és kiválasztáshoz.
 */
export abstract class Manager implements MouseHandlerInterface {
  protected pos: Position;

  protected constructor() {
    this.pos = Position.zero();
    this.handleCommunication();
  }

  public abstract handleLeftClick(...args: any[]): void;
  public abstract handleMiddleClick(...args: any[]): void;
  public abstract handleRightClick(...args: any[]): void;
  public abstract handleMouseMove(...args: any[]): void;

  protected abstract handleCommunication(): void;

  /**
   * Kirajzolja az összes játékos megadott típusú objektumát (pl. egységek, épületek).
   * @param objectKey - az objektumtípus kulcsa
   */
  protected draw<T extends Entity>(objectKey: string): void {
    Object.keys(StateManager.getPlayers()).forEach((key) => {
      const arr: T[] = StateManager.getPlayers()[key][
        objectKey
      ] as unknown as T[];
      arr.forEach((object) => object.draw());
    });
  }

  /**
   * Frissíti az összes játékos megadott típusú objektumát.
   * @param dt - delta time
   * @param cameraScroll - kamera eltolás gyártásához
   * @param objectKey - az objektumtípus kulcsa
   */
  protected update<T extends Entity>(
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

  /**
   * Segédfüggvény egy új objektum példányosításához.
   */
  protected creator<T extends Entity>(
    Creator: new (...args: any[]) => T,
    ...args: ConstructorParameters<typeof Creator>
  ): T {
    return new Creator(...args);
  }

  /** Beállítja a Manager pozícióját. */
  public setPos(pos: Position): void {
    this.pos = pos;
  }

  protected initObject(): EntityType {
    return {
      data: {
        ...StateManager.getInitData().data,
        owner: CommunicationHandler.getId(),
      },
    };
  }

  /**
   * Beállítja egy objektum képernyőpozícióját úgy.
   */
  protected setObjectPosition<T extends Entity>(
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

  /**
   * Beállítja az objektumok hover állapotát.
   * @param mousePos - egér pozíció
   * @param cameraScroll - kamera eltolás
   * @param key - objektumtípus kulcsa
   */
  protected hoverObject<T extends Entity>(
    mousePos: Position,
    cameraScroll: Position,
    key: string
  ): void {
    if (StateManager.getState() !== GameState.Build) {
      const objectArray: T[] = StateManager.getPlayers()[
        CommunicationHandler.getId()
      ][key] as unknown as T[];

      objectArray.forEach((object) => {
        object.setHover(isMouseIntersect(mousePos.sub(cameraScroll), object));
      });
    }
  }

  /**
   * Kiválaszt egy objektumot a megadott típusból az egér pozíció alapján és frissíti az állapotot.
   * @returns a kiválasztott objektum
   */
  protected selectObject<T extends Building & Soldier>(
    mousePos: Position,
    cameraScroll: Position,
    key: string
  ): T | undefined {
    const objectArray: T[] = StateManager.getPlayers()[
      CommunicationHandler.getId()
    ][key] as unknown as T[];

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
