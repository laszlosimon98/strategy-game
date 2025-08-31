import { playersFromState, imagesFromState } from "@/game/data/state";
import { UnitStatus } from "@/game/enums/unit-status";
import { UNIT_SIZE } from "@/game/settings";
import { Indices } from "@/game/utils/indices";
import { Position } from "@/game/utils/position";
import {
  calculateDistance,
  isometricToCartesian,
  getImageNameFromUrl,
  findUnit,
} from "@/game/utils/utils";
import { Cell } from "@/game/world/cell";
import { Manager } from "@/game/world/manager/manager";
import { Unit } from "@/game/world/unit/unit";
import { unitRegister } from "@/game/world/unit/unit-register";
import { Soldier } from "@/game/world/unit/units/soldier";
import { ServerHandler } from "@/server/server-handler";
import { addMovingUnit, addUnit } from "@/services/slices/game.slice";
import { dispatch } from "@/services/store";
import { EntityType, SoldierPropertiesType } from "@/services/types/game.types";
import { v4 as uuidv4 } from "uuid";

export class UnitManager extends Manager<Unit> {
  private selectedUnit: Unit | undefined;
  private keys: string[];

  public constructor() {
    super();
    this.selectedUnit = undefined;
    this.keys = Object.keys(playersFromState);
  }

  public draw(): void {
    super.draw("units");
  }

  public update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll, "units");
    this.handleMove(dt);

    this.calculateAttack();
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
    ) as unknown as Soldier | undefined;
  }

  public handleMiddleClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    const color: string = playersFromState[ServerHandler.getId()].color;
    const name = Math.random() < 0.5 ? "knight" : "archer";

    const unitEntity: EntityType = {
      data: {
        id: uuidv4(),
        owner: ServerHandler.getId(),
        url: imagesFromState.colors[color][name + "idle"].url,
        indices,
        dimensions: UNIT_SIZE,
        position: this.pos,
        static: "",
      },
    };

    this.sendUnitCreateRequest(unitEntity, name);
  }

  public handleRightClick(indices: Indices): void {
    if (this.selectedUnit) {
      const entity: EntityType = this.selectedUnit.getEntity();
      dispatch(
        addMovingUnit({ id: ServerHandler.getId(), unit: this.selectedUnit })
      );
      this.sendPathFindRequest(entity, indices);
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    this.hoverObject(mousePos, cameraScroll, "units");
  }

  // FIXME: WTH is this
  private calculateAttack(): void {
    playersFromState[ServerHandler.getId()].units.forEach((myUnit: Soldier) => {
      this.keys.forEach((otherId) => {
        if (ServerHandler.getId() !== otherId) {
          playersFromState[otherId].units.forEach((otherUnit: Soldier) => {
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
              myUnit.getState() !== UnitStatus.Attacking
            ) {
              myUnit.setOpponent(otherUnit);
              ServerHandler.sendMessage(
                "game:unitStartAttacking",
                myUnit.getEntity()
              );
            }

            if (
              distance > myUnit.getRange() &&
              myUnit.getState() === UnitStatus.Attacking &&
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

  private handleMove(dt: number): void {
    playersFromState[ServerHandler.getId()].movingUnits.forEach(
      (unit: Unit) => {
        if (unit.getState() === UnitStatus.Walking) {
          unit.move(dt);
        }
      }
    );
  }

  private sendUnitCreateRequest(entity: EntityType, name: string): void {
    ServerHandler.sendMessage("game:unitCreate", { entity, name });
  }

  private sendPathFindRequest(entity: EntityType, goal: Indices): void {
    ServerHandler.sendMessage("game:pathFind", {
      entity,
      goal,
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
        const name = getImageNameFromUrl(entity.data.url).includes("knight")
          ? "knight"
          : "archer";

        const unit: Soldier = this.creator<Soldier>(
          unitRegister[name],
          entity,
          name,
          properties
        );

        this.setObjectPosition(unit, entity.data.position);
        dispatch(addUnit({ id: ServerHandler.getId(), unit }));
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

        const unit = findUnit(entity) as Soldier;
        unit.setPrevState(unit.getState());
        unit.setState(UnitStatus.Walking);
        unit.setPath([..._path]);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitStartAttacking",
      (entity: EntityType) => {
        const unit = findUnit(entity) as Soldier;
        unit.setPrevState(unit.getState());
        unit.setState(UnitStatus.Attacking);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitStopAttacking",
      (entity: EntityType) => {
        const unit = findUnit(entity) as Soldier;
        unit.setState(unit.getPrevState());
        unit.resetAnimation();
      }
    );

    ServerHandler.receiveMessage(
      "game:unitUpdatePosition",
      ({
        entity,
        newPos,
        direction,
      }: {
        entity: EntityType;
        newPos: Position;
        direction: string;
      }) => {
        const unit = findUnit(entity) as Soldier;
        unit.setPosition(new Position(newPos.x, newPos.y));
        unit.setFacing(direction);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitDestinationReached",
      (entity: EntityType) => {
        const unit = findUnit(entity) as Soldier;
        unit.reset();
      }
    );

    ServerHandler.receiveMessage(
      "game:unitDealDamage",
      ({ entity, health }: { entity: EntityType; health: number }) => {
        const unit = findUnit(entity) as Soldier;

        unit.setHealth(health);
      }
    );

    // FIXME:
    ServerHandler.receiveMessage(
      "game:unitDies",
      ({ unit, opponent }: { unit: EntityType; opponent: EntityType }) => {
        const { owner } = opponent.data;
        const units = playersFromState[owner].units;
        // removeElementFromArray(units, findUnit(opponent) as Soldier);

        ServerHandler.sendMessage("game:unitStopAttacking", unit);
      }
    );
  }
}
