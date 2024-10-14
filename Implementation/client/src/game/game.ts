import { canvasHeight } from "../init";
import { Vector } from "../utils/vector";
import { GameMenu } from "./menu/gameMenu";
import { Position } from "../utils/position";
import { MouseButtons } from "./utils/mouseEnum";
// import { Indices } from "../utils/indices";
import { World } from "./world/world";

export class Game {
  private gameMenu: GameMenu;
  private world: World;

  private mousePos: Position;
  private key: string;

  // private pathStart: Indices;
  // private pathEnd: Indices;

  public constructor() {
    this.gameMenu = new GameMenu(
      new Vector(0, (canvasHeight - 500) / 5),
      250,
      500
    );

    this.world = new World();

    // this.pathStart = Indices.zero();
    // this.pathEnd = Indices.zero();

    this.mousePos = Position.zero();
    this.key = "";

    this.init();
  }

  private init(): void {
    this.world.init();
  }

  public draw(): void {
    this.world.draw();

    // this.gameMenu.draw();
  }

  public update(dt: number) {
    this.gameMenu.update(this.mousePos);
    this.world.update(dt, this.mousePos, this.key);
  }

  public handleClick(e: MouseEvent) {
    const button = e.button;

    switch (button) {
      case MouseButtons.Left:
        this.gameMenu.handleClick(this.mousePos);
        this.world.handleClick();
        // this.pathStart.setIndices(new Indices(indices.i, indices.j));
        break;
      case MouseButtons.Right:
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
  }

  public handleKeyPress(key: string): void {
    this.key = key;
  }

  public resize(): void {}
}
