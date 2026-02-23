"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-28 rounded-md border border-border/80 bg-muted/20" />;
  }

  const darkEnabled = theme === "dark";

  return (
    <div className="flex items-center gap-2 rounded-md border border-border/80 bg-background/60 px-3 py-1 text-xs font-medium">
      <SunMedium className="h-3.5 w-3.5 text-amber-400" />
      <Switch checked={darkEnabled} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
      <MoonStar className="h-3.5 w-3.5 text-cyan-300" />
    </div>
  );
}
