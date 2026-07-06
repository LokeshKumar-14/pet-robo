export class SpeechRecorder {
  private mediaRecorder?: MediaRecorder;
  private chunks: Blob[] = [];

  get supported() {
    return typeof navigator.mediaDevices?.getUserMedia === "function" && "MediaRecorder" in window;
  }

  async start() {
    if (!this.supported) throw new Error("Voice recording is not supported in this browser.");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
    this.chunks = [];
    this.mediaRecorder = new MediaRecorder(stream, { mimeType });
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.chunks.push(event.data);
    };
    this.mediaRecorder.start(120);
  }

  async stop(): Promise<Blob> {
    const recorder = this.mediaRecorder;
    if (!recorder) throw new Error("Recorder is not active.");
    return new Promise((resolve) => {
      recorder.onstop = () => {
        recorder.stream.getTracks().forEach((track) => track.stop());
        resolve(new Blob(this.chunks, { type: recorder.mimeType }));
      };
      recorder.stop();
    });
  }
}

export class SpeechService {
  speak(text: string, voiceName?: string) {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 1.02;
    utterance.pitch = 1.18;
    const voice = window.speechSynthesis.getVoices().find((item) => item.name === voiceName);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  voices() {
    return "speechSynthesis" in window ? window.speechSynthesis.getVoices() : [];
  }
}

export const speechService = new SpeechService();
