import type { LidarReading } from "@/types/robot";

export class RadarRenderer {
  private ctx: CanvasRenderingContext2D;
  private animation?: number;
  private sweep = 0;
  private lastFrame = performance.now();
  private fps = 0;
  private zoom = 1;
  private readings: LidarReading[] = [];
  private onFps?: (fps: number) => void;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not supported.");
    this.ctx = context;
  }

  setReadings(readings: LidarReading[]) {
    this.readings = readings;
  }

  setZoom(zoom: number) {
    this.zoom = zoom;
  }

  start(onFps?: (fps: number) => void) {
    this.onFps = onFps;
    const draw = () => {
      this.render();
      this.animation = requestAnimationFrame(draw);
    };
    draw();
  }

  stop() {
    if (this.animation) cancelAnimationFrame(this.animation);
  }

  private render() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (this.canvas.width !== rect.width * dpr || this.canvas.height !== rect.height * dpr) {
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
    }

    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height * 0.92;
    const radius = Math.min(width * 0.46, height * 0.82);
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(167,255,104,0.22)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, (radius * i) / 4, Math.PI, Math.PI * 2);
      ctx.stroke();
    }
    for (let angle = 0; angle <= 180; angle += 30) {
      const rad = (Math.PI * angle) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - Math.cos(rad) * radius, cy - Math.sin(rad) * radius);
      ctx.stroke();
    }

    this.sweep = (this.sweep + 0.9) % 181;
    const sweepRad = (Math.PI * this.sweep) / 180;
    const gradient = ctx.createLinearGradient(cx, cy, cx - Math.cos(sweepRad) * radius, cy - Math.sin(sweepRad) * radius);
    gradient.addColorStop(0, "rgba(104,232,255,0.62)");
    gradient.addColorStop(1, "rgba(104,232,255,0)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - Math.cos(sweepRad) * radius, cy - Math.sin(sweepRad) * radius);
    ctx.stroke();

    const now = Date.now();
    this.readings.forEach((reading) => {
      const distanceRatio = Math.min(1, (reading.distance * this.zoom) / 200);
      const rad = (Math.PI * reading.angle) / 180;
      const x = cx - Math.cos(rad) * radius * distanceRatio;
      const y = cy - Math.sin(rad) * radius * distanceRatio;
      const age = Math.min(1, (now - reading.timestamp) / 5000);
      ctx.fillStyle = `rgba(255,255,255,${1 - age * 0.65})`;
      ctx.beginPath();
      ctx.arc(x, y, 3.5 + (1 - age) * 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 18);
    ctx.lineTo(cx - 14, cy + 12);
    ctx.lineTo(cx + 14, cy + 12);
    ctx.closePath();
    ctx.fill();

    const delta = performance.now() - this.lastFrame;
    this.lastFrame = performance.now();
    this.fps = Math.round(1000 / Math.max(1, delta));
    this.onFps?.(this.fps);
  }
}
