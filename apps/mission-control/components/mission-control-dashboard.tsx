"use client";

import { useMemo, useState } from "react";
import { Copy, Lock, PauseCircle, PlayCircle, RefreshCw, RotateCcw, SquareTerminal } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { missionSnapshot, type AgentSnapshot, type HealthState, type MissionSnapshot } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type MissionControlDashboardProps = {
  onSignOut: () => void;
};

const healthStyles: Record<HealthState, string> = {
  Healthy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  Degraded: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  Down: "bg-red-500/15 text-red-300 border-red-500/40",
};

const agentStyles: Record<AgentSnapshot["status"], string> = {
  Running: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  Idle: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  Stopped: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
  Error: "bg-red-500/15 text-red-300 border-red-500/40",
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString();
}

export function MissionControlDashboard({ onSignOut }: MissionControlDashboardProps) {
  const [snapshot, setSnapshot] = useState<MissionSnapshot>(missionSnapshot);
  const [agentFilter, setAgentFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");
  const [notice, setNotice] = useState<string>("Dashboard running with placeholder mission snapshot.");

  const filteredLogs = useMemo(
    () =>
      snapshot.logs.filter((entry) => {
        const agentMatch = agentFilter ? entry.agentId.toLowerCase().includes(agentFilter.toLowerCase()) : true;
        const taskMatch = taskFilter ? entry.taskId.toLowerCase().includes(taskFilter.toLowerCase()) : true;
        return agentMatch && taskMatch;
      }),
    [agentFilter, snapshot.logs, taskFilter],
  );

  const runStubAction = (action: string) => {
    setNotice(`${action} queued (stub).`);
  };

  const requeueSingle = (taskId: string) => {
    setSnapshot((prev) => {
      const stuck = prev.tasks.stuck.filter((task) => task.id !== taskId);
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          stuck,
          metrics: {
            ...prev.tasks.metrics,
            queued: prev.tasks.metrics.queued + 1,
          },
        },
      };
    });
    setNotice(`Task ${taskId} requeued.`);
  };

  const requeueAllStuck = () => {
    setSnapshot((prev) => {
      const moved = prev.tasks.stuck.length;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          stuck: [],
          metrics: {
            ...prev.tasks.metrics,
            queued: prev.tasks.metrics.queued + moved,
          },
        },
      };
    });
    setNotice("All stuck tasks requeued.");
  };

  const clearLocks = () => {
    setSnapshot((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        leases: [],
      },
    }));
    setNotice("Task leases cleared.");
  };

  const restartGateway = () => {
    setSnapshot((prev) => ({
      ...prev,
      system: {
        ...prev.system,
        gateway: "Online",
        lastHeartbeat: new Date().toISOString(),
      },
    }));
    setNotice("Gateway restart requested.");
  };

  const copyLogs = async () => {
    const lines = filteredLogs
      .map((entry) => `${entry.ts} ${entry.level} agent=${entry.agentId} task=${entry.taskId} ${entry.message}`)
      .join("\n");

    try {
      await navigator.clipboard.writeText(lines);
      setNotice("Filtered logs copied to clipboard.");
    } catch {
      setNotice("Clipboard copy failed in this browser context.");
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-3 px-3 py-3 sm:px-4 lg:px-6">
      <Card>
        <CardContent className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
          <div className="grid gap-2 text-xs sm:grid-cols-3 sm:gap-4">
            <div className="space-y-1">
              <p className="font-mono uppercase tracking-wider text-muted-foreground">System health</p>
              <Badge className={cn("border", healthStyles[snapshot.system.health])} variant="outline">
                {snapshot.system.health}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="font-mono uppercase tracking-wider text-muted-foreground">Gateway status</p>
              <Badge
                className={cn(
                  "border",
                  snapshot.system.gateway === "Online"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                    : snapshot.system.gateway === "Degraded"
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                      : "bg-red-500/15 text-red-300 border-red-500/40",
                )}
                variant="outline"
              >
                {snapshot.system.gateway}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="font-mono uppercase tracking-wider text-muted-foreground">Last heartbeat</p>
              <p className="font-mono text-[11px] text-foreground/90">{formatTimestamp(snapshot.system.lastHeartbeat)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" variant="outline" onClick={onSignOut}>
              <Lock className="h-3.5 w-3.5" />
              Lock
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 xl:grid-cols-12">
        <Card className="xl:col-span-6">
          <CardHeader className="space-y-2 pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>Agents</CardTitle>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant="secondary" onClick={() => runStubAction("Spawn agent")}>
                  <PlayCircle className="h-3.5 w-3.5" />
                  Spawn
                </Button>
                <Button size="sm" variant="outline" onClick={() => runStubAction("Stop agent")}>
                  <PauseCircle className="h-3.5 w-3.5" />
                  Stop
                </Button>
                <Button size="sm" variant="outline" onClick={() => runStubAction("Restart agent")}>
                  <RefreshCw className="h-3.5 w-3.5" />
                  Restart
                </Button>
              </div>
            </div>
            <CardDescription>Per-agent state and latest output snapshot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {snapshot.agents.map((agent) => (
              <div key={agent.id} className="rounded-md border border-border/70 bg-background/60 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{agent.id}</p>
                  </div>
                  <Badge className={cn("border", agentStyles[agent.status])} variant="outline">
                    {agent.status}
                  </Badge>
                </div>
                <p className="mt-1 font-mono text-[11px] text-foreground/90">{agent.lastOutput}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  Updated {formatTimestamp(agent.updatedAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-6">
          <CardHeader className="pb-2">
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              Active/queued/completed/failed counts, stuck task requeue, and lease tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Metric label="Active" value={snapshot.tasks.metrics.active} tone="text-cyan-300" />
              <Metric label="Queued" value={snapshot.tasks.metrics.queued} tone="text-blue-300" />
              <Metric label="Completed" value={snapshot.tasks.metrics.completed} tone="text-emerald-300" />
              <Metric label="Failed" value={snapshot.tasks.metrics.failed} tone="text-red-300" />
            </div>

            <div className="space-y-1.5 rounded-md border border-border/70 bg-background/60 p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stuck tasks</p>
                <Button size="sm" variant="outline" onClick={requeueAllStuck}>
                  <RotateCcw className="h-3.5 w-3.5" />
                  Requeue all
                </Button>
              </div>
              {snapshot.tasks.stuck.length === 0 ? (
                <p className="font-mono text-[11px] text-muted-foreground">No stuck tasks.</p>
              ) : (
                snapshot.tasks.stuck.map((task) => (
                  <div key={task.id} className="rounded border border-border/70 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-[11px] text-foreground">{task.id}</p>
                      <Button size="sm" variant="ghost" onClick={() => requeueSingle(task.id)}>
                        Requeue
                      </Button>
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground">{task.reason}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                      Since {formatTimestamp(task.stuckSince)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-1.5 rounded-md border border-border/70 bg-background/60 p-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Task leases</p>
              {snapshot.tasks.leases.length === 0 ? (
                <p className="font-mono text-[11px] text-muted-foreground">No active task leases.</p>
              ) : (
                <div className="space-y-1">
                  {snapshot.tasks.leases.map((lease) => (
                    <div key={lease.taskId} className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                      <span className="truncate text-foreground">{lease.taskId}</span>
                      <span className="truncate text-muted-foreground">{lease.owner}</span>
                      <span className="truncate text-muted-foreground">{formatTimestamp(lease.expiresAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>Logs</CardTitle>
              <Button size="sm" variant="outline" onClick={copyLogs}>
                <Copy className="h-3.5 w-3.5" />
                Copy filtered
              </Button>
            </div>
            <CardDescription>Tail-style stream filtered by agent and task IDs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Filter agent ID"
                value={agentFilter}
                onChange={(event) => setAgentFilter(event.target.value)}
              />
              <Input
                placeholder="Filter task ID"
                value={taskFilter}
                onChange={(event) => setTaskFilter(event.target.value)}
              />
            </div>
            <div className="h-[300px] space-y-1 overflow-y-auto rounded-md border border-border/80 bg-black/45 p-2 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <p className="text-muted-foreground">No logs match current filters.</p>
              ) : (
                filteredLogs.map((entry) => (
                  <p key={entry.id} className="leading-relaxed text-slate-100">
                    <span className="text-slate-400">{entry.ts}</span>{" "}
                    <span
                      className={cn(
                        entry.level === "ERROR"
                          ? "text-red-300"
                          : entry.level === "WARN"
                            ? "text-amber-300"
                            : "text-cyan-300",
                      )}
                    >
                      {entry.level}
                    </span>{" "}
                    <span className="text-emerald-300">agent={entry.agentId}</span>{" "}
                    <span className="text-sky-300">task={entry.taskId}</span>{" "}
                    <span>{entry.message}</span>
                  </p>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 xl:col-span-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common operational remediations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" size="sm" variant="secondary" onClick={requeueAllStuck}>
                <RotateCcw className="h-3.5 w-3.5" />
                Requeue stuck
              </Button>
              <Button className="w-full justify-start" size="sm" variant="outline" onClick={clearLocks}>
                <SquareTerminal className="h-3.5 w-3.5" />
                Clear locks
              </Button>
              <Button className="w-full justify-start" size="sm" variant="outline" onClick={restartGateway}>
                <RefreshCw className="h-3.5 w-3.5" />
                Restart gateway
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Config</CardTitle>
              <CardDescription>Active workspace paths and routing mode flags.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Workspace paths</p>
              <div className="space-y-1 rounded-md border border-border/70 bg-background/60 p-2">
                {snapshot.config.workspacePaths.map((path) => (
                  <p key={path} className="font-mono text-[11px] text-foreground/90">
                    {path}
                  </p>
                ))}
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Routing mode</p>
              <div className="rounded-md border border-border/70 bg-background/60 p-2">
                <div className="mb-1 flex flex-wrap gap-1">
                  <Badge variant="secondary">{snapshot.config.routingMode}</Badge>
                  <Badge variant="outline">WhatsApp constrained</Badge>
                  <Badge variant="outline">Telegram constrained</Badge>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">{snapshot.config.whatsappConstraint}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{snapshot.config.telegramConstraint}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-2 p-2">
          <p className="font-mono text-[11px] text-muted-foreground">{notice}</p>
          <Button size="sm" variant="ghost" onClick={() => setNotice("Status banner cleared.")}>Dismiss</Button>
        </CardContent>
      </Card>
    </main>
  );
}

type MetricProps = {
  label: string;
  value: number;
  tone: string;
};

function Metric({ label, value, tone }: MetricProps) {
  return (
    <div className="rounded-md border border-border/70 bg-background/60 p-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("font-mono text-lg font-semibold", tone)}>{value}</p>
    </div>
  );
}
