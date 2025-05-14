import { state } from "./data/state";
import init from "./init";
import { Program } from "./program";
import { ServerHandler } from "./server/serverHandler";
import { FPS } from "./settings";

const main = async () => {
  init();

  state.images = await ServerHandler.receiveAsyncMessage("start:page");
  console.log(state.images);

  const program: Program = new Program();

  const perfectFrameTime: number = 1000;
  let lastFrameTime: number = performance.now();

  const next = (currentTime = performance.now()) => {
    const dt: number = (currentTime - lastFrameTime) / perfectFrameTime;
    lastFrameTime = currentTime;

    program.draw();
    program.update(dt);

    setTimeout(() => requestAnimationFrame(next), perfectFrameTime / FPS);
  };

  next();
};

main();
