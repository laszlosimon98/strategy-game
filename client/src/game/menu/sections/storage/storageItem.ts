import { ctx } from "@/init";
import { language } from "@/languages/language";
import { StateManager } from "@/manager/stateManager";
import { PageComponents } from "@/page/components/pageComponents";
import { Text } from "@/page/components/text";
import type {
  CombinedType,
  CategoryType,
  StorageItemType,
  StorageType,
} from "@/types/storage.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class StorageItem extends PageComponents {
  // később
  // private image: HTMLImageElement;
  private material: Text;
  private amount: Text;

  public constructor(
    pos: Position,
    dim: Dimension,
    path: CategoryType,
    item: CombinedType,
    storage: StorageType
  ) {
    super(pos, dim);

    this.material = new Text(new Position(pos.x, pos.y), "");
    this.amount = new Text(new Position(pos.x, pos.y + 25), "");

    const getStorageItem = () => {
      const group = storage[path] as any;
      if (group && group[item]) {
        return group[item] as StorageItemType<CombinedType>;
      }
    };

    const storageItem = getStorageItem();

    if (storageItem) {
      this.material.setText(
        language[StateManager.getLanguage()].storage[storageItem.name]
      );

      this.amount.setText(storageItem.amount.toString());

      this.material.setCenter({
        xFrom: this.material.getPos().x,
        xTo: ctx.measureText(this.material.getText()).width,
        yFrom: this.material.getPos().y,
        yTo: 0,
      });

      this.amount.setCenter({
        xFrom: this.amount.getPos().x,
        xTo: ctx.measureText(this.material.getText()).width,
        yFrom: this.amount.getPos().y,
        yTo: 0,
      });
    }
  }

  public draw(): void {
    super.draw();
    this.material.draw();
    this.amount.draw();
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
  }
}
