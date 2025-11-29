import { PageState } from "@/enums/pageState";
import { canvasHeight } from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { Frame } from "@/page/components/frame";
import { StatisticItem } from "@/page/components/statisticItem";
import { Text } from "@/page/components/text";
import { Page } from "@/page/views/page";
import { settings } from "@/settings";
import type { StatisticType } from "@/types/statistic.type";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class Statistic extends Page {
  private backButton: Button;
  private container: Frame;

  private statTitles!: StatisticItem;
  private playerStat!: StatisticType;
  private playerStatItem!: StatisticItem;

  private topFiveText!: Text;
  private topFiveStats!: StatisticType[];
  private topFivePlayer!: StatisticItem[];

  public constructor(title: string) {
    super(title);

    this.backButton = new Button(
      settings.pos.default.back,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "back",
      () => StateManager.setPageState(PageState.MainMenu)
    );

    this.container = new Frame(
      new Position(
        settings.pos.titlePos.x - settings.margin * 2,
        settings.pos.titlePos.y + settings.margin + 50
      ),
      new Dimension(580, Math.max(canvasHeight / 2, 200))
    );

    this.init();

    this.buttons.push(this.backButton);
  }

  public draw(): void {
    super.draw();
    this.container.draw();
    this.statTitles.draw();
    this.playerStatItem.draw();
    this.topFiveText.draw();

    if (this.topFivePlayer) {
      this.topFivePlayer.forEach((item) => item.draw());
    }
  }

  public update(): void {
    super.update();
    if (this.playerStat.username === "") {
      this.init();
    }
  }

  private init(): void {
    this.initTitles();
    this.initPlayer();
    this.initTopFive();
  }

  private initTitles(): void {
    this.statTitles = new StatisticItem(
      new Position(
        settings.pos.titlePos.x - settings.margin * 2 + 20,
        settings.pos.titlePos.y + settings.margin + 50 + 35
      ),
      "Név",
      "Győzelem",
      "Vereség"
    );
  }

  private initPlayer(): void {
    this.playerStat = StateManager.getPlayerStat();

    this.playerStatItem = new StatisticItem(
      new Position(
        settings.pos.titlePos.x - settings.margin * 2 + 20,
        settings.pos.titlePos.y + settings.margin + 50 + 75
      ),
      this.playerStat.username,
      `${this.playerStat.wins}`,
      `${this.playerStat.losses}`
    );
  }

  private initTopFive(): void {
    this.topFiveStats = StateManager.getTopFive();

    this.topFiveText = new Text(Position.zero(), "Top 5 játékos:", {
      fontSize: "24px",
    });

    this.topFiveText.setCenter({
      xFrom: settings.pos.titlePos.x - settings.margin * 2,
      xTo: 580,
      yFrom: settings.pos.titlePos.y + settings.margin + 50 + 105,
      yTo: 0,
    });

    this.topFivePlayer = [];
    const startY = settings.pos.titlePos.y + settings.margin + 50 + 155;
    const itemMargin = 40;

    if (this.topFiveStats && this.topFiveStats.length > 0) {
      this.topFiveStats.forEach((playerStat, index) => {
        const yPosition = startY + index * itemMargin;

        const topFiveItem = new StatisticItem(
          new Position(
            settings.pos.titlePos.x - settings.margin * 2 + 20,
            yPosition
          ),
          playerStat.username,
          `${playerStat.wins}`,
          `${playerStat.losses}`
        );

        this.topFivePlayer.push(topFiveItem);
      });
    }
  }
}
