import { en } from "@/languages/en";
import { hu } from "@/languages/hu";

type AvailableLanguages = "hu" | "en";

export type Buttons =
  | "menu"
  | "newGame"
  | "statistic"
  | "description"
  | "registration"
  | "login"
  | "back"
  | "create"
  | "lobby"
  | "join"
  | "start"
  | "empty";

export type Units = "knight" | "archer";
export type Buildings =
  | "woodcutter"
  | "sawmill"
  | "stonecutter"
  | "forester"
  | "farm"
  | "mill"
  | "bakery"
  | "well"
  | "ironsmelter"
  | "weaponsmith"
  | "toolsmith"
  | "barracks"
  | "guardhouse"
  | "storage"
  | "residence";

type DataType = {
  [language in AvailableLanguages]: {
    buttonTexts: { [button in Buttons]: string };
    units: { [unit in Units]: string };
    buildings: { [building in Buildings]: string };
  };
};

export const language: DataType = {
  hu,
  en,
};
