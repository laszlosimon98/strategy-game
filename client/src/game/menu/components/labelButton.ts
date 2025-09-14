import { GameState } from "@/enums/gameState";
import { GameStateManager } from "@/gameStateManager/gameStateManager";
import { Button } from "@/page/components/button";
import type { ImageItemType } from "@/types/game.types";
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
      this.setImage(GameStateManager.getImages(imageFrom, name).url);
    } else {
      const dimensions: Dimension = GameStateManager.getImages(
        "ui",
        imageFrom,
        name
      ).dimensions;

      this.dim.width = dimensions.width;
      this.dim.height = dimensions.height;

      this.setImage(GameStateManager.getImages("ui", imageFrom, name).url);
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
    const selectedHouse: ImageItemType = GameStateManager.getImages(
      "buildings",
      this.name
    );
    GameStateManager.setBuilder(selectedHouse);
    GameStateManager.setState(GameState.Build);
  }
}
