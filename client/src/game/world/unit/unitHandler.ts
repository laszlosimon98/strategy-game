import { Manager } from "@/game/world/manager";
import { Soldier } from "@/game/world/unit/units/soldier";
import { ServerHandler } from "@/server/serverHandler";
import type { EntityType, SoldierPropertyType } from "@/types/game.types";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";
import { Unit } from "@/game/world/unit/unit";
import { StateManager } from "@/manager/stateManager";
import { calculatePositionFromIndices } from "@/utils/utils";
import type { Cell } from "@/game/world/cell";
import { UnitStates } from "@/enums/unitsState";

export class UnitHandler extends Manager {
  private selectedUnit: Unit | undefined;

  public constructor() {
    super();
    this.selectedUnit = undefined;
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
    ) as unknown as Soldier;
  }

  public handleMiddleClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {}

  public handleRightClick(indices: Indices): void {
    if (this.selectedUnit) {
      const entity: EntityType = this.selectedUnit.getEntity();
      this.sendMovingRequest(entity, indices);
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    this.hoverObject(mousePos, cameraScroll, "units");
  }

  public createUnit(entity: EntityType, properties: SoldierPropertyType): void {
    const unit: Soldier = this.creator<Soldier>(Soldier, entity, properties);
    entity.data.position = calculatePositionFromIndices(entity.data.indices);

    this.setObjectPosition(unit, entity.data.position);
    StateManager.createUnit(entity.data.owner, unit);
  }

  protected handleCommunication(): void {
    ServerHandler.receiveMessage(
      "game:soldier-create",
      ({
        entity,
        properties,
      }: {
        entity: EntityType;
        properties: SoldierPropertyType;
      }) => {
        this.createUnit(entity, properties);
      }
    );

    ServerHandler.receiveMessage(
      "game:unit-move",
      ({ entity, path }: { entity: EntityType; path: Indices[] }) => {
        const unit: Unit = StateManager.getUnit(entity);
        const world: Cell[][] = StateManager.getWorld();
        const calculatePath: Cell[] = [];

        path.forEach((p) => {
          const { i, j } = p;
          calculatePath.push(world[i][j]);
        });

        unit.setPath(calculatePath);
        unit.setState(UnitStates.Walking);
      }
    );

    ServerHandler.receiveMessage(
      "game:unit-idle-facing",
      ({ entity, facing }: { entity: EntityType; facing: number }) => {
        const unit: Unit = StateManager.getUnit(entity);
        unit.setFacing(facing);
      }
    );
  }

  private sendMovingRequest(entity: EntityType, goal: Indices): void {
    ServerHandler.sendMessage("game:unit-move", {
      entity,
      goal,
    });
  }
}
