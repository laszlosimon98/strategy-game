export type AssetType = {
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
};

export type BuildingType = {
  building?: AssetType;
  owner?: string;
};
