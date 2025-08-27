import { MouseButtons } from "@/src/game/enums/mouse";
import { Position } from "@/src/game/utils/position";
import { World } from "@/src/game/world/world";
import { ServerHandler } from "@/src/server/server-handler";
import { setPlayer } from "@/src/services/slices/game.slice";
import { dispatch } from "@/src/services/store";
import { PlayerType } from "@/src/services/types/game.types";

export class Game {
  private world?: World;

  public constructor() {
    console.log("game init");
    this.init();
  }

  private async init() {
    ServerHandler.sendMessage("game:init", {});
    await this.initPlayers();
    this.world = new World();
    this.world.init();
  }

  private async initPlayers(): Promise<void> {
    const players = await ServerHandler.receiveAsyncMessage("game:initPlayers");

    // FIXME: backendről kell jönnie a hostnak is
    Object.keys(players).forEach((id) => {
      const newPlayer: PlayerType = {
        name: players[id].name,
        host: false,
        color: players[id].color,
        buildings: [],
        units: [],
        movingUnits: [],
      };

      dispatch(setPlayer({ id, player: newPlayer }));
    });
  }

  public draw(): void {
    this.world?.draw();
  }

  public update(dt: number, key: string, mousePos: Position) {
    this.world?.update(dt, mousePos, key);
  }

  public handleClick(e: MouseEvent, mousePos: Position) {
    const button = e.button;

    switch (button) {
      case MouseButtons.Left:
        this.world?.handleLeftClick(mousePos);
        break;
      case MouseButtons.Right:
        this.world?.handleRightClick(mousePos);
        break;
      case MouseButtons.Middle:
        this.world?.handleMiddleClick(mousePos);
    }
  }

  public handleMouseMove(pos: Position): void {
    this.world?.handleMouseMove(pos);
  }
}
