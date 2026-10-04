/** Shared, dependency-free content types (safe to import in client code). */
export const ARCHITECTURE_TYPES = [
  "users", "dns", "cdn", "alb", "autoscaling", "ec2", "ecs", "api",
  "app", "database", "cache", "queue", "storage", "cicd", "monitoring", "backup",
] as const;
export type ArchitectureType = (typeof ARCHITECTURE_TYPES)[number];
export type ArchitectureGroup = "flow" | "data" | "ops";
export interface ArchitectureNode {
  type: ArchitectureType;
  label: string;
  detail?: string;
  group?: ArchitectureGroup;
  multiple?: boolean;
}
