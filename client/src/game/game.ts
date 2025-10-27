import { GameState } from "@/enums/gameState";
import { MouseButtons } from "@/enums/mouse";
import { GameMenu } from "@/game/menu/gameMenu";
import { World } from "@/game/world/world";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import type {
  ColorsType,
  MessageResponse,
  PlayerGameType,
} from "@/types/game.types";
import { Position } from "@/utils/position";
import { isMouseIntersect } from "@/utils/utils";
import { settings } from "@/settings";
import { MessagePopup } from "@/game/messagePopup/messagePopup";
import { canvasHeight, canvasWidth } from "@/init";
import type { Indices } from "@/utils/indices";
import type { Cell } from "@/game/world/cell";
import { ObstacleEnum } from "@/game/enums/obstacleEnum";
import { ChatInput } from "@/game/chat/chatInput";
import { ChatFrame } from "@/game/chat/chatFrame";

export class Game {
  private gameMenu: GameMenu;
  private world: World | undefined;
  private chatInput: ChatInput;
  private chatFrame: ChatFrame;

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
        canvasWidth / 2 - settings.size.chatInput.width / 2,
        canvasHeight / 2 - 25
      ),
      settings.size.chatInput
    );

    this.chatFrame = new ChatFrame(
      new Position(
        canvasWidth - settings.size.chatFrame.width - 5,
        canvasHeight - settings.size.chatFrame.height - 5
      ),
      settings.size.chatFrame
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
    this.chatFrame.draw();
  }

  public update(dt: number) {
    this.gameMenu.update(dt, this.mousePos);
    this.world?.update(dt, this.mousePos, this.key);
    this.messageIndicator.update(dt, this.mousePos);
    this.chatInput.update(dt, this.mousePos, this.key);
    this.chatFrame.update(dt, this.mousePos);

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

    ServerHandler.receiveMessage(
      "chat:message",
      ({
        message,
        name,
        color,
      }: {
        message: string;
        name: string;
        color: ColorsType;
      }) => {
        this.chatFrame.pushText(name, message, color);
      }
    );
  }
}
