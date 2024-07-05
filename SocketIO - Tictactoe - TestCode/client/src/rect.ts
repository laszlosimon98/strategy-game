type mouseType = {
  x: number;
  y: number;
};

export class Rect {
  private x: number;
  private y: number;
  private w: number;
  private h: number;
  private text?: string;

  constructor(x: number, y: number, w: number, h: number, text?: string) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    if (this.text) {
      ctx.font = "32px serif";

      ctx.fillText(
        this.text,
        this.x + this.w / 2 - ctx.measureText(this.text).width / 2,
        this.y + this.h / 2 + 8
      );
    }
  };

  collide = (mousePos: mouseType) => {
    const { x, y } = mousePos;

    return (
      x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
    );
  };
}
