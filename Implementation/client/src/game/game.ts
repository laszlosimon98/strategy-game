import { canvasHeight } from "../init";
import { ServerHandler } from "../server/serverHandler";
import { Vector } from "../utils/vector";
import { GameMenu } from "./components/menu/gameMenu";
import { asdf } from "./asdf";

export class Game {
  private gameMenu: GameMenu;
  private world: string = "";
  private test: asdf | null = null;
  private message: string = "";

  private constructor() {
    this.gameMenu = new GameMenu(
      new Vector(0, (canvasHeight - 500) / 5),
      300,
      500
    );

    ServerHandler.receiveMessage("game:createWorld", (data: string) => {
      console.warn("uzenet jott");
      this.world = data;
      this.test = new asdf(this.world);
    });

    ServerHandler.receiveMessage("asdf", (data: string) => {
      console.warn("uzenet jott");
      this.message = data;
    });
  }

  private async init() {
    this.world = await this.createWorld();
    console.log(`World: `, this.world);
    this.test = new asdf(this.world);
  }

  private async createWorld() {
    return await ServerHandler.receiveAsyncMessage("game:createWorld");
  }

  private updateWorld() {}

  handleClick(e: MouseEvent) {
    this.gameMenu.handleClick();
  }

  draw(): void {
    this.gameMenu.draw();
    console.log(this.message);
  }

  update(dt: number) {
    this.gameMenu.update();
    this.test?.update();
    // this.updateWorld();
  }

  resize(): void {
    this.gameMenu.resize();
  }

  public static async create() {
    const game = new Game();
    // await game.init();
    return game;
  }
}
