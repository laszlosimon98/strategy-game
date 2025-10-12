import init from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Program } from "@/program";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";

let rafId: number | null = null;
let lastFrameTime: number = performance.now();
const frameDuration = 1000 / settings.fps;

const initImages = async () => {
  ServerHandler.sendMessage("start:page", {});
  const images = await ServerHandler.receiveAsyncMessage("start:page");
  StateManager.setImages(images);
  console.log(StateManager.getImages());
};

const initBuildingPrices = async () => {
  ServerHandler.sendMessage("start:prices", {});
  const buildingPrices = await ServerHandler.receiveAsyncMessage(
    "start:prices"
  );

  StateManager.setBuildingPrices(buildingPrices);
  console.log(StateManager.getBuildingPrices());
};

init();

await initImages();
await initBuildingPrices();

const program: Program = new Program();

const loop = (currentTime: number) => {
  const delta = currentTime - lastFrameTime;

  if (delta >= frameDuration) {
    const dt = delta / 1000;
    lastFrameTime = currentTime;

    program.update(dt);
    program.draw();
  }

  rafId = requestAnimationFrame(loop);
};

const stop = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;

    program.destory();
  }
};

const main = async () => {
  if (rafId === null) {
    lastFrameTime = performance.now();
    rafId = requestAnimationFrame(loop);
  }
};

window.addEventListener("unload", stop);

main();
