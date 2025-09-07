import { en } from "./languages/en";
import { hu } from "./languages/hu";

type availableLanguages = "hu" | "en";

type DataType = {
  [language in availableLanguages]: {
    [name: string]: string;
  };
};
export const data: DataType = {
  hu,
  en,
};
