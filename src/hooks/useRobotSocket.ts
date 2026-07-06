import { useEffect } from "react";
import { robotSocket } from "@/services/WebSocketService";
import { useRobotStore } from "@/store/robotStore";
import type { RobotCommand } from "@/types/robot";

export function useRobotSocket(connect = false) {
  const websocketUrl = useRobotStore((state) => state.websocketUrl);
  const setConnection = useRobotStore((state) => state.setConnection);
  const setLatency = useRobotStore((state) => state.setLatency);
  const setQueuedCommands = useRobotStore((state) => state.setQueuedCommands);
  const setStatus = useRobotStore((state) => state.setStatus);
  const addLidar = useRobotStore((state) => state.addLidar);
  const setLastCommand = useRobotStore((state) => state.setLastCommand);

  useEffect(() => {
    if (!connect) return;
    const unsubscribe = robotSocket.subscribe((event) => {
      if (event.type === "state") setConnection(event.state);
      if (event.type === "latency") setLatency(event.latency);
      if (event.type === "queue") setQueuedCommands(event.size);
      if (event.type === "status") setStatus(event.status);
      if (event.type === "lidar") addLidar({ ...event.reading, timestamp: Date.now() });
    });

    const updateOnline = () => setConnection(navigator.onLine ? "disconnected" : "offline");
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    robotSocket.connect(websocketUrl);

    return () => {
      unsubscribe();
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, [addLidar, connect, setConnection, setLatency, setQueuedCommands, setStatus, websocketUrl]);

  const send = (command: RobotCommand) => {
    setLastCommand(command);
    robotSocket.send(command);
  };

  return { send };
}
