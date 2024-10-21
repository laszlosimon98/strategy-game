import { state } from "../../../../data/state";
import { ServerHandler } from "../../../../server/serverHandler";
import { EntityType } from "../../../../types/gameType";
import { Dimension } from "../../../../utils/dimension";
import { Indices } from "../../../../utils/indices";
import { Position } from "../../../../utils/position";
import { Manager } from "../../manager/manager";
import { Tile } from "../../tile";
import { Unit } from "../unit";

export class UnitManager extends Manager<Unit> {
  private selectedUnit: Unit | undefined;
  private start: Indices;
  private end: Indices;

  private path: Tile[];

  public constructor() {
    super();
    this.selectedUnit = undefined;
    this.start = Indices.zero();
    this.end = Indices.zero();

    this.path = [];
  }

  public draw(): void {
    super.draw("units");
  }

  public update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll, "units");

    if (this.path.length > 1 && this.selectedUnit) {
      this.selectedUnit.move(this.path);
    }
  }

  public handleLeftClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    this.selectedUnit = this.selectObject(
      mousePos,
      cameraScroll,
      "units"
    ) as unknown as Unit | undefined;

    if (this.selectedUnit) {
      this.start = this.selectedUnit.getIndices();
    }
  }

  public handleMiddleClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    const color: string = state.game.players[ServerHandler.getId()].color;
    const unitEntity: EntityType = {
      data: {
        dimensions: new Dimension(64, 64),
        indices,
        owner: "",
        url: `http://localhost:3000/assets/colors/${color}/soldieridle.png`,
      },
    };
    const unit: Unit = this.creator(Unit, unitEntity);
    this.setObjectPosition(unit, this.pos);
    state.game.players[ServerHandler.getId()].units.push(unit);
  }

  public handleRightClick(indices: Indices, world: Tile[][]): void {
    if (this.selectedUnit) {
      this.end = indices;

      this.sendMoveRequest();

      ServerHandler.receiveMessage("game:pathFind", (indices: Indices[]) => {
        indices.forEach((index) => {
          const i = index.i;
          const j = index.j;
          this.path.push(world[i][j]);
        });
      });
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    this.hoverObject(mousePos, cameraScroll, "units");
  }

  private sendMoveRequest(): void {
    ServerHandler.sendMessage("game:pathFind", {
      start: this.start,
      end: this.end,
    });
  }

  protected handleCommunication(): void {}
}
