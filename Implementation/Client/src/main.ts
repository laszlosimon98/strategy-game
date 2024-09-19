import init from "./init";
import { Program } from "./program";
import { FPS } from "./settings";

const main = () => {
  init();

  const program: Program = new Program(new AbortController());

  const fps: number = FPS;
  const perfectFrameTime: number = 1000;
  let lastFrameTime: number = performance.now();

  const next = (currentTime = performance.now()) => {
    const dt: number = (currentTime - lastFrameTime) / perfectFrameTime;
    lastFrameTime = currentTime;

    program.draw();
    program.update(dt);

    setTimeout(() => requestAnimationFrame(next), perfectFrameTime / fps);
  };

  next();
};

main();
