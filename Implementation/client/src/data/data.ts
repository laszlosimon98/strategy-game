type availableLanguages = "hu" | "en";

type DataType = {
  [language in availableLanguages]: {
    [name: string]: string;
  };
};
export const data: DataType = {
  hu: {
    menu: "Menü",
    newGame: "Új Játék",
    statistic: "Statisztika",
    description: "Leírás",
    registration: "Regisztráció",
    login: "Bejelentkezés",
    back: "Vissza",
    create: "Létrehozás",
    lobby: "Váró",
    join: "Csatlakozás",
    start: "Indítás",
    empty: "",
  },
  en: {
    menu: "Menu",
    newGame: "New Game",
    statistic: "Statistics",
    description: "Description",
    registration: "Registration",
    login: "Login",
    back: "Back",
    create: "Create",
    lobby: "Lobby",
    join: "Join",
    start: "Start",
  },
};
