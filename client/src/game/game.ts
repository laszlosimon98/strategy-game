import { GameState } from "@/enums/gameState";
import { MouseButtons } from "@/enums/mouse";
import { GameMenu } from "@/game/menu/gameMenu";
import { World } from "@/game/world/world";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import type {
  ErrorMessageResponse,
  PlayerGameType,
  StorageResponse,
} from "@/types/game.types";
import { Position } from "@/utils/position";
import { isMouseIntersect } from "@/utils/utils";
import { settings } from "@/settings";

export class Game {
  private gameMenu: GameMenu;
  private world: World | undefined;

  private mousePos: Position;
  private key: string;

  public constructor() {
    this.gameMenu = new GameMenu(settings.gameMenu.pos, settings.gameMenu.dim);

    this.world = undefined;
    this.mousePos = Position.zero();
    this.key = "";

    this.init();

    this.handleCommunication();
  }

  private async init(): Promise<void> {
    const players = await ServerHandler.receiveAsyncMessage("game:initPlayers");
    this.initPlayers(players);

    StateManager.setGameState(GameState.Default);
    this.world = new World();
    this.world.init();
  }

  private initPlayers(players: PlayerGameType): void {
    StateManager.initPlayers(players);
  }

  public draw(): void {
    this.world?.draw();
    this.gameMenu.draw();

    this.gameMenu.drawTooltips();
  }

  public update(dt: number) {
    this.gameMenu.update(dt, this.mousePos);
    this.world?.update(dt, this.mousePos, this.key);
  }

  public handleClick(e: MouseEvent) {
    const button = e.button;

    switch (button) {
      case MouseButtons.Left:
        if (isMouseIntersect(this.mousePos, this.gameMenu)) {
          this.gameMenu.handleClick(this.mousePos);
        } else {
          this.world?.handleLeftClick();
          this.gameMenu.updateInfoPanel();
        }
        break;
      case MouseButtons.Right:
        this.world?.handleRightClick();
        break;
      case MouseButtons.Middle:
        this.world?.handleMiddleClick();
    }
  }

  public handleMouseMove(pos: Position): void {
    this.mousePos.setPosition(pos);
    this.world?.handleMouseMove(pos);
  }

  public handleKeyPress(key: string): void {
    this.key = key;
  }

  private async handleCommunication(): Promise<void> {
    ServerHandler.receiveMessage(
      "game:error",
      ({ message }: ErrorMessageResponse) => {
        console.warn(message);
      }
    );
  }
}
