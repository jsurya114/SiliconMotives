import {
  Activity,
  AppWindow,
  ArchiveRestore,
  Boxes,
  Braces,
  Database,
  Gauge,
  GitBranch,
  Globe,
  HardDrive,
  Layers,
  ListOrdered,
  Server,
  Split,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ArchitectureNode, ArchitectureType } from "../lib/content";

/** Visual language for each supported component type. */
const META: Record<ArchitectureType, { icon: LucideIcon; tier: string }> = {
  users: { icon: Users, tier: "USERS" },
  dns: { icon: Globe, tier: "DNS" },
  cdn: { icon: Zap, tier: "EDGE" },
  alb: { icon: Split, tier: "LOAD BALANCING" },
  autoscaling: { icon: Layers, tier: "SCALING" },
  ec2: { icon: Server, tier: "COMPUTE" },
  ecs: { icon: Boxes, tier: "CONTAINERS" },
  api: { icon: Braces, tier: "APPLICATION" },
  app: { icon: AppWindow, tier: "APPLICATION" },
  database: { icon: Database, tier: "DATA" },
  cache: { icon: Gauge, tier: "CACHE" },
  queue: { icon: ListOrdered, tier: "QUEUE" },
  storage: { icon: HardDrive, tier: "STORAGE" },
  cicd: { icon: GitBranch, tier: "DELIVERY" },
  monitoring: { icon: Activity, tier: "OPERATIONS" },
  backup: { icon: ArchiveRestore, tier: "RECOVERY" },
};

function Node({ node, index }: { node: ArchitectureNode; index: number }) {
  const { icon: Icon, tier } = META[node.type];
  return (
    <div
      className={`arch-node${node.multiple ? " is-multiple" : ""}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <Icon size={18} strokeWidth={1.5} aria-hidden="true" className="arch-icon" />
      <div className="arch-text">
        <span className="mono">{tier}</span>
        <strong>{node.label}</strong>
        {node.detail && <em>{node.detail}</em>}
      </div>
      {node.multiple && (
        <span className="arch-stack" aria-label="Multiple instances">
          <i />
          <i />
          <i />
        </span>
      )}
    </div>
  );
}

/**
 * Marketing-level architecture diagram rendered from structured data.
 * "flow" nodes form the request path (an Auto Scaling Group directly followed
 * by compute is drawn as a group containing it), "data" nodes sit beside the
 * path, and "ops" nodes describe delivery and operations.
 */
export default function ArchitectureDiagram({
  nodes,
  caption = "PRODUCTION ARCHITECTURE",
}: {
  nodes: ArchitectureNode[];
  caption?: string;
}) {
  const flow = nodes.filter((n) => (n.group ?? "flow") === "flow");
  const data = nodes.filter((n) => n.group === "data");
  const ops = nodes.filter((n) => n.group === "ops");
  if (!flow.length) return null;

  const items: { key: string; group?: ArchitectureNode; node: ArchitectureNode }[] = [];
  for (let i = 0; i < flow.length; i++) {
    const node = flow[i];
    const next = flow[i + 1];
    if (node.type === "autoscaling" && next && (next.type === "ec2" || next.type === "ecs")) {
      items.push({ key: `${i}`, group: node, node: next });
      i++;
    } else {
      items.push({ key: `${i}`, node });
    }
  }

  let order = 0;
  return (
    <figure className="arch" data-reveal>
      <figcaption className="arch-caption mono">{caption}</figcaption>
      <ol className="arch-flow" aria-label="Request path, top to bottom">
        {items.map(({ key, group, node }) => (
          <li key={key}>
            {group ? (
              <div className="arch-group" style={{ "--i": order++ } as React.CSSProperties}>
                <div className="arch-group-label">
                  <Layers size={15} strokeWidth={1.5} aria-hidden="true" />
                  <span className="mono">{META[group.type].tier}</span>
                  <strong>{group.label}</strong>
                  {group.detail && <em>{group.detail}</em>}
                </div>
                <Node node={node} index={order++} />
              </div>
            ) : (
              <Node node={node} index={order++} />
            )}
          </li>
        ))}
      </ol>
      {data.length > 0 && (
        <ul className="arch-data" aria-label="Data services">
          {data.map((node) => (
            <li key={node.label}>
              <Node node={node} index={order++} />
            </li>
          ))}
        </ul>
      )}
      {ops.length > 0 && (
        <ul className="arch-ops" aria-label="Delivery and operations">
          {ops.map((node) => {
            const { icon: Icon, tier } = META[node.type];
            return (
              <li key={node.label}>
                <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <span className="mono">{tier}</span>
                  <strong>{node.label}</strong>
                  {node.detail && <p>{node.detail}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </figure>
  );
}
