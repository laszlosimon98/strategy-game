import init from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Program } from "@/program";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";

const main = async () => {
  init();

  const images = await ServerHandler.receiveAsyncMessage("start:page");
  const buildingPrices = await ServerHandler.receiveAsyncMessage(
    "start:prices"
  );
  console.log(images);
  console.log(buildingPrices);

  StateManager.setImages(images);
  StateManager.setBuildingPrices(buildingPrices);
  console.log(StateManager.getImages());
  console.log(StateManager.getBuildingPrices());

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
