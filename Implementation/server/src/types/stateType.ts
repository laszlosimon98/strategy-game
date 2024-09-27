export type PlayerType = {
  playerId: string;
  name: string;
};

export type TeamType = {
  players: PlayerType[];
};

export type initialStateType = {
  data: {
    [code: string]: TeamType;
  };
};
