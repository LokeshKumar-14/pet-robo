import { Brain, Mic, MicOff, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRobotSocket } from "@/hooks/useRobotSocket";
import { useVoicePipeline } from "@/hooks/useVoicePipeline";
import { useRobotStore } from "@/store/robotStore";

export function AIPage() {
  const { send } = useRobotSocket();
  const voice = useVoicePipeline(send);
  const latestVoiceCommand = useRobotStore((state) => state.latestVoiceCommand);
  const latestAiResponse = useRobotStore((state) => state.latestAiResponse);

  return (
    <section className="flex min-h-[calc(100dvh-7rem)] flex-col justify-center space-y-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan/70">Buddy AI</p>
        <h1 className="mt-2 text-4xl font-bold md:text-6xl">Talk to Robot</h1>
      </div>

      <div className="flex justify-center">
        <motion.button
          type="button"
          onPointerDown={voice.start}
          onPointerUp={voice.stop}
          onPointerCancel={voice.stop}
          disabled={voice.busy}
          className="relative grid h-48 w-48 place-items-center rounded-full border border-cyan/35 bg-cyan/10 shadow-glow disabled:opacity-60"
          animate={voice.recording ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ repeat: voice.recording ? Infinity : 0, duration: 1.1 }}
        >
          <span className="absolute inset-4 rounded-full border border-white/10" />
          <span className="absolute inset-0 rounded-full bg-cyan/10 blur-2xl" />
          {voice.recording ? <MicOff size={56} className="text-danger" /> : <Mic size={62} className="text-cyan" />}
        </motion.button>
      </div>

      <div className="mx-auto grid w-full max-w-3xl gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 text-white/60">
            <Waves size={18} />
            <span className="text-sm font-semibold capitalize">{voice.state}</span>
          </div>
          {voice.busy && <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full w-1/3 bg-cyan" animate={{ x: ["-100%", "320%"] }} transition={{ repeat: Infinity, duration: 1.15 }} /></div>}
          {voice.error && <p className="mt-4 rounded-lg bg-danger/12 p-3 text-sm text-danger">{voice.error}</p>}
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/40">Transcript</p>
          <p className="mt-3 min-h-12 text-lg">{latestVoiceCommand || "Press and hold the mic"}</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40"><Brain size={15} /> AI Reply</p>
          <p className="mt-3 min-h-12 text-lg text-cyan">{latestAiResponse || "Buddy replies in Hinglish"}</p>
        </Card>
        <Button variant="ghost" onClick={() => window.speechSynthesis?.cancel()}>Stop Voice</Button>
      </div>
    </section>
  );
}
