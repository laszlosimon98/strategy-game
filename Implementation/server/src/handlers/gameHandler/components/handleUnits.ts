import { Server, Socket } from "socket.io";
import { Communicate } from "../../../classes/communicate";
import { Unit } from "../../../classes/game/unit";
import { Indices } from "../../../classes/utils/indices";
import { getUnit } from "../../../classes/utils/utils";
import { Validator } from "../../../classes/validator";
import { state } from "../../../data/state";
import { EntityType, Position } from "../../../types/types";
import { Cell } from "../../../classes/game/cell";
import { World } from "../../../classes/game/world";
import { PathFinder } from "../../../classes/pathFind/pathFinder";
import { units } from "../../../data/units";

export const handleUnits = (io: Server, socket: Socket) => {
  /**
   * Létrehoz egy új egységet, majd értesíti a játékosokat
   * @param {EntityType} entity egység
   * @param {string} name egység neve (knight, archer)
   * @returns
   */
  const unitCreate = ({
    entity,
    name,
  }: {
    entity: EntityType;
    name: string;
  }): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    entity.data.owner = socket.id;
    const unit = new Unit(entity, name);

    state[Communicate.getCurrentRoom(socket)].players[socket.id].units.push(
      unit
    );

    Communicate.sendMessageToEveryOne(io, socket, "game:unitCreate", {
      entity: unit.getEntity(),
      properties: units[name],
    });
  };

  /**
   * Mozgatja a kiválasztott egységet a megtalált úton,
   * menet közben figyelve a világ változásait
   * @param {EntityType} entity egység
   * @param {Indices} next a megtalált út következő cellája
   * @param {Indices} goal a megtalált út cél cellája
   */
  const unitMoving = ({
    entity,
    next,
    goal,
  }: {
    entity: EntityType;
    next: Indices;
    goal: Indices;
  }) => {
    const unit: Unit | undefined = getUnit(socket, entity);
    if (unit) {
      const world: Cell[][] = World.getWorld(socket);

      if (!world[next.i][next.j].isWalkAble()) {
        const indices: Indices[] = PathFinder.getPath(
          world,
          unit.getEntity().data.indices,
          goal
        );

        Communicate.sendMessageToEveryOne(io, socket, "game:pathFind", {
          path: indices,
          entity,
        });
      } else {
        unit.setIndices(next);
        Communicate.sendMessageToEveryOne(io, socket, "game:unitMoving", next);
      }
    }
  };

  /**
   * Frissíti a kliensek között az egységek pozícióját
   * @param {EntityType} entity egység
   * @param {Position} newPos új pozíció
   * @param {string} direction irány
   */
  const unitUpdatePosition = ({
    entity,
    newPos,
    direction,
  }: {
    entity: EntityType;
    newPos: Position;
    direction: string;
  }): void => {
    const unit: Unit | undefined = getUnit(socket, entity);

    if (unit) {
      unit.setPosition(newPos);
      Communicate.sendMessageToEveryOne(io, socket, "game:unitUpdatePosition", {
        entity: unit.getEntity(),
        newPos: unit.getPosition(),
        direction,
      });
    }
  };

  /**
   * Értesíti a játékosokat ha az egység elérte a cél celláját
   * @param entity egység
   */
  const unitDestinationReached = (entity: EntityType) => {
    const unit: Unit | undefined = getUnit(socket, entity);

    if (unit) {
      Communicate.sendMessageToEveryOne(
        io,
        socket,
        "game:unitDestinationReached",
        entity
      );
    }
  };

  /**
   * Értesíti a játékosokat, hogy az adott egység támadást kezdett
   * @param {EntityType} entity egység
   */
  const startAttack = (entity: EntityType): void => {
    Communicate.sendMessageToEveryOne(
      io,
      socket,
      "game:unitStartAttacking",
      entity
    );
  };

  /**
   * Értesíti a játékosokat, hogy az adott egység befejezte a támadást
   * @param {EntityType} entity egység
   */
  const stopAttack = (entity: EntityType): void => {
    Communicate.sendMessageToEveryOne(
      io,
      socket,
      "game:unitStopAttacking",
      entity
    );
  };

  /**
   * Értesíti a játékosokat, hogy két egység támadja egymást és
   * frissíti az egységet életerejét
   * @param {EntityType} entity egység
   * @param {EntityType} opponentEntity ellenséges egység
   */
  const dealDamage = ({
    entity,
    opponentEntity,
  }: {
    entity: EntityType;
    opponentEntity: EntityType;
  }): void => {
    const unit: Unit | undefined = getUnit(socket, entity);
    const opponent: Unit | undefined = getUnit(socket, opponentEntity);

    if (unit && opponent) {
      opponent.takeDamage(unit.getDamage());

      if (opponent.getHealth() > 0) {
        Communicate.sendMessageToEveryOne(io, socket, "game:unitDealDamage", {
          entity: opponent.getEntity(),
          health: opponent.getHealth(),
        });
      } else {
        Communicate.sendMessageToEveryOne(io, socket, "game:unitDies", {
          unit: unit.getEntity(),
          opponentEntity: opponent.getEntity(),
        });
      }
    }
  };

  socket.on("game:unitCreate", unitCreate);

  socket.on("game:unitMoving", unitMoving);
  socket.on("game:unitUpdatePosition", unitUpdatePosition);
  socket.on("game:unitDestinationReached", unitDestinationReached);

  socket.on("game:unitStartAttacking", startAttack);
  socket.on("game:unitStopAttacking", stopAttack);
  socket.on("game:unitDealDamage", dealDamage);
};
