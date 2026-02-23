import { NextResponse } from "next/server";

const PIN_PATTERN = /^\d{4,6}$/;

type VerifyRequest = {
  pin?: string;
};

export async function POST(request: Request) {
  const configuredPin = process.env.MISSION_PIN?.trim() ?? "";

  if (!PIN_PATTERN.test(configuredPin)) {
    return NextResponse.json(
      { ok: false, error: "MISSION_PIN is not configured as a 4-6 digit value." },
      { status: 500 },
    );
  }

  let payload: VerifyRequest;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const pin = payload.pin?.trim() ?? "";
  if (!PIN_PATTERN.test(pin)) {
    return NextResponse.json({ ok: false, error: "PIN must be 4-6 digits." }, { status: 400 });
  }

  if (pin !== configuredPin) {
    return NextResponse.json({ ok: false, error: "Invalid PIN." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
