import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, MetricCard } from "@/components/ui/Card";
import { useRobotStore } from "@/store/robotStore";

export function Sensors() {
  const { status, sensorHistory } = useRobotStore();

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan/70">Telemetry</p>
        <h1 className="mt-1 text-4xl font-bold md:text-6xl">Sensors</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Touch Sensor" value={status.touch ? "Touched" : "Clear"} tone={status.touch ? "lime" : "white"} />
        <MetricCard label="Walking State" value={status.action || "idle"} />
        <MetricCard label="Battery" value={status.battery ? `${status.battery.toFixed(2)}V` : "--"} tone="lime" />
        <MetricCard label="RSSI" value={`${status.wifi} dBm`} />
        <MetricCard label="Head Servo" value={`${status.head}°`} />
        <MetricCard label="Punch Servo" value={`${status.punch}°`} />
        <MetricCard label="Leg Servos" value={status.legs.join(" / ")} />
        <MetricCard label="Current Motion" value={status.action || "idle"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-72 p-4">
          <p className="mb-4 text-sm font-semibold text-white/70">Battery and WiFi</p>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={sensorHistory}>
              <defs>
                <linearGradient id="battery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a7ff68" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#a7ff68" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="time" hide />
              <YAxis stroke="rgba(255,255,255,0.4)" />
              <Tooltip contentStyle={{ background: "#091014", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="battery" stroke="#a7ff68" fill="url(#battery)" />
              <Line type="monotone" dataKey="wifi" stroke="#68e8ff" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-72 p-4">
          <p className="mb-4 text-sm font-semibold text-white/70">Servo Angles</p>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={sensorHistory}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="time" hide />
              <YAxis stroke="rgba(255,255,255,0.4)" domain={[0, 180]} />
              <Tooltip contentStyle={{ background: "#091014", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="head" stroke="#68e8ff" dot={false} />
              <Line type="monotone" dataKey="punch" stroke="#ff4d6d" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </section>
  );
}
