type UnitsType = {
  [name: string]: {
    damage: number;
    health: number;
    range: number;
  };
};

export const units: UnitsType = {
  knight: {
    damage: 10,
    health: 100,
    range: 1,
  },
  archer: {
    damage: 6,
    health: 85,
    range: 5,
  },
};
