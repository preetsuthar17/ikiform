import type { ChatMessage } from "./types";
import { extractJsonFromText } from "./utils";

export class AIBuilderService {
  static async sendMessage(
    messages: ChatMessage[],
    sessionId: string,
    onStream: (content: string) => void,
    onError: (error: string) => void
  ): Promise<{ fullText: string; foundJson: any }> {
    try {
      const response = await fetch("/api/ai-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, sessionId }),
      });

      if (!response.body) {
        onError("No response from server.");
        return { fullText: "", foundJson: null };
      }

      const reader = response.body.getReader();
      let fullText = "";
      let foundJson = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        fullText += chunk;
        onStream(fullText);

        if (!foundJson) {
          foundJson = extractJsonFromText(fullText);
        }
      }

      return { fullText, foundJson };
    } catch (error) {
      onError("Failed to send message");
      return { fullText: "", foundJson: null };
    }
  }
}
