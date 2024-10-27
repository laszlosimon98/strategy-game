import { v4 as uuidv4 } from "uuid";

import { state } from "../../../../data/state";
import { ServerHandler } from "../../../../server/serverHandler";
import { UNIT_SIZE } from "../../../../settings";
import { EntityType, SoldierPropertiesType } from "../../../../types/gameType";
import { Indices } from "../../../../utils/indices";
import { Position } from "../../../../utils/position";
import { Manager } from "../../manager/manager";
import { Unit } from "../unit";
import { UnitStates } from "../../../../enums/unitsState";
import { Knight } from "../units/knight";
import { Cell } from "../../cell";
import {
  calculateDistance,
  isometricToCartesian,
} from "../../../../utils/utils";
import { Soldier } from "../units/soldier";

export class UnitManager extends Manager<Unit> {
  private selectedUnit: Unit | undefined;
  private end: Indices;
  private keys: string[];

  public constructor() {
    super();
    this.selectedUnit = undefined;
    this.end = Indices.zero();
    this.keys = Object.keys(state.game.players);
  }

  public draw(): void {
    super.draw("units");
  }

  public update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll, "units");

    state.game.players[ServerHandler.getId()].units.forEach((myUnit) => {
      this.keys.forEach((otherId) => {
        if (ServerHandler.getId() !== otherId) {
          state.game.players[otherId].units.forEach((otherUnit) => {
            const distance = calculateDistance(
              isometricToCartesian(myUnit.getPosition()),
              isometricToCartesian(otherUnit.getPosition())
            );

            let distanceToCurrentOpponent: number;

            const opponent = myUnit.getOpponent();
            if (opponent) {
              distanceToCurrentOpponent = calculateDistance(
                isometricToCartesian(myUnit.getPosition()),
                isometricToCartesian(opponent.getPosition())
              );
              if (distanceToCurrentOpponent > myUnit.getRange()) {
                myUnit.setOpponent(undefined);
              }
            }

            if (
              distance < myUnit.getRange() &&
              myUnit.getState() !== UnitStates.Attacking
            ) {
              myUnit.setOpponent(otherUnit);
              ServerHandler.sendMessage(
                "game:unitStartAttacking",
                myUnit.getEntity()
              );
            }

            if (
              distance > myUnit.getRange() &&
              myUnit.getState() === UnitStates.Attacking &&
              !myUnit.getOpponent()
            ) {
              ServerHandler.sendMessage(
                "game:unitStopAttacking",
                myUnit.getEntity()
              );
            }
          });
        }
      });
    });
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
      this.end = indices;

      const entity: EntityType = this.selectedUnit.getEntity();
      this.sendPathFindRequest(entity);
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    this.hoverObject(mousePos, cameraScroll, "units");
  }

  private sendUnitCreateRequest(entity: EntityType): void {
    ServerHandler.sendMessage("game:unitCreate", { entity, name: "knight" });
  }

  private sendPathFindRequest(entity: EntityType): void {
    ServerHandler.sendMessage("game:pathFind", {
      entity,
      goal: this.end,
    });
  }

  protected handleCommunication(): void {
    ServerHandler.receiveMessage(
      "game:unitCreate",
      ({
        entity,
        properties,
      }: {
        entity: EntityType;
        properties: SoldierPropertiesType;
      }) => {
        const unit: Soldier = this.creator(Knight, { ...entity }, "knight", {
          ...properties,
        });

        this.setObjectPosition(unit, entity.data.position);
        state.game.players[entity.data.owner].units.push(unit);
      }
    );

    ServerHandler.receiveMessage(
      "game:pathFind",
      ({ path, entity }: { path: Indices[]; entity: EntityType }) => {
        const _path: Cell[] = [];

        path.forEach((index) => {
          const i = index.i;
          const j = index.j;
          _path.push(this.world[i][j]);
        });

        state.game.players[entity.data.owner].units.forEach((unit) => {
          if (unit.equal(entity)) {
            unit.setState(UnitStates.Walking);
            unit.setPath([..._path]);
          }
        });
      }
    );

    ServerHandler.receiveMessage(
      "game:unitStartAttacking",
      (unit: { owner: string; id: string }) => {
        const _unit = this.findUnit(unit.owner, unit.id);
        _unit.setState(UnitStates.Attacking);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitStopAttacking",
      (unit: { owner: string; id: string }) => {
        const _unit = this.findUnit(unit.owner, unit.id);
        _unit.setState(UnitStates.Idle);
        _unit.resetAnimation();
      }
    );

    ServerHandler.receiveMessage(
      "game:unitMoveUpdatePosition",
      (entity: EntityType) => {
        const unit = this.findUnit(entity.data.owner, entity.data.id);
        unit.setPosition(
          new Position(entity.data.position.x, entity.data.position.y)
        );
      }
    );
  }

  private findUnit(owner: string, id: string): Soldier {
    return state.game.players[owner].units.find(
      (unit) => unit.getEntity().data.id === id
    ) as Soldier;
  }
}
