import resource from "../../assets/Game/menu/resource.png";
import food from "../../assets/Game/menu/food.png";
import military from "../../assets/Game/menu/military.png";
import house from "../../assets/Game/menu/house.png";

import resource_selected from "../../assets/Game/menu/resource_selected.png";
import food_selected from "../../assets/Game/menu/food_selected.png";
import military_selected from "../../assets/Game/menu/military_selected.png";
import house_selected from "../../assets/Game/menu/house_selected.png";

import storage from "../../assets/Game/menu/storage.png";
import storage_selected from "../../assets/Game/menu/storage_selected.png";
import population from "../../assets/Game/menu/population.png";
import population_selected from "../../assets/Game/menu/population_selected.png";

type GameMenuAssetsType = {
  [key: string]: string;
  resource: string;
  food: string;
  military: string;
  house: string;
  storage: string;
  population: string;

  resource_selected: string;
  food_selected: string;
  military_selected: string;
  house_selected: string;
  storage_selected: string;
  population_selected: string;
};

export const gameMenuAssets: GameMenuAssetsType = {
  resource,
  food,
  military,
  house,
  storage,
  population,

  resource_selected,
  food_selected,
  military_selected,
  house_selected,
  storage_selected,
  population_selected,
};
