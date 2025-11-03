import { Manager } from "@/game/world/manager";
import { Soldier } from "@/game/world/unit/units/soldier";
import { ServerHandler } from "@/server/serverHandler";
import type { EntityType, SoldierPropertyType } from "@/types/game.types";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";
import { Unit } from "@/game/world/unit/unit";
import { StateManager } from "@/manager/stateManager";
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
      this.sendMovingRequest(this.selectedUnit.getEntity(), indices);
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    this.hoverObject(mousePos, cameraScroll, "units");
  }

  public createUnit(entity: EntityType, properties: SoldierPropertyType): void {
    const unit: Soldier = this.creator<Soldier>(Soldier, entity, properties);
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
      "game:unit-idle-facing",
      ({ entity }: { entity: EntityType }) => {
        const unit: Unit | undefined = StateManager.getUnit(entity);
        if (!unit) return;

        unit.setFacing(entity.data.facing);
      }
    );

    ServerHandler.receiveMessage(
      "game:unit-ready-for-move",
      ({ entity }: { entity: EntityType }) => {
        const unit: Unit | undefined = StateManager.getUnit(entity);
        if (!unit) return;

        unit.setState(UnitStates.Walking);
      }
    );

    ServerHandler.receiveMessage(
      "game:unit-moving",
      ({ entity }: { entity: EntityType }) => {
        const unit: Unit | undefined = StateManager.getUnit(entity);
        if (!unit) return;

        unit.setFacing(entity.data.facing);

        const pos: Position = new Position(
          entity.data.position.x,
          entity.data.position.y
        );

        const ind: Indices = new Indices(
          entity.data.indices.i,
          entity.data.indices.j
        );

        unit.setPosition(pos);
        unit.setIndices(ind);
      }
    );

    ServerHandler.receiveMessage(
      "game:unit-stop",
      ({ entity }: { entity: EntityType }) => {
        const unit: Unit | undefined = StateManager.getUnit(entity);
        if (!unit) return;

        const ind: Indices = new Indices(
          entity.data.indices.i,
          entity.data.indices.j
        );

        unit.setIndices(ind);
        unit.reset();
      }
    );
  }

  private sendMovingRequest(entity: EntityType, goal: Indices): void {
    ServerHandler.sendMessage("game:unit-start-movement", {
      entity,
      goal,
    });
  }
}
