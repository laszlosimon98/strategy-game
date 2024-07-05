import { Socket, io } from "socket.io-client";
import { Game } from "./game";

const socket: Socket = io("http://localhost:3000");
const game = new Game(600, 600, socket);

const fps: number = 10;
const perfectFrameTime: number = 1000;
let lastFrameTime = performance.now();

function next(currentTime = performance.now()) {
  const deltaTime = (currentTime - lastFrameTime) / perfectFrameTime;
  lastFrameTime = currentTime;

  game.draw();
  game.update();

  setTimeout(() => requestAnimationFrame(next), perfectFrameTime / fps);
}

next();
