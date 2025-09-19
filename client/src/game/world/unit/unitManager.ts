import { v4 as uuidv4 } from "uuid";

import { UnitStates } from "@/enums/unitsState";
import { Manager } from "@/game/world/manager";
import { Cell } from "@/game/world/cell";
import { unitRegister } from "@/game/world/unit/unitRegister";
import { Soldier } from "@/game/world/unit/units/soldier";
import { ServerHandler } from "@/server/serverHandler";
import type { EntityType, SoldierPropertiesType } from "@/types/game.types";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";
import {
  calculateDistance,
  isometricToCartesian,
  getImageNameFromUrl,
  removeElementFromArray,
} from "@/utils/utils";
import { Unit } from "@/game/world/unit/unit";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";

export class UnitManager extends Manager<Unit> {
  private selectedUnit: Unit | undefined;
  private keys: string[];

  public constructor() {
    super();
    this.selectedUnit = undefined;
    this.keys = Object.keys(StateManager.getPlayers());
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
    ) as unknown as Soldier;
  }

  public handleMiddleClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    const playerId: string = ServerHandler.getId();
    const color: string = StateManager.getPlayerColor(playerId);
    const name = Math.random() < 0.5 ? "knight" : "archer";

    const unitEntity: EntityType = {
      data: {
        id: uuidv4(),
        owner: playerId,
        url: StateManager.getImages("colors", color, `${name}idle`).url,
        indices,
        dimensions: settings.size.unit,
        position: this.pos,
        static: "",
      },
    };

    this.sendUnitCreateRequest(unitEntity, name);
  }

  public handleRightClick(indices: Indices): void {
    if (this.selectedUnit) {
      const entity: EntityType = this.selectedUnit.getEntity();
      const id: string = ServerHandler.getId();

      StateManager.addUnitToMovingArray(id, this.selectedUnit);
      this.sendPathFindRequest(entity, indices);
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    this.hoverObject(mousePos, cameraScroll, "units");
  }

  public createUnit(entity: EntityType, unit: Unit): void {
    const id: string = entity.data.owner;
    StateManager.createUnit(id, unit);
  }

  // FIXME: ezt optimalizálni kell
  private calculateAttack(): void {
    StateManager.getSoldiers(ServerHandler.getId()).forEach((myUnit) => {
      this.keys.forEach((otherId) => {
        if (ServerHandler.getId() !== otherId) {
          StateManager.getSoldiers(otherId).forEach((otherUnit) => {
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
    StateManager.getMovingUnits(ServerHandler.getId()).forEach((unit) => {
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
        this.createUnit(entity, unit);
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

        const unit = StateManager.findSoldier(entity);
        unit.setPrevState(unit.getState());
        unit.setState(UnitStates.Walking);
        unit.setPath([..._path]);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitStartAttacking",
      (entity: EntityType) => {
        const _unit = StateManager.findSoldier(entity);
        _unit.setPrevState(_unit.getState());
        _unit.setState(UnitStates.Attacking);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitStopAttacking",
      (entity: EntityType) => {
        const _unit = StateManager.findSoldier(entity);
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
        const unit = StateManager.findSoldier(entity);
        unit.setPosition(new Position(newPos.x, newPos.y));
        unit.setFacing(direction);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitDestinationReached",
      (entity: EntityType) => {
        const unit = StateManager.findSoldier(entity);
        unit.reset();
      }
    );

    ServerHandler.receiveMessage(
      "game:unitDealDamage",
      ({ entity, health }: { entity: EntityType; health: number }) => {
        const unit = StateManager.findSoldier(entity) as Soldier;

        unit.setHealth(health);
      }
    );

    ServerHandler.receiveMessage(
      "game:unitDies",
      ({ unit, opponent }: { unit: EntityType; opponent: EntityType }) => {
        const { owner } = opponent.data;
        const units = StateManager.getSoldiers(owner);
        removeElementFromArray(units, StateManager.findSoldier(opponent));

        ServerHandler.sendMessage("game:unitStopAttacking", unit);
      }
    );
  }
}
