import type { Platform } from "@/types/mediakit";

export type BioTone = "professional" | "friendly" | "bold";
export type BioLanguage = "en" | "tr";

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const TONE_DESCRIPTIONS: Record<BioTone, string> = {
  professional: "polished, credible, and business-appropriate",
  friendly: "warm, approachable, and conversational",
  bold: "confident, energetic, and attention-grabbing",
};

const LANGUAGE_NAMES: Record<BioLanguage, string> = {
  en: "English",
  tr: "Turkish",
};

export function buildBioPrompt(
  niche: string[],
  platforms: Platform[],
  tone: BioTone,
  language: BioLanguage,
  existingInstagramBio?: string
): string {
  const nicheText = niche.length > 0 ? niche.join(", ") : "content creation";
  const platformText =
    platforms.length > 0
      ? platforms
          .map((p) => `${p.name} (${p.followerCount.toLocaleString()} followers)`)
          .join(", ")
      : "social media";

  const lines = [
    `Write a short creator bio for a media kit (max 150 words, plain text, no markdown, no hashtags, no quotation marks around the whole thing).`,
    `Write the entire bio in ${LANGUAGE_NAMES[language]}, regardless of what language the niche/topics or platform names below are written in.`,
    `Niche/topics: ${nicheText}.`,
    `Active platforms: ${platformText}.`,
    `Tone: ${TONE_DESCRIPTIONS[tone]}.`,
  ];

  if (existingInstagramBio?.trim()) {
    lines.push(`Their current Instagram bio (use for context on their real niche and voice, don't copy it verbatim): "${existingInstagramBio.trim()}".`);
  }

  lines.push(
    `Write in first person. Focus on what the creator offers to brands and audiences. Keep it concise and ready to paste directly into a bio field.`
  );

  return lines.join("\n");
}

/** Trims model output to a hard 150-word cap in case the model overshoots. */
function capWords(text: string, maxWords = 150): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ").trim() + "...";
}

export async function generateBio(
  niche: string[],
  platforms: Platform[],
  tone: BioTone,
  language: BioLanguage,
  existingInstagramBio?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prompt = buildBioPrompt(niche, platforms, tone, language, existingInstagramBio);

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Gemini API request failed (${response.status}): ${errorBody}`);
  }

  const payload = await response.json();
  const parts: Array<{ text?: string; thought?: boolean }> =
    payload?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .filter((part) => !part.thought && part.text)
    .map((part) => part.text)
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini API returned no bio text.");
  }

  return capWords(text);
}
