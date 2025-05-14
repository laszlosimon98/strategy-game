import { MouseButtons } from "@/game/enums/mouse";
import { Position } from "@/game/utils/position";
import { World } from "@/game/world/world";
import { ServerHandler } from "@/server/serverHandler";
import { setPlayer } from "@/services/slices/gameSlice";
import { dispatch } from "@/services/store";
import { PlayerType } from "@/services/types/gameTypes";

export class Game {
  private world?: World;

  public constructor() {
    this.init();
  }

  private async init() {
    await this.initPlayers();
    this.world = new World();
    this.world.init();
  }

  private async initPlayers(): Promise<void> {
    const players = await ServerHandler.receiveAsyncMessage("game:initPlayers");

    Object.keys(players).forEach((id) => {
      const newPlayer: PlayerType = {
        name: players[id].name,
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
