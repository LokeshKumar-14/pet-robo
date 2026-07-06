import { Maximize, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, MetricCard } from "@/components/ui/Card";
import { RadarRenderer } from "@/services/RadarRenderer";
import { useRobotStore } from "@/store/robotStore";

export function RadarPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<RadarRenderer | null>(null);
  const readings = useRobotStore((state) => state.lidar);
  const [fps, setFps] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new RadarRenderer(canvasRef.current);
    rendererRef.current = renderer;
    renderer.start(setFps);
    return () => renderer.stop();
  }, []);

  useEffect(() => {
    rendererRef.current?.setReadings(readings);
  }, [readings]);

  useEffect(() => {
    rendererRef.current?.setZoom(zoom);
  }, [zoom]);

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan/70">Lidar Radar</p>
          <h1 className="mt-1 text-4xl font-bold md:text-6xl">Live Scan</h1>
        </div>
        <MetricCard label="FPS" value={`${fps}`} />
      </div>

      <Card className="overflow-hidden p-3">
        <canvas ref={canvasRef} className="h-[58dvh] min-h-[360px] w-full rounded-lg bg-black/30" />
      </Card>

      <Card className="flex flex-wrap items-center gap-3 p-4">
        <Button size="icon" title="Reset zoom" onClick={() => setZoom(1)}><RotateCcw size={18} /></Button>
        <Maximize className="text-white/45" size={18} />
        <input className="h-2 min-w-48 flex-1 accent-cyan" type="range" min="0.5" max="2.4" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
        <span className="text-sm text-white/60">{zoom.toFixed(1)}x</span>
      </Card>
    </section>
  );
}
