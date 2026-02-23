export type HealthState = "Healthy" | "Degraded" | "Down";
export type AgentState = "Running" | "Idle" | "Stopped" | "Error";

export type AgentSnapshot = {
  id: string;
  name: string;
  status: AgentState;
  lastOutput: string;
  updatedAt: string;
};

export type TaskLease = {
  taskId: string;
  owner: string;
  expiresAt: string;
};

export type TaskSnapshot = {
  metrics: {
    active: number;
    queued: number;
    completed: number;
    failed: number;
  };
  stuck: {
    id: string;
    reason: string;
    stuckSince: string;
  }[];
  leases: TaskLease[];
};

export type LogEntry = {
  id: string;
  ts: string;
  level: "INFO" | "WARN" | "ERROR";
  agentId: string;
  taskId: string;
  message: string;
};

export type MissionSnapshot = {
  system: {
    health: HealthState;
    gateway: "Online" | "Degraded" | "Offline";
    lastHeartbeat: string;
  };
  agents: AgentSnapshot[];
  tasks: TaskSnapshot;
  logs: LogEntry[];
  config: {
    workspacePaths: string[];
    routingMode: "Constrained" | "Open";
    whatsappConstraint: string;
    telegramConstraint: string;
  };
};

export const missionSnapshot: MissionSnapshot = {
  system: {
    health: "Healthy",
    gateway: "Online",
    lastHeartbeat: "2026-02-22T17:42:30Z",
  },
  agents: [
    {
      id: "router-core",
      name: "Router Core",
      status: "Running",
      lastOutput: "Routed task task-8892 to telegram.ops",
      updatedAt: "2026-02-22T17:42:12Z",
    },
    {
      id: "watchdog",
      name: "Watchdog",
      status: "Idle",
      lastOutput: "No stale leases detected during last scan.",
      updatedAt: "2026-02-22T17:40:02Z",
    },
    {
      id: "bridge-whatsapp",
      name: "WhatsApp Bridge",
      status: "Running",
      lastOutput: "Session pair verified for account wa-primary.",
      updatedAt: "2026-02-22T17:41:48Z",
    },
    {
      id: "log-relay",
      name: "Log Relay",
      status: "Error",
      lastOutput: "Backpressure threshold exceeded; retry in 5s.",
      updatedAt: "2026-02-22T17:41:02Z",
    },
  ],
  tasks: {
    metrics: {
      active: 7,
      queued: 14,
      completed: 208,
      failed: 6,
    },
    stuck: [
      {
        id: "task-8834",
        reason: "Lease expired while owner heartbeat missing.",
        stuckSince: "2026-02-22T17:28:52Z",
      },
      {
        id: "task-8841",
        reason: "External provider timeout > 90s.",
        stuckSince: "2026-02-22T17:31:08Z",
      },
    ],
    leases: [
      {
        taskId: "task-8892",
        owner: "router-core",
        expiresAt: "2026-02-22T17:43:12Z",
      },
      {
        taskId: "task-8898",
        owner: "bridge-whatsapp",
        expiresAt: "2026-02-22T17:44:02Z",
      },
      {
        taskId: "task-8901",
        owner: "watchdog",
        expiresAt: "2026-02-22T17:44:30Z",
      },
    ],
  },
  logs: [
    {
      id: "log-1",
      ts: "2026-02-22T17:41:45Z",
      level: "INFO",
      agentId: "router-core",
      taskId: "task-8892",
      message: "Dispatch accepted by telegram.ops queue.",
    },
    {
      id: "log-2",
      ts: "2026-02-22T17:41:46Z",
      level: "INFO",
      agentId: "bridge-whatsapp",
      taskId: "task-8898",
      message: "Outbound constraint check passed for paired account.",
    },
    {
      id: "log-3",
      ts: "2026-02-22T17:41:50Z",
      level: "WARN",
      agentId: "watchdog",
      taskId: "task-8834",
      message: "Task lease expired; awaiting operator requeue.",
    },
    {
      id: "log-4",
      ts: "2026-02-22T17:41:56Z",
      level: "ERROR",
      agentId: "log-relay",
      taskId: "task-8841",
      message: "Relay backlog reached 250 entries.",
    },
    {
      id: "log-5",
      ts: "2026-02-22T17:42:04Z",
      level: "INFO",
      agentId: "router-core",
      taskId: "task-8901",
      message: "Lease renewed for watchdog task window.",
    },
  ],
  config: {
    workspacePaths: ["C:\\ai\\openclaw", "C:\\Users\\operator\\.openclaw"],
    routingMode: "Constrained",
    whatsappConstraint: "WhatsApp outbound commands require active paired web session.",
    telegramConstraint: "Telegram control path restricted to gateway admins.",
  },
};
