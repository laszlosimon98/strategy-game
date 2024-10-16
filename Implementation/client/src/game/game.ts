import { canvasHeight } from "../init";
import { GameMenu } from "./menu/gameMenu";
import { Position } from "../utils/position";
import { MouseButtons } from "./utils/mouseEnum";
// import { Indices } from "../utils/indices";
import { World } from "./world/world";
import { PointerEnum } from "./utils/pointerEnum";
import { Dimension } from "../utils/dimension";
import { gameState, initBuildingState, selectedBuilding } from "../data/data";
import { GameStateEnum } from "./utils/gameStateEnum";
import { images } from "../data/images";

export class Game {
  private gameMenu: GameMenu;
  private world: World;

  private mousePos: Position;
  private key: string;

  // private pathStart: Indices;
  // private pathEnd: Indices;

  public constructor() {
    // console.log(images.page.buttons.empty);
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
  }

  private init(): void {
    gameState.state = GameStateEnum.default;
    this.world.init();
  }

  public draw(): void {
    this.world.draw();
    this.gameMenu.draw();
  }

  public update(dt: number) {
    this.gameMenu.update(this.mousePos);
    this.world.update(dt, this.mousePos, this.key);
  }

  public handleClick(e: MouseEvent) {
    const button = e.button;

    switch (button) {
      case MouseButtons.Left:
        if (gameState.pointer === PointerEnum.Menu) {
          this.gameMenu.handleClick(this.mousePos);
        } else {
          this.world.handleClick();
        }

        // this.pathStart.setIndices(new Indices(indices.i, indices.j));
        break;
      case MouseButtons.Right:
        selectedBuilding.data = { ...initBuildingState.data };
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

    if (this.gameMenu.isMouseIntersect(pos)) {
      gameState.pointer = PointerEnum.Menu;
    } else {
      gameState.pointer = PointerEnum.Tile;
    }

    this.world.handleMouseMove(pos);
  }

  public handleKeyPress(key: string): void {
    this.key = key;
  }

  public resize(): void {}
}
