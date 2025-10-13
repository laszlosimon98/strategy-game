import { v4 as uuidv4 } from "uuid";

import { LabelButton } from "@/game/menu/sections/labelButton";
import { Section } from "@/game/menu/sections/section";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";
import type { EntityType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { Indices } from "@/utils/indices";
import { calculatePositionFromIndices } from "@/utils/utils";
import { Barracks } from "@/game/world/building/buildings/military/barracks";

export class BarracksPanel extends Section {
  private barracksButtons: LabelButton[] = [];
  private isPlayerInitialized: boolean = false;

  constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
    this.initButtons();
  }

  private initButtons(): void {
    const playerId = ServerHandler.getId();
    const players = StateManager.getPlayers();

    if (playerId in players) {
      this.isPlayerInitialized = true;

      this.barracksButtons.push(
        new LabelButton(
          new Position(this.pos.x + 25, this.pos.y + 300),
          new Dimension(96, 96),
          StateManager.getStaticImage(playerId, "knight"),
          "empty",
          {
            hasTooltip: true,
            hasPrice: true,
            type: "unit",
          }
        )
      );

      this.barracksButtons.push(
        new LabelButton(
          new Position(this.pos.x + 125, this.pos.y + 300),
          new Dimension(96, 96),
          StateManager.getStaticImage(playerId, "archer"),
          "empty",
          {
            hasTooltip: true,
            hasPrice: true,
            type: "unit",
          }
        )
      );
    }
  }

  public draw(): void {
    if (this.isPlayerInitialized) {
      this.barracksButtons.forEach((btn) => btn.draw());
    }
  }

  public update(dt: number, mousePos: Position): void {
    if (!this.isPlayerInitialized) {
      this.initButtons();
    } else {
      this.barracksButtons.forEach((btn) => btn.update(dt, mousePos));
    }
  }

  public handleClick(mousePos: Position): void {
    this.barracksButtons.forEach((btn) => {
      if (btn.isClicked(mousePos.x, mousePos.y)) {
        this.createUnit(btn);
      }
    });
  }

  // FIXME: Amint elmentem a cellákat is a state-be, akkor onnan le tudom kérdeni a pos-t
  private createUnit(btn: LabelButton): void {
    const playerId: string = ServerHandler.getId();
    const color: string = StateManager.getPlayerColor(playerId);
    const data = StateManager.getInfoPanelData();
    const name = btn.getName();

    if (data && data.getEntity().data.name === "barracks") {
      const indices = data.getIndices();

      const unitEntity: EntityType = {
        data: {
          id: uuidv4(),
          owner: playerId,
          url: StateManager.getImages("units", color, `${name}idle`).url,
          indices: new Indices(indices.i + 1, indices.j),
          dimensions: settings.size.unit,
          position: calculatePositionFromIndices(
            new Indices(indices.i + 1, indices.j)
          ),
          static: "",
          name,
          attackTimer: 0,
          cooldownTimer: 0,
          healingTimer: 0,
          productionTime: 0,
          isProductionBuilding: false,
        },
      };

      this.sendUnitCreateRequest(unitEntity);
    }
  }

  private sendUnitCreateRequest(entity: EntityType): void {
    ServerHandler.sendMessage("game:unitCreate", { entity });
  }
}
