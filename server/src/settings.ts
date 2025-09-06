export const SERVER_URL = "http://localhost:3000";
// export const SERVER_URL = "http://192.168.1.70:3000";

export const MAX_PLAYER = 4;
export const CONNECTION_CODE_LENGTH = 2;

export const MAP_SEED = "seed";
export const MAP_SIZE = 80;
export const TREE_SPAWN_CHANCE = 10;
export const ROCK_SPAWN_CHANCE = 93;

const START_POS = 10;
export const START_POSITIONS = [
  { i: START_POS, j: START_POS },
  { i: MAP_SIZE - 1 - START_POS, j: START_POS },
  { i: START_POS, j: MAP_SIZE - 1 - START_POS },
  { i: MAP_SIZE - 1 - START_POS, j: MAP_SIZE - 1 - START_POS },
];
