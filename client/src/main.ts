import { authApi, userApi } from "@/api/api";
import init from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Program } from "@/program";
import { CommunicationHandler } from "@/communication/communicationHandler";
import { settings } from "@/settings";

/**
 * Kép betöltő
 */
const initImages = async () => {
  CommunicationHandler.sendMessage("start:page", {});
  const images = await CommunicationHandler.receiveAsyncMessage("start:page");
  StateManager.setImages(images);
};

/**
 * Épület költség betöltő
 */
const initBuildingPrices = async () => {
  CommunicationHandler.sendMessage("start:prices", {});
  const buildingPrices = await CommunicationHandler.receiveAsyncMessage(
    "start:prices"
  );

  StateManager.setBuildingPrices(buildingPrices);
};

/**
 * Ellenőrzi, hogy van-e bejelentkezett felhasználó
 * @returns
 */
const checkUser = async () => {
  try {
    const check = await authApi.post("/check");

    if (!check.data.success) {
      return;
    }

    const response = await authApi.post("/refresh");

    if (response.data) {
      StateManager.setAccessToken(response.data.accessToken);
    }

    const user = await userApi.get("/get-user", {
      headers: {
        Authorization: `Bearer ${StateManager.getAccessToken()}`,
      },
    });

    if (user.data) {
      StateManager.setPlayerName(user.data.username);
    }
  } catch (err) {}
};

/**
 * Program belépési pontja.
 * Inicializálás, képek és épület költségek betöltése.
 * Game loop
 */
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
