# Buddy AI Pet Robot PWA

Production-ready mobile PWA for controlling an ESP32 AI pet robot. AI, voice recording, Whisper STT, chat, intent routing, and browser text-to-speech run inside the web application. The ESP32 only receives hardware JSON commands and streams status/lidar messages over WebSocket.

## Run

```bash
npm install
npm run dev
```

Open the Vite URL on the phone or desktop browser, set the Groq API key and ESP32 WebSocket URL in Settings, then connect to the robot network.

## ESP32 Contract

Commands are sent as JSON such as `{"cmd":"walk"}`, `{"cmd":"head","angle":90}`, and `{"cmd":"estop"}`.

Status messages should match:

```json
{
  "type": "status",
  "legs": [90, 90, 90, 90],
  "head": 90,
  "punch": 0,
  "touch": false,
  "battery": 4.1,
  "wifi": -45,
  "action": "walking",
  "lidar": []
}
```

Continuous lidar points can also stream as `{"type":"lidar","angle":0,"distance":45}`.
