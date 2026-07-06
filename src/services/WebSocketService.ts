import type { ConnectionState, LidarMessage, RobotCommand, RobotMessage, RobotStatus } from "@/types/robot";

type Listener = (event: WebSocketEvent) => void;

export type WebSocketEvent =
  | { type: "state"; state: ConnectionState }
  | { type: "latency"; latency: number }
  | { type: "queue"; size: number }
  | { type: "status"; status: RobotStatus }
  | { type: "lidar"; reading: LidarMessage }
  | { type: "error"; message: string };

export class RobotWebSocketService {
  private socket?: WebSocket;
  private listeners = new Set<Listener>();
  private queue: RobotCommand[] = [];
  private reconnectTimer?: number;
  private heartbeatTimer?: number;
  private reconnectAttempt = 0;
  private pingSentAt = 0;
  private url = "";
  private manualClose = false;

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  connect(url: string) {
    this.url = url.trim();
    this.manualClose = false;
    if (!this.url) {
      this.emit({ type: "state", state: "offline" });
      return;
    }
    this.cleanupSocket();
    this.emit({ type: "state", state: "connecting" });
    try {
      this.socket = new WebSocket(this.url);
    } catch (error) {
      this.emit({ type: "error", message: error instanceof Error ? error.message : "WebSocket URL is invalid." });
      this.scheduleReconnect();
      return;
    }
    this.socket.onopen = () => {
      this.reconnectAttempt = 0;
      this.emit({ type: "state", state: "connected" });
      this.flushQueue();
      this.startHeartbeat();
    };
    this.socket.onmessage = (event) => this.handleMessage(event.data);
    this.socket.onerror = () => this.emit({ type: "error", message: "WebSocket connection error." });
    this.socket.onclose = () => {
      this.stopHeartbeat();
      this.emit({ type: "state", state: navigator.onLine ? "disconnected" : "offline" });
      if (!this.manualClose) this.scheduleReconnect();
    };
  }

  disconnect() {
    this.manualClose = true;
    this.stopHeartbeat();
    this.cleanupSocket();
    this.emit({ type: "state", state: "disconnected" });
  }

  send(command: RobotCommand) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(command));
      return;
    }
    this.queue.push(command);
    this.emit({ type: "queue", size: this.queue.length });
    if (this.url) this.scheduleReconnect();
  }

  private handleMessage(raw: string) {
    if (raw === "pong") {
      this.emit({ type: "latency", latency: Math.max(0, Math.round(performance.now() - this.pingSentAt)) });
      return;
    }
    try {
      const message = JSON.parse(raw) as RobotMessage;
      if (message.type === "status") this.emit({ type: "status", status: message as RobotStatus });
      if (message.type === "lidar") this.emit({ type: "lidar", reading: message as LidarMessage });
    } catch {
      this.emit({ type: "error", message: "Received invalid robot message." });
    }
  }

  private flushQueue() {
    const pending = [...this.queue];
    this.queue = [];
    pending.forEach((command) => this.send(command));
    this.emit({ type: "queue", size: this.queue.length });
  }

  private scheduleReconnect() {
    window.clearTimeout(this.reconnectTimer);
    const delay = Math.min(12000, 800 * 2 ** this.reconnectAttempt);
    this.reconnectAttempt += 1;
    this.reconnectTimer = window.setTimeout(() => this.connect(this.url), delay);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.pingSentAt = performance.now();
        this.socket.send("ping");
      }
    }, 5000);
  }

  private stopHeartbeat() {
    window.clearInterval(this.heartbeatTimer);
  }

  private cleanupSocket() {
    window.clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
      this.socket = undefined;
    }
  }

  private emit(event: WebSocketEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
}

export const robotSocket = new RobotWebSocketService();
