export class Timer {
  private duration: number;
  private func?: () => void;
  private startTime: number;
  private isActive: boolean;

  constructor(duration: number, func?: () => void) {
    this.duration = duration;
    this.func = func;
    this.startTime = 0;
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
    this.startTime = performance.now();
  }

  private deactivate(): void {
    this.isActive = false;
    this.startTime = 0;
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
}
