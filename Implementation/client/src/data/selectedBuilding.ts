export type SelectedBuildingType = {
  data: {
    url: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
};

export const initState: SelectedBuildingType = {
  data: {
    url: "",
    dimensions: {
      width: 0,
      height: 0,
    },
  },
};

export const selectedBuilding: SelectedBuildingType = { ...initState };
