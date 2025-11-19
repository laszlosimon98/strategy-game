import { settings } from "@/settings";

export const gameLoop = (
  fn: (dt: number, interval: NodeJS.Timeout) => void
): void => {
  let lastTime = Date.now();
  const tickRate = 1000 / settings.fps;

  const interval = setInterval(() => {
    const now = Date.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    fn(dt, interval);
  }, tickRate);
};
