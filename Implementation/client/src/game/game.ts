import { canvasHeight } from "../init";
import { GameMenu } from "./menu/gameMenu";
import { Position } from "../utils/position";
import { MouseButtons } from "../enums/mouse";
import { World } from "./world/world";
import { Dimension } from "../utils/dimension";
import { state } from "../data/state";
import { GameState } from "../enums/gameState";
import { isMouseIntersect } from "../utils/utils";
import { ServerHandler } from "../server/serverHandler";
import { PlayerGameType } from "../types/gameType";

export class Game {
  private gameMenu: GameMenu;
  private world: World | undefined;

  private mousePos: Position;
  private key: string;

  // private pathStart: Indices;
  // private pathEnd: Indices;

  public constructor() {
    this.gameMenu = new GameMenu(
      new Position(0, (canvasHeight - 500) / 5),
      new Dimension(250, 500)
    );

    this.world = undefined;
    // this.world = new World();

    // this.pathStart = Indices.zero();
    // this.pathEnd = Indices.zero();

    this.mousePos = Position.zero();
    this.key = "";

    this.handleCommunication();

    this.init();
  }

  private async init(): Promise<void> {
    const players = await this.handleCommunication();
    this.initPlayers(players);

    state.game.state = GameState.Default;
    this.world = new World();
    this.world.init();
  }

  private initPlayers(players: PlayerGameType): void {
    Object.keys(players).forEach((id) => {
      state.game.players[id] = {
        name: players[id].name,
        color: players[id].color,
        buildings: [],
        units: [],
      };
    });
  }

  public draw(): void {
    this.world?.draw();
    this.gameMenu.draw();
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
        }

        // this.pathStart.setIndices(new Indices(indices.i, indices.j));
        break;
      case MouseButtons.Right:
        this.world?.handleRightClick();
        // this.world.moveWorld();
        // this.pathEnd.setIndices(new Indices(indices.i, indices.j));
        // ServerHandler.sendMessage("game:pathFind", {
        //   start: this.pathStart,
        //   end: this.pathEnd,
        // });
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

  public resize(): void {}

  private async handleCommunication(): Promise<any> {
    const players = await ServerHandler.receiveAsyncMessage("game:initPlayers");
    return players;
  }
}
