import { state } from "@/data/state";
import { GameState } from "@/enums/gameState";
import { Button } from "@/page/components/button";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class LabelButton extends Button {
  private name: string;

  constructor(
    pos: Position,
    dim: Dimension,
    type: "name" | "title" | "buildings" | "menu",
    text: string,
    name: string
  ) {
    super(pos, dim, type, text);
    this.name = name;

    const imageFrom: string = type === "buildings" ? "buildings" : "gamemenu";

    if (imageFrom === "buildings") {
      this.setImage(state.images[imageFrom][name].url);
    } else {
      this.dim.width = state.images.ui[imageFrom][name].dimensions.width;
      this.dim.height = state.images.ui[imageFrom][name].dimensions.height;
      this.setImage(state.images.ui[imageFrom][name].url);
    }

    this.pos = new Position(pos.x + this.dim.width / 8 - 8, pos.y);
  }

  draw(): void {
    super.draw();
  }

  update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
  }

  selectBuilding(): void {
    state.game.builder.data = state.images.buildings[this.name];
    state.game.state = GameState.Build;
  }
}
