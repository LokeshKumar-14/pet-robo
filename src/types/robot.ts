export type RobotCommandName =
  | "stand"
  | "sit"
  | "walk"
  | "back"
  | "left"
  | "right"
  | "punch"
  | "stop"
  | "estop";

export type RobotCommand = { cmd: RobotCommandName } | { cmd: "head"; angle: number };

export type RobotStatus = {
  type: "status";
  legs: number[];
  head: number;
  punch: number;
  touch: boolean;
  battery: number;
  wifi: number;
  action: string;
  lidar?: number[];
};

export type LidarMessage = {
  type: "lidar";
  angle: number;
  distance: number;
};

export type RobotMessage = RobotStatus | LidarMessage | Record<string, unknown>;

export type LidarReading = {
  angle: number;
  distance: number;
  timestamp: number;
};

export type BrainDecision =
  | {
      kind: "command";
      command: RobotCommand;
      label: string;
      confidence: number;
    }
  | {
      kind: "conversation";
      text: string;
    };

export type ConnectionState = "disconnected" | "connecting" | "connected" | "offline";
