export type SelectedBuildingType = {
  data: {
    url: string;
    dimension: {
      width: number;
      height: number;
    };
  };
};

export const selectedBuilding: SelectedBuildingType = {
  data: {
    url: "",
    dimension: {
      width: 0,
      height: 0,
    },
  },
};
