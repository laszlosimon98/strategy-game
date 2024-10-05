import grass from "../../assets/Game/ground/grass.png";
import flower from "../../assets/Game/ground/grass_flower.png";
import rock from "../../assets/Game/ground/grass_rock.png";

type GroundAssetsType = {
  [key: string]: string;
  grass: string;
  flower: string;
  rock: string;
};

export const groundAssets: GroundAssetsType = {
  grass,
  flower,
  rock,
};
