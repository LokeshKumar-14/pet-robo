const GROQ_API = "https://api.groq.com/openai/v1";
const BUDDY_SYSTEM_PROMPT =
  "You are Buddy. A cute robotic pet dog. Friendly. Funny. Loyal. Protective. Replies only in Hinglish. Maximum two short sentences. Sometimes bark. Example: Bhow. Keep responses playful.";

export class GroqService {
  constructor(private readonly getApiKey: () => string) {}

  private headers(json = true) {
    const apiKey = this.getApiKey().trim();
    if (!apiKey) throw new Error("Groq API key is required in Settings.");
    return {
      Authorization: `Bearer ${apiKey}`,
      ...(json ? { "Content-Type": "application/json" } : {})
    };
  }

  async transcribe(blob: Blob): Promise<string> {
    const form = new FormData();
    const mime = blob.type || "audio/webm";
    form.append("file", blob, `recording.${mime.includes("mp4") ? "mp4" : "webm"}`);
    form.append("model", "whisper-large-v3-turbo");
    form.append("response_format", "json");
    form.append("temperature", "0");

    const response = await fetch(`${GROQ_API}/audio/transcriptions`, {
      method: "POST",
      headers: this.headers(false),
      body: form
    });
    if (!response.ok) throw new Error(await this.readError(response, "Whisper transcription failed"));
    const data = (await response.json()) as { text?: string };
    return data.text?.trim() ?? "";
  }

  async chat(userText: string, robotName: string): Promise<string> {
    const response = await fetch(`${GROQ_API}/chat/completions`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        max_tokens: 80,
        messages: [
          { role: "system", content: `${BUDDY_SYSTEM_PROMPT} Your robot name is ${robotName || "Buddy"}.` },
          { role: "user", content: userText }
        ]
      })
    });
    if (!response.ok) throw new Error(await this.readError(response, "Groq chat failed"));
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content?.trim() || "Bhow, main yahin hoon!";
  }

  private async readError(response: Response, fallback: string) {
    try {
      const data = (await response.json()) as { error?: { message?: string } };
      return data.error?.message || `${fallback}: ${response.status}`;
    } catch {
      return `${fallback}: ${response.status}`;
    }
  }
}
