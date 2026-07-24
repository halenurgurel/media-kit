import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { consumeBioGeneration, getBioGenerationUsage, DAILY_BIO_GENERATION_LIMIT } from "@/lib/aiUsage";
import { generateBio, type BioTone, type BioLanguage } from "@/lib/gemini";
import type { Platform } from "@/types/mediakit";

const VALID_TONES: BioTone[] = ["professional", "friendly", "bold"];
const VALID_LANGUAGES: BioLanguage[] = ["en", "tr"];

async function requireUid(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization") ?? "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
  if (!idToken) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const uid = await requireUid(request);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usage = await getBioGenerationUsage(uid);
  return NextResponse.json({ remaining: usage.remaining, limit: DAILY_BIO_GENERATION_LIMIT });
}

export async function POST(request: NextRequest) {
  const uid = await requireUid(request);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    niche?: unknown;
    platforms?: unknown;
    tone?: unknown;
    language?: unknown;
    existingInstagramBio?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const niche = Array.isArray(body.niche) ? body.niche.filter((n): n is string => typeof n === "string") : [];
  const platforms = Array.isArray(body.platforms) ? (body.platforms as Platform[]) : [];
  const tone = VALID_TONES.includes(body.tone as BioTone) ? (body.tone as BioTone) : null;
  const language = VALID_LANGUAGES.includes(body.language as BioLanguage) ? (body.language as BioLanguage) : "en";
  const existingInstagramBio = typeof body.existingInstagramBio === "string" ? body.existingInstagramBio : undefined;

  if (!tone) {
    return NextResponse.json({ error: "tone must be one of professional, friendly, bold." }, { status: 400 });
  }

  if (niche.length === 0) {
    return NextResponse.json(
      { error: "Add at least one niche tag in the Profile tab before generating a bio." },
      { status: 400 }
    );
  }

  const usage = await consumeBioGeneration(uid);
  if (!usage.allowed) {
    return NextResponse.json(
      { error: `Daily limit reached. You can generate up to ${DAILY_BIO_GENERATION_LIMIT} bios per day.`, remaining: 0 },
      { status: 429 }
    );
  }

  try {
    const bio = await generateBio(niche, platforms, tone, language, existingInstagramBio);
    return NextResponse.json({ bio, remaining: usage.remaining, limit: DAILY_BIO_GENERATION_LIMIT });
  } catch (error) {
    console.error("generate-bio failed:", error);
    return NextResponse.json({ error: "Failed to generate a bio. Please try again." }, { status: 502 });
  }
}
