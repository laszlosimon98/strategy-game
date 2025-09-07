import { en } from "@/data/languages/en";
import { hu } from "@/data/languages/hu";

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
