import { NextResponse } from "next/server";
import { briefToText, validateBrief, type Brief } from "@/lib/contact";

/**
 * Receives a project brief and forwards it to CONTACT_WEBHOOK_URL as JSON.
 * Without that variable the route reports "not_configured" and the form falls
 * back to a prefilled email, so nobody is ever told a message was sent when it wasn't.
 */
export async function POST(req: Request) {
  let body: Partial<Brief> & { website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid_json" },
      { status: 400 },
    );
  }

  // Honeypot: real people never see or fill this field.
  if (body.website) return NextResponse.json({ ok: true });

  const errors = validateBrief(body);
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { ok: false, reason: "invalid", errors },
      { status: 422 },
    );
  }

  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    return NextResponse.json(
      { ok: false, reason: "not_configured" },
      { status: 503 },
    );
  }

  const brief: Brief = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    company: (body.company ?? "").trim(),
    types: body.types ?? [],
    budget: body.budget!,
    timeline: body.timeline ?? "",
    message: body.message!.trim(),
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...brief,
        text: briefToText(brief),
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, reason: "upstream_error" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "upstream_unreachable" },
      { status: 502 },
    );
  }
}
