import init from "@/init";
import { GameStateManager } from "@/manager/gameStateManager";
import { Program } from "@/program";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";

const main = async () => {
  init();

  const images = await ServerHandler.receiveAsyncMessage("start:page");
  GameStateManager.setImages(images);
  console.log(GameStateManager.getImages());

  const program: Program = new Program();

  const perfectFrameTime: number = 1000;
  let lastFrameTime: number = performance.now();

  const next = (currentTime = performance.now()) => {
    const dt: number = (currentTime - lastFrameTime) / perfectFrameTime;
    lastFrameTime = currentTime;

    program.draw();
    program.update(dt);

    setTimeout(
      () => requestAnimationFrame(next),
      perfectFrameTime / settings.fps
    );
  };

  next();
};

await main();
