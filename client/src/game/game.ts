import { GameState } from "@/enums/gameState";
import { MouseButtons } from "@/enums/mouse";
import { GameMenu } from "@/game/menu/gameMenu";
import { World } from "@/game/world/world";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import type { MessageResponse, PlayerGameType } from "@/types/game.types";
import { Position } from "@/utils/position";
import { isMouseIntersect } from "@/utils/utils";
import { settings } from "@/settings";
import { MessagePopup } from "@/game/messagePopup/messagePopup";
import { canvasHeight, canvasWidth } from "@/init";
import type { Indices } from "@/utils/indices";
import type { Cell } from "@/game/world/cell";
import { ObstacleEnum } from "@/game/enums/obstacleEnum";
import { ChatInput } from "@/game/chat/chatInput";

export class Game {
  private gameMenu: GameMenu;
  private world: World | undefined;
  private chatInput: ChatInput;

  private mousePos: Position;
  private key: string;

  private messageIndicator: MessagePopup;

  public constructor() {
    this.gameMenu = new GameMenu(settings.gameMenu.pos, settings.gameMenu.dim);
    this.messageIndicator = new MessagePopup(
      new Position(
        canvasWidth / 2 - settings.size.messageIndicator.width / 2,
        100
      ),
      settings.size.messageIndicator
    );

    this.chatInput = new ChatInput(
      new Position(
        canvasWidth / 2 - settings.size.chatIndicator.width / 2,
        canvasHeight / 2 - 25
      ),
      settings.size.chatIndicator
    );

    this.world = undefined;
    this.mousePos = Position.zero();
    this.key = "";

    this.init();

    this.handleCommunication();
  }

  public draw(): void {
    this.world?.draw();
    this.gameMenu.draw();

    this.gameMenu.drawTooltips();
    this.messageIndicator.draw();
    this.chatInput.draw();
  }

  public update(dt: number) {
    this.gameMenu.update(dt, this.mousePos);
    this.world?.update(dt, this.mousePos, this.key);
    this.messageIndicator.update(dt, this.mousePos);
    this.chatInput.update(dt, this.mousePos, this.key);

    this.key = "";
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
    this.chatInput.toggleVisibility(key);
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

  private async handleCommunication(): Promise<void> {
    ServerHandler.receiveMessage(
      "game:playerLeft",
      ({
        id,
        data,
      }: {
        id: string;
        data: { indices: Indices; obstacle: ObstacleEnum }[];
      }) => {
        StateManager.playerLeft(id);
        const world: Cell[][] = StateManager.getWorld();
        const invalidObstacles: ObstacleEnum[] = [
          ObstacleEnum.Empty,
          ObstacleEnum.Stone,
          ObstacleEnum.Tree,
        ];

        data.forEach((cell) => {
          const { i, j } = cell.indices;
          const obstacle = cell.obstacle;

          if (!invalidObstacles.includes(obstacle)) {
            world[i][j].setObstacle(false);
            world[i][j].setObstacleImage(ObstacleEnum.Empty);
            world[i][j].setOwner(null);
          }
        });
      }
    );

    ServerHandler.receiveMessage(
      "game:info",
      ({ message }: MessageResponse) => {
        this.messageIndicator.setText(message);
      }
    );
  }
}
