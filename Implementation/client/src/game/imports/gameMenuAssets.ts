import resource from "../../assets/Game/menuAssets/resource.png";
import food from "../../assets/Game/menuAssets/food.png";
import military from "../../assets/Game/menuAssets/military.png";
import other from "../../assets/Game/menuAssets/other.png";

import resource_selected from "../../assets/Game/menuAssets/resource_selected.png";
import food_selected from "../../assets/Game/menuAssets/food_selected.png";
import military_selected from "../../assets/Game/menuAssets/military_selected.png";
import other_selected from "../../assets/Game/menuAssets/other_selected.png";

import storage from "../../assets/Game/menuAssets/storage.png";
import storage_selected from "../../assets/Game/menuAssets/storage_selected.png";
import population from "../../assets/Game/menuAssets/population.png";
import population_selected from "../../assets/Game/menuAssets/population_selected.png";

type gameMenuAssetsType = {
  [key: string]: string;
  resource: string;
  food: string;
  military: string;
  other: string;
  storage: string;
  population: string;

  resource_selected: string;
  food_selected: string;
  military_selected: string;
  other_selected: string;
  storage_selected: string;
  population_selected: string;
};

export const gameMenuAssets: gameMenuAssetsType = {
  resource,
  food,
  military,
  other,
  storage,
  population,

  resource_selected,
  food_selected,
  military_selected,
  other_selected,
  storage_selected,
  population_selected,
};
