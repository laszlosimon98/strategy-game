import { images } from "./data/images";
import init from "./init";
import { Program } from "./program";
import { ServerHandler } from "./server/serverHandler";
import { FPS } from "./settings";

const main = async () => {
  init();

  const gameImages = await ServerHandler.receiveAsyncMessage("start:page");
  images.page = await gameImages.pages;
  images.game = await gameImages.game;

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

await main();
