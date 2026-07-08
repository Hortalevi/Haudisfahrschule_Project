import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";

/**
 * Mock contact endpoint — see app/api/registration/route.ts for the
 * production integration note (real persistence + email notification).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  console.log("[contact] new submission", parsed.data);

  return NextResponse.json({ ok: true });
}
