import { Download, KeyRound, RefreshCcw, Save, Upload, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { speechService } from "@/services/SpeechService";
import { useRobotStore, type ThemeMode } from "@/store/robotStore";

export function Settings() {
  const store = useRobotStore();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [importText, setImportText] = useState("");
  const pwa = usePwaInstall();

  useEffect(() => {
    const load = () => setVoices(speechService.voices());
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  const exportSettings = () => {
    const payload = JSON.stringify(
      {
        groqApiKey: store.groqApiKey,
        websocketUrl: store.websocketUrl,
        robotName: store.robotName,
        theme: store.theme,
        voiceName: store.voiceName
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan/70">Configuration</p>
        <h1 className="mt-1 text-4xl font-bold md:text-6xl">Settings</h1>
      </div>

      <Card className="grid gap-4 p-5">
        <label className="grid gap-2">
          <span className="flex items-center gap-2 text-sm text-white/65"><KeyRound size={16} /> Groq API Key</span>
          <input className="h-12 rounded-lg border border-white/10 bg-black/30 px-4 outline-none focus:border-cyan" type="password" value={store.groqApiKey} onChange={(event) => store.setSettings({ groqApiKey: event.target.value })} placeholder="gsk_..." />
        </label>
        <label className="grid gap-2">
          <span className="flex items-center gap-2 text-sm text-white/65"><Wifi size={16} /> WebSocket URL</span>
          <input className="h-12 rounded-lg border border-white/10 bg-black/30 px-4 outline-none focus:border-cyan" value={store.websocketUrl} onChange={(event) => store.setSettings({ websocketUrl: event.target.value })} placeholder="ws://192.168.4.1/ws" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-white/65">Robot Name</span>
          <input className="h-12 rounded-lg border border-white/10 bg-black/30 px-4 outline-none focus:border-cyan" value={store.robotName} onChange={(event) => store.setSettings({ robotName: event.target.value })} />
        </label>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="grid gap-4 p-5">
          <label className="grid gap-2">
            <span className="text-sm text-white/65">Theme</span>
            <select className="h-12 rounded-lg border border-white/10 bg-black/30 px-4 outline-none focus:border-cyan" value={store.theme} onChange={(event) => store.setSettings({ theme: event.target.value as ThemeMode })}>
              <option value="midnight">Midnight</option>
              <option value="graphite">Graphite</option>
              <option value="arctic">Arctic</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/65">Voice</span>
            <select className="h-12 rounded-lg border border-white/10 bg-black/30 px-4 outline-none focus:border-cyan" value={store.voiceName} onChange={(event) => store.setSettings({ voiceName: event.target.value })}>
              <option value="">System default</option>
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>{voice.name}</option>
              ))}
            </select>
          </label>
          <Button variant="primary" disabled={!pwa.canInstall} onClick={pwa.install}><Download size={17} /> Install PWA</Button>
        </Card>

        <Card className="grid gap-3 p-5">
          <textarea className="min-h-32 rounded-lg border border-white/10 bg-black/30 p-4 outline-none focus:border-cyan" value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="Paste exported settings JSON" />
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={exportSettings}><Upload size={17} /> Export</Button>
            <Button onClick={() => store.importSettings(importText)} disabled={!importText.trim()}><Save size={17} /> Import</Button>
            <Button variant="danger" onClick={store.resetSettings}><RefreshCcw size={17} /> Reset</Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
