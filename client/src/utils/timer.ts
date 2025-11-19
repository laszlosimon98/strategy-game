export class Timer {
  private duration: number;
  private func: Function | undefined;
  private startTime: number;
  private isActive: boolean;

  constructor(duration: number, func?: Function) {
    this.duration = duration;
    this.func = func;
    this.startTime = 0;
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
    this.startTime = performance.now();
  }

  public update(): void {
    const currentTime = performance.now();
    if (currentTime - this.startTime >= this.duration) {
      this.deactivate();
      if (this.func) {
        this.func();
      }
    }
  }

  public isTimerActive(): boolean {
    return this.isActive;
  }

  public deactivate(): void {
    this.isActive = false;
    this.startTime = 0;
  }
}
