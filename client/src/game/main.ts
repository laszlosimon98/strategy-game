import { Program } from "@/game/program";
import { FPS } from "@/game/settings";

export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;

const main = (_canvas: HTMLCanvasElement) => {
  canvas = _canvas;
  const context = canvas.getContext("2d");

  if (context) {
    ctx = context;
  } else {
    console.error("Canvas context is null!");
    return;
  }

  const program: Program = new Program();

  const perfectFrameTime: number = 1000;
  let lastFrameTime: number = performance.now();
  let animationId: ReturnType<typeof setTimeout>;

  const next = (currentTime = performance.now()) => {
    const dt: number = (currentTime - lastFrameTime) / perfectFrameTime;
    lastFrameTime = currentTime;

    program.draw();
    program.update(dt);

    animationId = setTimeout(
      () => requestAnimationFrame(next),
      perfectFrameTime / FPS
    );
  };

  next();

  return () => {
    if (animationId) {
      clearTimeout(animationId);
    }
    program.cleanUp();
  };
};

export default main;
