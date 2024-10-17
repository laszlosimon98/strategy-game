import { canvasHeight } from "../init";
import { GameMenu } from "./menu/gameMenu";
import { Position } from "../utils/position";
import { MouseButtons } from "../enums/mouse";
import { World } from "./world/world";
import { Dimension } from "../utils/dimension";
import { initBuildingState, state } from "../data/state";
import { GameState } from "../enums/gameState";
import { Pointer } from "../enums/pointer";
import { isMouseIntersect } from "../utils/utils";
import { RenderInterface } from "../interfaces/render";
import { ServerHandler } from "../server/serverHandler";

export class Game implements RenderInterface {
  private gameMenu: GameMenu;
  private world: World;

  private mousePos: Position;
  private key: string;

  // private pathStart: Indices;
  // private pathEnd: Indices;

  public constructor() {
    this.gameMenu = new GameMenu(
      new Position(0, (canvasHeight - 500) / 5),
      new Dimension(250, 500)
    );

    this.world = new World();

    // this.pathStart = Indices.zero();
    // this.pathEnd = Indices.zero();

    this.mousePos = Position.zero();
    this.key = "";

    this.init();
    this.handleCommunication();
  }

  private init(): void {
    state.game.state = GameState.default;
    this.world.init();
  }

  private initPlayer(id: string): void {
    state.game.players[id] = {
      buildings: [],
    };
  }

  public draw(): void {
    this.world.draw();
    this.gameMenu.draw();
  }

  public update(dt: number) {
    this.gameMenu.update(dt, this.mousePos);
    this.world.update(dt, this.mousePos, this.key);
  }

  public handleClick(e: MouseEvent) {
    const button = e.button;

    switch (button) {
      case MouseButtons.Left:
        if (state.pointer.state === Pointer.Menu) {
          this.gameMenu.handleClick(this.mousePos);
        } else {
          this.world.handleClick();
        }

        // this.pathStart.setIndices(new Indices(indices.i, indices.j));
        break;
      case MouseButtons.Right:
        state.building.selected.data = { ...initBuildingState.data };
        this.world.moveWorld();
        // this.pathEnd.setIndices(new Indices(indices.i, indices.j));
        // ServerHandler.sendMessage("game:pathFind", {
        //   start: this.pathStart,
        //   end: this.pathEnd,
        // });
        break;
    }
  }

  public handleMouseMove(pos: Position): void {
    this.mousePos.setPosition(pos);

    if (isMouseIntersect(pos, this.gameMenu)) {
      state.pointer.state = Pointer.Menu;
    } else {
      state.pointer.state = Pointer.Tile;
    }

    this.world.handleMouseMove(pos);
  }

  public handleKeyPress(key: string): void {
    this.key = key;
  }

  public resize(): void {}

  private handleCommunication(): void {
    ServerHandler.receiveMessage("game:ids", (ids: string[]) => {
      ids.forEach((id) => this.initPlayer(id));
    });
  }
}
