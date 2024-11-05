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
import { Cell } from "../../cell";
import {
  calculateDistance,
  findUnit,
  getImageNameFromUrl,
  isometricToCartesian,
  removeElementFromArray,
} from "../../../../utils/utils";
import { Soldier } from "../units/soldier";
import { unitRegister } from "../unitRegister/unitRegister";

export class UnitManager extends Manager<Unit> {
  private selectedUnit: Unit | undefined;
  private keys: string[];

  public constructor() {
    super();
    this.selectedUnit = undefined;
    this.keys = Object.keys(state.game.players);
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
    const color: string = state.game.players[ServerHandler.getId()].color;
    const name = Math.random() < 0.5 ? "knight" : "archer";

    const unitEntity: EntityType = {
      data: {
        id: uuidv4(),
        owner: ServerHandler.getId(),
        url: state.images.colors[color][name + "idle"].url,
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
      state.game.players[ServerHandler.getId()].movingUnits.push(
        this.selectedUnit
      );
      this.sendPathFindRequest(entity, indices);
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    this.hoverObject(mousePos, cameraScroll, "units");
  }

  private calculateAttack(): void {
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

  private handleMove(dt: number): void {
    state.game.players[ServerHandler.getId()].movingUnits.forEach((unit) => {
      if (unit.getState() === UnitStates.Walking) {
        unit.move(dt);
      }
    });
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

        const unit = findUnit(entity);
        unit.setPrevState(unit.getState());
        unit.setState(UnitStates.Walking);
        unit.setPath([..._path]);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitStartAttacking",
      (entity: EntityType) => {
        const _unit = findUnit(entity);
        _unit.setPrevState(_unit.getState());
        _unit.setState(UnitStates.Attacking);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitStopAttacking",
      (entity: EntityType) => {
        const _unit = findUnit(entity);
        _unit.setState(_unit.getPrevState());
        _unit.resetAnimation();
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
        const unit = findUnit(entity);
        unit.setPosition(new Position(newPos.x, newPos.y));
        unit.setFacing(direction);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitDestinationReached",
      (entity: EntityType) => {
        const unit = findUnit(entity);
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

    ServerHandler.receiveMessage(
      "game:unitDies",
      ({ unit, opponent }: { unit: EntityType; opponent: EntityType }) => {
        const { owner } = opponent.data;
        const units = state.game.players[owner].units;
        removeElementFromArray(units, findUnit(opponent));

        ServerHandler.sendMessage("game:unitStopAttacking", unit);
      }
    );
  }
}
