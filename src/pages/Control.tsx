import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Crosshair, Hand, Octagon, RotateCcw, Shield, Smile, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CommandButton } from "@/components/robot/CommandButton";
import { useRobotSocket } from "@/hooks/useRobotSocket";

export function Control() {
  const { send } = useRobotSocket();

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan/70">Manual Control</p>
        <h1 className="mt-1 text-4xl font-bold md:text-6xl">Drive Buddy</h1>
      </div>

      <Card className="mx-auto max-w-md p-5">
        <div className="grid grid-cols-3 gap-3">
          <span />
          <Button size="lg" onClick={() => send({ cmd: "walk" })} title="Forward"><ArrowUp /></Button>
          <span />
          <Button size="lg" onClick={() => send({ cmd: "left" })} title="Left"><ArrowLeft /></Button>
          <Button variant="danger" size="lg" onClick={() => send({ cmd: "stop" })} title="Stop"><Square /></Button>
          <Button size="lg" onClick={() => send({ cmd: "right" })} title="Right"><ArrowRight /></Button>
          <span />
          <Button size="lg" onClick={() => send({ cmd: "back" })} title="Back"><ArrowDown /></Button>
          <span />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <CommandButton icon={<Shield size={18} />} label="Stand" command={{ cmd: "stand" }} send={send} />
        <CommandButton icon={<Smile size={18} />} label="Sit" command={{ cmd: "sit" }} send={send} />
        <CommandButton icon={<ArrowUp size={18} />} label="Walk" command={{ cmd: "walk" }} send={send} />
        <CommandButton icon={<ArrowDown size={18} />} label="Back" command={{ cmd: "back" }} send={send} />
        <CommandButton icon={<ArrowLeft size={18} />} label="Left" command={{ cmd: "left" }} send={send} />
        <CommandButton icon={<ArrowRight size={18} />} label="Right" command={{ cmd: "right" }} send={send} />
        <CommandButton icon={<Hand size={18} />} label="Punch" command={{ cmd: "punch" }} send={send} />
        <CommandButton icon={<Square size={18} />} label="Stop" command={{ cmd: "stop" }} send={send} />
        <CommandButton icon={<Octagon size={18} />} label="Emergency" command={{ cmd: "estop" }} send={send} danger />
        <CommandButton icon={<RotateCcw size={18} />} label="Head Left" command={{ cmd: "head", angle: 35 }} send={send} />
        <CommandButton icon={<Crosshair size={18} />} label="Head Center" command={{ cmd: "head", angle: 90 }} send={send} />
        <CommandButton icon={<RotateCcw size={18} />} label="Head Right" command={{ cmd: "head", angle: 145 }} send={send} />
      </div>
    </section>
  );
}
