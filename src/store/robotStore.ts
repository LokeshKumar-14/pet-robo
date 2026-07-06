import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConnectionState, LidarReading, RobotCommand, RobotStatus } from "@/types/robot";

export type ThemeMode = "midnight" | "graphite" | "arctic";

type RobotStore = {
  groqApiKey: string;
  websocketUrl: string;
  robotName: string;
  theme: ThemeMode;
  voiceName: string;
  connection: ConnectionState;
  latency: number;
  queuedCommands: number;
  lastCommand?: RobotCommand;
  latestVoiceCommand: string;
  latestAiResponse: string;
  status: RobotStatus;
  lidar: LidarReading[];
  sensorHistory: Array<{ time: string; battery: number; wifi: number; head: number; punch: number }>;
  setSettings: (settings: Partial<Pick<RobotStore, "groqApiKey" | "websocketUrl" | "robotName" | "theme" | "voiceName">>) => void;
  setConnection: (connection: ConnectionState) => void;
  setLatency: (latency: number) => void;
  setQueuedCommands: (queuedCommands: number) => void;
  setLastCommand: (command: RobotCommand) => void;
  setVoice: (transcript: string, response?: string) => void;
  setStatus: (status: RobotStatus) => void;
  addLidar: (reading: LidarReading) => void;
  importSettings: (settings: string) => void;
  resetSettings: () => void;
};

const defaultStatus: RobotStatus = {
  type: "status",
  legs: [90, 90, 90, 90],
  head: 90,
  punch: 0,
  touch: false,
  battery: 0,
  wifi: -100,
  action: "idle",
  lidar: []
};

const defaultSettings = {
  groqApiKey: "",
  websocketUrl: "ws://192.168.4.1/ws",
  robotName: "Buddy",
  theme: "midnight" as ThemeMode,
  voiceName: ""
};

export const useRobotStore = create<RobotStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      connection: "disconnected",
      latency: 0,
      queuedCommands: 0,
      latestVoiceCommand: "",
      latestAiResponse: "",
      status: defaultStatus,
      lidar: [],
      sensorHistory: [],
      setSettings: (settings) => set(settings),
      setConnection: (connection) => set({ connection }),
      setLatency: (latency) => set({ latency }),
      setQueuedCommands: (queuedCommands) => set({ queuedCommands }),
      setLastCommand: (lastCommand) => set({ lastCommand }),
      setVoice: (latestVoiceCommand, latestAiResponse) =>
        set((state) => ({
          latestVoiceCommand,
          latestAiResponse: latestAiResponse ?? state.latestAiResponse
        })),
      setStatus: (status) =>
        set((state) => ({
          status,
          sensorHistory: [
            ...state.sensorHistory.slice(-59),
            {
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              battery: status.battery,
              wifi: status.wifi,
              head: status.head,
              punch: status.punch
            }
          ],
          lidar:
            status.lidar?.map((distance, angle) => ({ angle, distance, timestamp: Date.now() })).slice(0, 181) ??
            state.lidar
        })),
      addLidar: (reading) =>
        set((state) => {
          const filtered = state.lidar.filter((item) => item.angle !== reading.angle).slice(-180);
          return { lidar: [...filtered, reading].sort((a, b) => a.angle - b.angle) };
        }),
      importSettings: (settings) => {
        const parsed = JSON.parse(settings) as Partial<typeof defaultSettings>;
        set({ ...defaultSettings, ...parsed });
      },
      resetSettings: () => set({ ...defaultSettings })
    }),
    {
      name: "buddy-robot-settings",
      partialize: (state) => ({
        groqApiKey: state.groqApiKey,
        websocketUrl: state.websocketUrl,
        robotName: state.robotName,
        theme: state.theme,
        voiceName: state.voiceName
      })
    }
  )
);
