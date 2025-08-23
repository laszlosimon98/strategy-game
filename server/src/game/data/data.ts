import { ColorType, InitialStateType, UnitsType } from '@/src/game/types/types';

export const colors: ColorType[] = [
  'black',
  'blue',
  'brown',
  'green',
  'orange',
  'purple',
  'red',
  'white',
];

export const state: InitialStateType = {};

export const units: UnitsType = {
  archer: {
    damage: 15,
    health: 80,
    range: 3,
  },
  knight: {
    damage: 30,
    health: 150,
    range: 1,
  },
};
