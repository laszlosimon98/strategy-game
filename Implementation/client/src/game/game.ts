import { canvasHeight } from "../init";
import { ServerHandler } from "../server/serverHandler";
import { Vector } from "../utils/vector";
import { GameMenu } from "./components/menu/gameMenu";
import { asdf } from "./asdf";
import { Tile } from "./world/tile";
import { groundAssets } from "./imports/ground";

export class Game {
  private gameMenu: GameMenu;
  private world: string = "";
  private test: asdf | null = null;
  private message: string = "";

  private tiles: Tile[][] = [];

  private constructor() {
    this.gameMenu = new GameMenu(
      new Vector(0, (canvasHeight - 500) / 5),
      300,
      500
    );

    for (let i = 0; i < 25; ++i) {
      this.tiles.push([]);
      for (let j = 0; j < 25; ++j) {
        let asset: string = "";
        const r = Math.floor(Math.random() * (75 - 1 + 1) + 1);

        if (r === 1) asset = groundAssets.flower;
        else if (r === 2) asset = groundAssets.rock;
        else asset = groundAssets.grass;
        this.tiles[i].push(new Tile(i, j, asset));
      }
    }

    // ServerHandler.receiveMessage("game:createWorld", (data: string) => {
    //   console.warn("uzenet jott");
    //   this.world = data;
    //   this.test = new asdf(this.world);
    // });

    // ServerHandler.receiveMessage("asdf", (data: string) => {
    //   console.warn("uzenet jott");
    //   this.message = data;
    // });
  }

  private async init() {
    this.world = await this.createWorld();
    console.log(`World: `, this.world);
    this.test = new asdf(this.world);
  }

  private async createWorld() {
    return await ServerHandler.receiveAsyncMessage("game:createWorld");
  }

  handleClick(e: MouseEvent) {
    this.gameMenu.handleClick();
  }

  draw(): void {
    this.tiles.forEach((tiles) => {
      tiles.forEach((tile) => {
        // tile.drawNormalGrid();
        tile.drawIsometricGrid();
        tile.draw();
      });
    });
    this.gameMenu.draw();
  }

  update(dt: number) {
    this.gameMenu.update();
    // this.test?.update();
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
