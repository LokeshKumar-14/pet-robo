import { useMemo, useRef, useState } from "react";
import { GroqService } from "@/services/GroqService";
import { robotBrain } from "@/services/RobotBrain";
import { SpeechRecorder, speechService } from "@/services/SpeechService";
import { useRobotStore } from "@/store/robotStore";
import type { RobotCommand } from "@/types/robot";

type PipelineState = "idle" | "recording" | "transcribing" | "thinking" | "speaking" | "error";

export function useVoicePipeline(send: (command: RobotCommand) => void) {
  const [state, setState] = useState<PipelineState>("idle");
  const [error, setError] = useState("");
  const recorderRef = useRef(new SpeechRecorder());
  const groqApiKey = useRobotStore((item) => item.groqApiKey);
  const robotName = useRobotStore((item) => item.robotName);
  const voiceName = useRobotStore((item) => item.voiceName);
  const setVoice = useRobotStore((item) => item.setVoice);
  const groq = useMemo(() => new GroqService(() => groqApiKey), [groqApiKey]);

  const start = async () => {
    setError("");
    setState("recording");
    try {
      await recorderRef.current.start();
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to start recording.");
      setState("error");
    }
  };

  const stop = async () => {
    try {
      setState("transcribing");
      const blob = await recorderRef.current.stop();
      const transcript = await groq.transcribe(blob);
      setVoice(transcript);
      const decision = robotBrain.decide(transcript);

      if (decision.kind === "command") {
        send(decision.command);
        const response = `Bhow, ${decision.label} kar raha hoon!`;
        setVoice(transcript, response);
        setState("speaking");
        speechService.speak(response, voiceName);
        window.setTimeout(() => setState("idle"), 700);
        return;
      }

      setState("thinking");
      const reply = await groq.chat(decision.text, robotName);
      setVoice(transcript, reply);
      setState("speaking");
      speechService.speak(reply, voiceName);
      window.setTimeout(() => setState("idle"), 900);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Voice pipeline failed.");
      setState("error");
    }
  };

  return {
    state,
    error,
    recording: state === "recording",
    busy: ["transcribing", "thinking", "speaking"].includes(state),
    start,
    stop
  };
}
