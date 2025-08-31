import { Game } from "@/game/game";
import { ctx } from "@/game/main";
import { Position } from "@/game/utils/position";
import { selectState } from "@/services/store";

const { canvasWidth, canvasHeight } = selectState((state) => state.canvas);

export class Program {
  private game: Game;
  private mousePos: Position;
  private key: string;

  public constructor() {
    this.mousePos = Position.zero();
    this.key = "";

    this.game = new Game();

    document.addEventListener("mousedown", (e: MouseEvent) =>
      this.handleMouseClick(e)
    );

    document.addEventListener("mousemove", (e: MouseEvent) =>
      this.handleMouseMove(e)
    );

    document.addEventListener("keydown", (e: KeyboardEvent) =>
      this.handleKeyDown(e)
    );

    document.addEventListener("keyup", () => {
      this.handleKeyUp();
    });

    document.addEventListener("contextmenu", (e: MouseEvent) =>
      e.preventDefault()
    );
  }

  public draw(): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    this.game.draw();
  }

  public update(dt: number): void {
    this.game.update(dt, this.key, this.mousePos);
  }

  private handleMouseClick(e: MouseEvent) {
    this.game.handleClick(e, this.mousePos);
  }

  private handleMouseMove(e: MouseEvent): void {
    this.mousePos.setPosition(new Position(e.clientX, e.clientY));
    this.game.handleMouseMove(this.mousePos);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    this.key = e.key;
  }

  private handleKeyUp(): void {
    this.key = "";
  }
}
