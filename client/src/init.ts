export const canvas: HTMLCanvasElement = document.createElement("canvas");
export const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d"
) as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export let canvasWidth = canvas.width;
export let canvasHeight = canvas.height;

/**
 * HTML Canvas inicializáló függvény
 */
const init = () => {
  const updateCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    document.body.scrollTop = 0;
    document.body.style.overflow = "hidden";
    ctx.font = "28px Arial";
  };

  updateCanvasSize();

  document.body.appendChild(canvas);

  window.addEventListener("resize", () => {
    updateCanvasSize();
  });
};

export default init;
