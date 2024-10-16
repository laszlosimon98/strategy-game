export type BuildingType = {
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
};

export type SelectedBuildingType = {
  data: BuildingType;
};
