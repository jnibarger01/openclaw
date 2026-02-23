"use client";

import { useEffect, useState } from "react";

import { MissionControlDashboard } from "@/components/mission-control-dashboard";
import { PinGate } from "@/components/pin-gate";
import { MISSION_SESSION_KEY } from "@/lib/auth";

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(MISSION_SESSION_KEY);
    setAuthenticated(savedSession === "authenticated");
    setReady(true);
  }, []);

  const handleAuthenticated = () => {
    window.localStorage.setItem(MISSION_SESSION_KEY, "authenticated");
    setAuthenticated(true);
  };

  const handleSignOut = () => {
    window.localStorage.removeItem(MISSION_SESSION_KEY);
    setAuthenticated(false);
  };

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center">
        <p className="font-mono text-sm text-muted-foreground">Booting mission control...</p>
      </main>
    );
  }

  if (!authenticated) {
    return <PinGate onAuthenticated={handleAuthenticated} />;
  }

  return <MissionControlDashboard onSignOut={handleSignOut} />;
}
