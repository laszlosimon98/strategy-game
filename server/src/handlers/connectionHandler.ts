import { Server, Socket } from "socket.io";

import { CONNECTION_CODE_LENGTH, MAX_PLAYER } from "../settings";
import { Communicate } from "../classes/communicate";
import { state } from "../data/state";
import { ColorType } from "../types/types";

const colors: ColorType[] = [
  "black",
  "blue",
  "brown",
  "green",
  "orange",
  "purple",
  "red",
  "white",
];

export const connectionHandler = (io: Server, socket: Socket) => {
  /**
   * @param {number} codeLength A számsorozat hossza
   * @returns Visszatér egy 0-9 közötti véletlen számsorozattal
   */
  const generateCode = (codeLength: number): string => {
    let result = "";
    for (let i = 0; i < codeLength; ++i) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  /**
   * Ha kiválasztott egy színt, akkor azt törli a tömből
   * @param {string[]} colors Egy színeket tartalmazó tömb
   * @returns Visszatér egy véletlenül kiválasztott színnel
   */
  const chooseColor = (colors: ColorType[]): ColorType => {
    const randomNumber = Math.floor(Math.random() * colors.length);

    const playerColor = colors[randomNumber];
    colors.splice(randomNumber, 1);
    return playerColor;
  };

  /**
   *
   * @param {string} code A szoba kódja
   * @returns Ellenőrzi, hogy létezik-e a szoba
   */
  const isRoomExists = (code: string): boolean => {
    return io.sockets.adapter.rooms.has(code);
  };

  /**
   *
   * @param {string} code A szoba kódja
   * @returns Visszatér a szoba méretével
   */
  const getRoomSize = (code: string): number => {
    return io.sockets.adapter.rooms.get(code)?.size ?? 0;
  };

  /**
   *
   * @param {string} code A szoba kódja
   * @returns Ellenőrzi, hogy elkezdődött-e a játék
   */
  const isGameStarted = (code: string): boolean => {
    return state[code].isGameStarted;
  };

  // Létrehoz egy állapotot a generált kóddal
  /**
   * Létrehoz egy új játékot a generált kóddal, beállítja a kezdeti állapotot
   * Hozzáadja a játékost a játékszobához, amit a generált kód határoz meg
   * Elküldi a kliensnek a generált kódot és egy csatlakozott játékos üzenetet
   * @param param0 A játékos neve
   */
  const createGame = ({ name }: { name: string }) => {
    const code = generateCode(CONNECTION_CODE_LENGTH);

    state[code] = {
      isGameStarted: false,
      players: {},
      world: [],
      remainingColors: [...colors],
    };

    state[code].players[socket.id] = {
      name,
      color: chooseColor(state[code].remainingColors),
      buildings: [],
      units: [],
    };

    socket.join(code);
    Communicate.sendMessageToSender(socket, "connect:code", { code });
    newPlayerMessage(code, name);
  };

  /**
   * Kliensről kapott kódot kapunk
   * Először ellenőrzi, hogy valid-e, vagyis létezik-e a kódhoz szoba, ha nem hibaüzenetet küld
   * Másodszor megnézi, hogy van-e még hely a szobába, ha nincs akkor szintén hibaüzenetet
   * Végül azt is meg kell nézni, hogy elkezdődött-e már a játék, ha igen hibaüzenet
   * Ha nincs hibaüzenet, akkor iniciálizálja az új játékost és hozzáadja a szobához
   * Erről tájékoztatja a csatlakoztatott játékosokat
   * @param param0 Egy kód és játékos név
   * @returns
   */
  const joinGame = ({ code, name }: { code: string; name: string }) => {
    if (!isRoomExists(code)) {
      Communicate.sendMessageToSender(
        socket,
        "connect:error",
        "Rossz csatlakozási kód!"
      );
      return;
    }

    if (getRoomSize(code) >= MAX_PLAYER) {
      Communicate.sendMessageToSender(
        socket,
        "connect:error",
        "A váró megtelt!"
      );
      return;
    }

    if (isGameStarted(code)) {
      Communicate.sendMessageToSender(
        socket,
        "connect:error",
        "A játék elkezdődött!"
      );
      return;
    }

    state[code].players[socket.id] = {
      name,
      color: chooseColor(state[code].remainingColors),
      buildings: [],
      units: [],
    };

    socket.join(code);

    Communicate.sendMessageToSender(socket, "connect:error", "");
    Communicate.sendMessageToSender(socket, "connect:code", { code });
    newPlayerMessage(code, name);
  };

  /**
   * Törli a játékost a szobából és a játékos színét újra ki lehet választani
   * Erről tájékoztatja a csatlakozott játékosokat
   */
  const disconnect = () => {
    const currentRoom = Communicate.getCurrentRoom(socket);

    if (currentRoom) {
      const user = state[currentRoom].players[socket.id];
      state[currentRoom].remainingColors.push(user.color);
      playerleftMessage(user.name);
      delete state[currentRoom].players[socket.id];
    }
    socket.leave(currentRoom);
  };

  /**
   * Üzenetet küld minden csatlakozott játékosnak, aki a kapott kóddal megegyező szobában van
   * @param {string} code játék kódja
   * @param {string} name játékos neve
   */
  const newPlayerMessage = (code: string, name: string) => {
    const names = getPlayerNames(code);
    Communicate.sendMessageToEveryOne(io, socket, "connect:newPlayer", {
      players: names,
      message: `${name} csatlakozott a váróhoz!`,
    });
  };

  /**
   *
   * @param {string} name játékos neve
   */
  const playerleftMessage = (name: string) => {
    Communicate.sendMessageToEveryOne(io, socket, "connect:playerLeft", {
      name,
      message: `${name} elhagyta a várót!`,
    });
  };

  /**
   *
   * @param {string} code játék kódja
   * @returns Visszatér egy a játékosok neveit tartalmazó tömbbel
   */
  const getPlayerNames = (code: string): string[] => {
    const result: string[] = [];
    Object.keys(state[code].players).forEach((id) => {
      result.push(state[code].players[id].name);
    });

    return result;
  };

  socket.on("connect:create", createGame);
  socket.on("connect:join", joinGame);
  socket.on("connect:disconnect", disconnect);
  socket.on("disconnecting", disconnect);
};
