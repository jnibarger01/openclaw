export type OrchestratorResult = {
  outputText: string;
  assumptions: string[];
};

const ACTION_VERBS = [
  "add",
  "build",
  "create",
  "debug",
  "design",
  "document",
  "draft",
  "fix",
  "implement",
  "investigate",
  "make",
  "optimize",
  "plan",
  "refactor",
  "review",
  "ship",
  "update",
  "wire",
  "write",
];

const DELIVERABLE_SIGNALS = [
  "api",
  "app",
  "bug",
  "component",
  "dashboard",
  "doc",
  "docs",
  "endpoint",
  "feature",
  "form",
  "page",
  "route",
  "script",
  "test",
  "ui",
];

export function orchestrateTaskIntake(inputText: string): OrchestratorResult {
  const normalizedInput = normalizeInput(inputText);
  const softenedInput = softenUrgencyLanguage(normalizedInput);
  const assumptions = inferAssumptions(normalizedInput, softenedInput);

  const outputLines = [
    "Requested Outcome",
    softenedInput,
    "",
    "Execution Target",
    "Provide the requested result in final form, ready to use.",
  ];

  if (assumptions.length > 0) {
    outputLines.push("", "Assumptions");
    for (const assumption of assumptions) {
      outputLines.push(`- ${assumption}`);
    }
  }

  return {
    outputText: outputLines.join("\n"),
    assumptions,
  };
}

function normalizeInput(value: string): string {
  const trimmed = value.trim();
  const normalizedNewlines = trimmed.replace(/\r\n?/g, "\n");

  return normalizedNewlines
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

function softenUrgencyLanguage(value: string): string {
  return value
    .replace(/\bASAP\b/gi, "as soon as practical")
    .replace(/\bURGENT\b/gi, "time-sensitive")
    .replace(/\bIMMEDIATELY\b/gi, "promptly")
    .replace(/\bRIGHT NOW\b/gi, "promptly");
}

function inferAssumptions(originalInput: string, softenedInput: string): string[] {
  const lower = originalInput.toLowerCase();
  const assumptions: string[] = [];

  const hasActionVerb = ACTION_VERBS.some((verb) => new RegExp(`\\b${verb}\\b`, "i").test(originalInput));
  const hasDeliverableSignal = DELIVERABLE_SIGNALS.some((signal) => lower.includes(signal));
  const mentionsDeadline = /\b(today|tomorrow|by\s+\w+|deadline|due|eta|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2})\b/i.test(
    originalInput,
  );
  const hadUrgencyRewrite = originalInput !== softenedInput;

  if (!hasActionVerb && originalInput.length < 80) {
    assumptions.push("Interpret the request as an implementation task to be completed directly, not a brainstorming prompt.");
  }

  if (!hasDeliverableSignal && originalInput.length < 120) {
    assumptions.push("Deliver the result as written output unless a specific artifact or file type is later specified.");
  }

  if (hadUrgencyRewrite && !mentionsDeadline) {
    assumptions.push("Treat priority as time-sensitive but without a fixed deadline because no concrete date or time was provided.");
  }

  return assumptions;
}

