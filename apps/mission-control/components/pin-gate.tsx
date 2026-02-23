"use client";

import { FormEvent, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const PIN_PATTERN = /^\d{4,6}$/;

type PinGateProps = {
  onAuthenticated: () => void;
};

export function PinGate({ onAuthenticated }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!PIN_PATTERN.test(pin.trim())) {
      setError("PIN must be 4-6 digits.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        setError(result.error ?? "Authentication failed.");
        return;
      }

      onAuthenticated();
    } catch {
      setError("Authentication request failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md bg-card/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Mission Control Access
          </CardTitle>
          <CardDescription>Enter the operator PIN to unlock dashboard controls.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <Input
              autoComplete="one-time-code"
              autoFocus
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]*"
              placeholder="PIN (4-6 digits)"
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/[^0-9]/g, ""))}
            />
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
            <Button className="w-full" disabled={busy} type="submit">
              {busy ? "Verifying..." : "Unlock Mission Control"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
