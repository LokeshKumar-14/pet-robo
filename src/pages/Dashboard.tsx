import { Bot, Hand, Radio, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Card, MetricCard } from "@/components/ui/Card";
import { CommandButton } from "@/components/robot/CommandButton";
import { RobotAvatar } from "@/components/robot/RobotAvatar";
import { useRobotSocket } from "@/hooks/useRobotSocket";
import { useRobotStore } from "@/store/robotStore";

export function Dashboard() {
  const { send } = useRobotSocket();
  const { status, robotName, connection, latency, queuedCommands, latestVoiceCommand, latestAiResponse } = useRobotStore();
  const connected = connection === "connected";

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan/70">Robot Brain</p>
          <h1 className="mt-1 text-4xl font-bold md:text-6xl">{robotName}</h1>
        </div>
        <div className={`rounded-full px-3 py-2 text-xs font-bold ${connected ? "bg-lime/15 text-lime" : "bg-danger/15 text-danger"}`}>
          {connection}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden p-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <RobotAvatar />
            <div className="w-full space-y-4">
              <div>
                <p className="text-sm text-white/52">Current Action</p>
                <p className="text-3xl font-bold capitalize text-white">{status.action || "idle"}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MetricCard label="Battery" value={status.battery ? `${status.battery.toFixed(2)}V` : "--"} tone="lime" />
                <MetricCard label="WiFi RSSI" value={`${status.wifi} dBm`} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="WS" value={connected ? "Live" : "Down"} tone={connected ? "lime" : "danger"} />
            <MetricCard label="Latency" value={latency ? `${latency} ms` : "--"} />
            <MetricCard label="Touch" value={status.touch ? "Active" : "Clear"} tone={status.touch ? "lime" : "white"} />
            <MetricCard label="Queued" value={`${queuedCommands}`} />
          </div>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Head Angle" value={`${status.head}°`} />
        <MetricCard label="Punch Angle" value={`${status.punch}°`} />
        <MetricCard label="Leg Servos" value={status.legs.join(" / ")} />
        <MetricCard label="Lidar" value={status.lidar?.length ? `${status.lidar.length} rays` : "Streaming"} />
      </div>

      <Card className="p-4">
        <p className="mb-3 text-sm font-semibold text-white/70">Quick Actions</p>
        <div className="grid grid-cols-5 gap-2">
          <CommandButton icon={<Bot size={18} />} label="Stand" command={{ cmd: "stand" }} send={send} />
          <CommandButton icon={<ShieldCheck size={18} />} label="Sit" command={{ cmd: "sit" }} send={send} />
          <CommandButton icon={<Zap size={18} />} label="Walk" command={{ cmd: "walk" }} send={send} />
          <CommandButton icon={<Radio size={18} />} label="Stop" command={{ cmd: "stop" }} send={send} />
          <CommandButton icon={<Hand size={18} />} label="Punch" command={{ cmd: "punch" }} send={send} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div animate={{ opacity: latestVoiceCommand ? 1 : 0.58 }}>
          <Card className="min-h-28 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">Latest Voice Command</p>
            <p className="mt-3 text-lg text-white">{latestVoiceCommand || "Waiting for mic input"}</p>
          </Card>
        </motion.div>
        <Card className="min-h-28 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-white/40">Latest AI Response</p>
          <p className="mt-3 text-lg text-cyan">{latestAiResponse || "Buddy is listening"}</p>
        </Card>
      </div>
    </section>
  );
}
