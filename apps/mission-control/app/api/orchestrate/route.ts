import { NextResponse } from "next/server";

import { orchestrateTaskIntake } from "@/lib/orchestrator";

type OrchestrateRequest = {
  inputText?: string;
};

export async function POST(request: Request) {
  let payload: OrchestrateRequest;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const inputText = typeof payload.inputText === "string" ? payload.inputText.trim() : "";
  if (!inputText) {
    return NextResponse.json({ error: "inputText is required." }, { status: 400 });
  }

  const result = orchestrateTaskIntake(inputText);
  return NextResponse.json(result);
}

