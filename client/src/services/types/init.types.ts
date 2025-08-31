export type UserType = {
  name: string;
  host: boolean;
  code: string;
};

export type LobbyType = {
  players: string[];
  info: {
    message: string;
    type: "connect" | "leave";
  };
};

export type ImageType = {
  buildings: any;
  ui: any;
  colors: any;
  ground: any;
  obstacles: any;
};
