import { Building } from '@/src/game/classes/building';
import { Cell } from '@/src/game/classes/cell';
import { Dimension } from '@/src/game/classes/dimension';
import { Indices } from '@/src/game/classes/indices';
import { Unit } from '@/src/game/classes/unit';

export type ColorType =
  | 'black'
  | 'blue'
  | 'brown'
  | 'green'
  | 'orange'
  | 'purple'
  | 'red'
  | 'white';

export type TileType = 'grass' | 'grass_flower' | 'grass_rock' | 'dirt';

export type Position = {
  x: number;
  y: number;
};

export type EntityType = {
  data: {
    id: string;
    owner: string;
    url: string;
    indices: Indices;
    dimensions: Dimension;
    position: Position;
  };
};

export type PlayerType = {
  [id: string]: {
    name: string;
    color: ColorType;
    buildings: Building[];
    units: Unit[];
  };
};

export type TeamType = {
  isGameStarted: boolean;
  players: PlayerType;
  world: Cell[][];
  remainingColors: ColorType[];
};

export type InitialStateType = {
  [code: string]: TeamType;
};

export type PropertyType = {
  damage: number;
  health: number;
  range: number;
};

export type UnitsType = {
  [name in 'archer' | 'knight']: PropertyType;
};
