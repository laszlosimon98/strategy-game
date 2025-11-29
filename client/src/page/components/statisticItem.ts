import { Text } from "@/page/components/text";
import { Position } from "@/utils/position";

/**
 * Statisztika-komponens (név, győzelmek, vereségek) megjelenítésére szolgál.
 */
export class StatisticItem {
  private nameText: Text;
  private winsText: Text;
  private lossesText: Text;

  constructor(pos: Position, name: string, wins: string, losses: string) {
    this.nameText = new Text(new Position(pos.x + 25, pos.y), name, {
      fontSize: "18px",
    });
    this.winsText = new Text(new Position(pos.x + 300, pos.y), wins, {
      fontSize: "18px",
    });
    this.lossesText = new Text(new Position(pos.x + 450, pos.y), losses, {
      fontSize: "18px",
    });
  }

  public draw(): void {
    this.nameText.draw();
    this.winsText.draw();
    this.lossesText.draw();
  }
}
