export type PlayerType = {
  playerId: string;
  name: string;
};

export type TeamType = {
  players: PlayerType[];
};

export type initialStateType = {
  [code: string]: TeamType;
};
