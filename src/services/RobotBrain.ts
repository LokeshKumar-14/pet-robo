import type { BrainDecision, RobotCommand } from "@/types/robot";

type Rule = {
  label: string;
  command: RobotCommand;
  patterns: string[];
};

const normalize = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const rules: Rule[] = [
  { label: "Emergency Stop", command: { cmd: "estop" }, patterns: ["emergency stop", "e stop", "danger stop", "turant ruk", "abhi ruk"] },
  { label: "Stop", command: { cmd: "stop" }, patterns: ["stop", "freeze", "ruk", "ruko", "hold", "bas", "halt"] },
  { label: "Sit", command: { cmd: "sit" }, patterns: ["sit", "sit down", "beth ja", "baith ja", "rest", "neeche baith"] },
  { label: "Stand", command: { cmd: "stand" }, patterns: ["stand", "stand up", "khade ho", "khada ho", "uth", "utho", "ready"] },
  { label: "Walk", command: { cmd: "walk" }, patterns: ["walk", "move", "go", "forward", "aage chalo", "aage badho", "chalo"] },
  { label: "Back", command: { cmd: "back" }, patterns: ["back", "backward", "reverse", "peeche", "peeche jao"] },
  { label: "Turn Left", command: { cmd: "left" }, patterns: ["turn left", "left", "baaye", "baen", "left jao"] },
  { label: "Turn Right", command: { cmd: "right" }, patterns: ["turn right", "right", "daaye", "daye", "right jao"] },
  { label: "Punch", command: { cmd: "punch" }, patterns: ["punch", "attack", "maaro", "maro", "hit", "strike"] },
  { label: "Head Left", command: { cmd: "head", angle: 35 }, patterns: ["head left", "look left", "sir left", "left dekho", "baaye dekho"] },
  { label: "Head Right", command: { cmd: "head", angle: 145 }, patterns: ["head right", "look right", "sir right", "right dekho", "daaye dekho"] },
  { label: "Head Center", command: { cmd: "head", angle: 90 }, patterns: ["head center", "look center", "center dekho", "seedha dekho", "front dekho"] }
];

export class RobotBrain {
  decide(transcript: string): BrainDecision {
    const clean = normalize(transcript);
    if (!clean) return { kind: "conversation", text: transcript };

    const matches = rules
      .map((rule) => {
        const pattern = rule.patterns.find((phrase) => clean === phrase || clean.includes(phrase));
        if (!pattern) return null;
        const confidence = pattern.length / Math.max(clean.length, pattern.length);
        return { rule, confidence };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.confidence ?? 0) - (a?.confidence ?? 0));

    const match = matches[0];
    if (match && match.confidence >= 0.25) {
      return { kind: "command", command: match.rule.command, label: match.rule.label, confidence: match.confidence };
    }

    return { kind: "conversation", text: transcript };
  }
}

export const robotBrain = new RobotBrain();
