import { authApi, userApi } from "@/api/api";
import init from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Program } from "@/program";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";

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

const checkUser = async () => {
  try {
    const response = await authApi.post("/refresh");

    if (response.data) {
      StateManager.setAccessToken(response.data.accessToken);
    }
  } catch (err) {}

  try {
    const user = await userApi.get("/getUser", {
      headers: {
        Authorization: `Bearer ${StateManager.getAccessToken()}`,
      },
    });

    if (user.data) {
      StateManager.setPlayerName(user.data.username);
    }
  } catch (err) {}
};

const main = async () => {
  init();
  await checkUser();

  await initImages();
  await initBuildingPrices();

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
