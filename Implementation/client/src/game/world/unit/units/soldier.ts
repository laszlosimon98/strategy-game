import { state } from "../../../../data/state";
import { ServerHandler } from "../../../../server/serverHandler";
import { EntityType } from "../../../../types/gameType";
import { Position } from "../../../../utils/position";
import { Timer } from "../../../../utils/timer";
import { Unit } from "../unit";

export abstract class Soldier extends Unit {
  protected range: number = 0;
  protected health: number = 0;
  protected damage: number = 0;

  protected attackTimer: Timer;
  private keys: string[];

  constructor(entity: EntityType, name: string) {
    super(entity, name);

    this.attackTimer = new Timer(1500);
    this.attackTimer.activate();

    this.keys = Object.keys(state.game.players);
  }

  public draw(): void {
    super.draw();
  }

  public update(dt: number, cameraPos: Position): void {
    super.update(dt, cameraPos);
    this.attackTimer.update();

    this.keys.forEach((key1) => {
      this.keys.forEach((key2) => {
        if (key1 !== key2) {
          state.game.players[key1].units.forEach((unit1) => {
            state.game.players[key2].units.forEach((unit2) => {
              if (
                this.calculateDistance(
                  unit1.getPosition(),
                  unit2.getPosition()
                ) < this.range
              ) {
                this.attack(unit1 as Soldier, unit2 as Soldier);
              }
            });
          });
        }
      });
    });

    // state.game.players[ServerHandler.getId()].units.forEach((myUnit) => {
    //   this.oppenentKeys.forEach((key) => {
    //     state.game.players[key].units.forEach((opponentUnit) => {
    //       if (
    //         this.calculateDistance(
    //           myUnit.getPosition(),
    //           opponentUnit.getPosition()
    //         ) < this.range
    //       ) {
    //         this.attack(myUnit as Soldier, opponentUnit as Soldier);
    //       }
    //     });
    //   });
    // });
  }

  protected abstract attack(unit: Soldier, opponentUnit: Soldier): void;
}
