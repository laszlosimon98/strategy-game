import Game from "./game/game";
import init from "./init";
import { FPS } from "./settings";

const main = () => {
  init();

  const game = new Game();

  const fps: number = FPS;
  const perfectFrameTime: number = 1000;
  let lastFrameTime = performance.now();

  const next = (currentTime = performance.now()) => {
    const dt: number = (currentTime - lastFrameTime) / perfectFrameTime;
    lastFrameTime = currentTime;

    game.draw();
    game.update(dt);

    setTimeout(() => requestAnimationFrame(next), perfectFrameTime / fps);
  };

  next();
};

main();
