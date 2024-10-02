import resource from "../../assets/Game/menuAssets/resource.png";
import food from "../../assets/Game/menuAssets/food.png";
import military from "../../assets/Game/menuAssets/military.png";
import house from "../../assets/Game/menuAssets/house.png";

import resource_selected from "../../assets/Game/menuAssets/resource_selected.png";
import food_selected from "../../assets/Game/menuAssets/food_selected.png";
import military_selected from "../../assets/Game/menuAssets/military_selected.png";
import house_selected from "../../assets/Game/menuAssets/house_selected.png";

import storage from "../../assets/Game/menuAssets/storage.png";
import storage_selected from "../../assets/Game/menuAssets/storage_selected.png";
import population from "../../assets/Game/menuAssets/population.png";
import population_selected from "../../assets/Game/menuAssets/population_selected.png";

type gameMenuAssetsType = {
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

export const gameMenuAssets: gameMenuAssetsType = {
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
