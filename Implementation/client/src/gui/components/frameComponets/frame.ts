import { PosType } from "../../types/guiTypes";
import { GUIComponents } from "./guiComponents";

export class Frame extends GUIComponents {
  constructor(pos: PosType, width: number, height: number) {
    super(pos, width, height);
  }
}
