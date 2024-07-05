const canvas: HTMLCanvasElement = document.createElement("canvas");
export const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d"
) as CanvasRenderingContext2D;

const init = () => {
  const updateCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.scrollTop = 0;
    document.body.style.overflow = "hidden";
  };

  updateCanvasSize();

  document.body.appendChild(canvas);

  window.addEventListener(
    "resize",
    _.throttle(() => {
      updateCanvasSize();
    }, 1000)
  );
};

export default init;
