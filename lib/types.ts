export type Priority = "none" | "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "done";
export type View = "inbox" | "today" | "upcoming" | "completed";

export type Task = {
  id: string;
  title: string;
  notes: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  dueTime: string | null;
  tags: string[];
  project: string;
  assignee: string | null;
  subtasks: { id: string; title: string; done: boolean }[];
  recurring: "none" | "daily" | "weekly" | "monthly";
  createdAt: string;
  completedAt: string | null;
};

export type TaskFilter = {
  query: string;
  priority: Priority | "all";
  status: TaskStatus | "all";
  project: string | "all";
  tag: string | "all";
};
