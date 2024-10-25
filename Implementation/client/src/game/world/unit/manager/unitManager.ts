import { v4 as uuidv4 } from "uuid";

import { state } from "../../../../data/state";
import { ServerHandler } from "../../../../server/serverHandler";
import { UNIT_SIZE } from "../../../../settings";
import { EntityType } from "../../../../types/gameType";
import { Indices } from "../../../../utils/indices";
import { Position } from "../../../../utils/position";
import { Manager } from "../../manager/manager";
import { Tile } from "../../tile";
import { Unit } from "../unit";
import { UnitStates } from "../../../../enums/unitsState";
import { Knight } from "../units/knight";

export class UnitManager extends Manager<Unit> {
  private selectedUnit: Unit | undefined;
  private start: Indices;
  private end: Indices;

  public constructor() {
    super();
    this.selectedUnit = undefined;
    this.start = Indices.zero();
    this.end = Indices.zero();
  }

  public draw(): void {
    super.draw("units");
  }

  public update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll, "units");
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
  }

  public handleMiddleClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    const color: string = state.game.players[ServerHandler.getId()].color;

    const unitEntity: EntityType = {
      data: {
        id: uuidv4(),
        owner: ServerHandler.getId(),
        url: state.images.colors[color].knightidle.url,
        indices,
        dimensions: UNIT_SIZE,
        position: this.pos,
        static: "",
      },
    };

    this.sendUnitCreateRequest(unitEntity);
  }

  public handleRightClick(indices: Indices): void {
    if (this.selectedUnit) {
      // this.start = this.selectedUnit.getIndices();
      this.end = indices;

      const entity: EntityType = this.selectedUnit.getEntity();
      this.sendPathFindRequest(entity);
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    this.hoverObject(mousePos, cameraScroll, "units");
  }

  private sendUnitCreateRequest(entity: EntityType): void {
    ServerHandler.sendMessage("game:unitCreate", entity);
  }

  private sendPathFindRequest(entity: EntityType): void {
    ServerHandler.sendMessage("game:pathFind", {
      entity,
      goal: this.end,
    });
  }

  protected handleCommunication(): void {
    ServerHandler.receiveMessage("game:unitCreate", (entity: EntityType) => {
      const unit: Unit = this.creator(Knight, entity, "knight");

      this.setObjectPosition(unit, entity.data.position);
      state.game.players[entity.data.owner].units.push(unit);
    });

    ServerHandler.receiveMessage(
      "game:pathFind",
      ({ path, entity }: { path: Indices[]; entity: EntityType }) => {
        const _path: Tile[] = [];

        path.forEach((index) => {
          const i = index.i;
          const j = index.j;
          _path.push(this.world[i][j]);
        });

        state.game.players[entity.data.owner].units.forEach((unit) => {
          if (unit.equal(entity)) {
            unit.setState(UnitStates.Walking);
            unit.setPath(_path);
          }
        });
      }
    );
  }
}
