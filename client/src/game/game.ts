import { GameState } from "@/enums/gameState";
import { MouseButtons } from "@/enums/mouse";
import { GameMenu } from "@/game/menu/gameMenu";
import { World } from "@/game/world/world";
import { StateManager } from "@/manager/stateManager";
import { CommunicationHandler } from "@/communication/communicationHandler";
import type {
  ColorType,
  EntityType,
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
import type { Building } from "@/game/world/building/building";

/**
 * A játék fő kezelő osztálya.
 * Kezeli az egér és billentyűzet eseményeketet, a szerverről érkező üzeneteket
 */
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
    if (!StateManager.isGameMenuHiddenFn()) {
      this.gameMenu.draw();
    }

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

  /**
   * Egér kattintás kezelő.
   * Külön kezeli a bal, jobb és középső egérgomb kattintást.
   * @param e MouseEvent
   */
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

  /**
   * Egér elmozdulás
   * @param pos koordináta
   */
  public handleMouseMove(pos: Position): void {
    this.mousePos.setPosition(pos);
    this.world?.handleMouseMove(pos);
  }

  /**
   * Billentyű leütés
   * @param key leütött billenytű
   */
  public handleKeyPress(key: string): void {
    this.key = key;
    this.chatInput.toggleVisibility(key);
  }

  /**
   * Inicializálja a játékosokat és a világot
   */
  private async init(): Promise<void> {
    const players = await CommunicationHandler.receiveAsyncMessage(
      "game:initPlayers"
    );
    this.initPlayers(players);

    StateManager.setGameState(GameState.Default);
    this.world = new World();
    this.world.init();
  }

  private initPlayers(players: PlayerGameType): void {
    StateManager.initPlayers(players);
  }

  /**
   * Fogadja és kezeli a szerverről érkező üzenetcsomagokat
   * Események:
   *    - Játékos elhagyta a szobát (game:playerLeft)
   *    - Szerverről érkező értesítések beállítása (game:info)
   *    - Chat üzenet fogadása (chat:message)
   *    - Őrtorony foglalás elkezdődött (game:guardhouse-start-occupation)
   *    - Őrtorony foglalás megszakadt game:guardhouse-start-occupation
   */
  private async handleCommunication(): Promise<void> {
    CommunicationHandler.receiveMessage(
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

    CommunicationHandler.receiveMessage(
      "game:info",
      ({ message }: MessageResponse) => {
        this.messageIndicator.setText(message);
      }
    );

    CommunicationHandler.receiveMessage(
      "chat:message",
      ({
        message,
        name,
        color,
      }: {
        message: string;
        name: string;
        color: ColorType;
      }) => {
        this.chatFrame.pushText(name, message, color);
      }
    );

    CommunicationHandler.receiveMessage(
      "game:guardhouse-start-occupation",
      ({ entity, enemyOwner }: { entity: EntityType; enemyOwner: string }) => {
        const buildings: Building[] = StateManager.getBuildings(
          entity.data.owner
        );

        const guardHouse: Building | undefined = buildings.find(
          (building) => building.getEntity().data.id === entity.data.id
        );

        guardHouse?.startOccupation(enemyOwner);
      }
    );

    CommunicationHandler.receiveMessage(
      "game:guardhouse-stop-occupation",
      ({ entity }: { entity: EntityType }) => {
        const buildings: Building[] = StateManager.getBuildings(
          entity.data.owner
        );
        const guardHouse: Building | undefined = buildings.find(
          (building) => building.getEntity().data.id === entity.data.id
        );

        guardHouse?.stopOccupation();
      }
    );
  }
}
