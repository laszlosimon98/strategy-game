export type PropertyType = {
  damage: number;
  health: number;
  range: number;
};
export type UnitsType = {
  [name: string]: PropertyType;
};
