"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type OrchestrateResponse = {
  outputText: string;
  assumptions: string[];
};

export function OrchestratorForm() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = inputText.trim();
    if (!trimmed) {
      setError("Enter a task request before submitting.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText: trimmed }),
      });

      const data = (await response.json()) as Partial<OrchestrateResponse> & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }

      setOutputText(typeof data.outputText === "string" ? data.outputText : "");
      setAssumptions(Array.isArray(data.assumptions) ? data.assumptions.filter(isString) : []);
    } catch (submitError) {
      setOutputText("");
      setAssumptions([]);
      setError(submitError instanceof Error ? submitError.message : "Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orchestrator Task Intake</CardTitle>
        <CardDescription>
          Paste a task request to produce a cleaned final deliverable with conditional assumptions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Task Input</span>
            <textarea
              className={cn(
                "min-h-36 w-full rounded-md border border-input bg-background/70 px-3 py-2",
                "font-mono text-sm leading-relaxed text-foreground shadow-sm outline-none",
                "placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring",
              )}
              placeholder="Describe the task you want the orchestrator intake form to prepare..."
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              disabled={isLoading}
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Deliverable"}
            </Button>
            {error ? (
              <p className="text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </form>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Output</p>
            {assumptions.length > 0 ? (
              <p className="font-mono text-[11px] text-muted-foreground">
                {assumptions.length} assumption{assumptions.length === 1 ? "" : "s"} included
              </p>
            ) : null}
          </div>
          <div className="rounded-md border border-border/80 bg-background/60 p-3">
            <pre className="min-h-32 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-foreground">
              {outputText || "Generated output will appear here."}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

