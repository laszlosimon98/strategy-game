import { Stone } from "@/game/produceable/stone";
import { Tree } from "@/game/produceable/tree";
import { ReturnMessage } from "@/types/setting.types";

export type Instance = Stone | Tree | null;

export type DestroyBuildingResponse = {
  status: "completed" | "failed";
} & ReturnMessage;
