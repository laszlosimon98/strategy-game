export type PropertyType = {
  damage: number;
  health: number;
  range: number;
};
export type UnitsType = {
  [name: string]: PropertyType;
};

export const units: UnitsType = {
  knight: {
    damage: 13,
    health: 100,
    range: 1,
  },
  archer: {
    damage: 9,
    health: 100,
    range: 5,
  },
};
