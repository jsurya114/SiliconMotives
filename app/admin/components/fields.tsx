"use client";
import { useEffect, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { listOptions } from "../lib/data";
import { ARCHITECTURE_TYPES } from "@/app/lib/content-types";

// ── Field definitions ───────────────────────────────────────────────────
type Base = { name: string; label: string; help?: string; required?: boolean };
export type Field =
  | (Base & { type: "text" | "url" | "slug"; max?: number; placeholder?: string })
  | (Base & { type: "textarea"; max?: number; rows?: number; placeholder?: string })
  | (Base & { type: "number" | "date" })
  | (Base & { type: "toggle" })
  | (Base & { type: "tags"; placeholder?: string })
  | (Base & { type: "image"; aspect?: number; crop?: boolean; folder: string })
  | (Base & { type: "gallery"; folder: string })
  | (Base & { type: "select"; options: { value: string; label: string }[] })
  | (Base & { type: "relation"; table: "projects" | "clients" })
  | (Base & { type: "suggest"; suggestions: string[]; max?: number })
  | (Base & { type: "metrics" })
  | (Base & { type: "architecture" })
  | { type: "section"; label: string; name?: undefined; help?: string };

const input =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy";
const small = "text-xs text-gray-500 mt-1.5";

function Label({ field }: { field: Base }) {
  return (
    <span className="block text-sm font-medium text-navy mb-1.5">
      {field.label}
      {field.required && <span className="text-red-600"> *</span>}
    </span>
  );
}

// ── Tag input (string arrays) ───────────────────────────────────────────
function Tags({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange(Array.from(new Set([...value, ...parts])));
    setDraft("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };
  return (
    <div className={`${input} flex flex-wrap gap-1.5 items-center min-h-[44px]`}>
      {value.map((tag, i) => (
        <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-navy text-xs px-2 py-1 rounded">
          {tag}
          <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[140px] outline-none text-sm"
        value={draft}
        placeholder={value.length ? "" : placeholder ?? "Type and press Enter"}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
      />
    </div>
  );
}

// ── Relation select ─────────────────────────────────────────────────────
function Relation({ table, value, onChange }: { table: "projects" | "clients"; value: string; onChange: (v: string) => void }) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    listOptions(table).then(setOptions).catch(() => setOptions([]));
  }, [table]);
  return (
    <select className={input} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">None</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ── Gallery ─────────────────────────────────────────────────────────────
function Gallery({ value, onChange, folder }: { value: string[]; onChange: (v: string[]) => void; folder: string }) {
  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {value.map((src, i) => (
            <li key={src} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between p-1.5 bg-black/50 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                <button type="button" aria-label="Move left" disabled={i === 0} onClick={() => onChange(move(value, i, -1))} className="text-white p-1 disabled:opacity-30">
                  <ArrowUp size={14} className="-rotate-90" />
                </button>
                <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-white p-1">
                  <Trash2 size={14} />
                </button>
                <button type="button" aria-label="Move right" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, 1))} className="text-white p-1 disabled:opacity-30">
                  <ArrowDown size={14} className="-rotate-90" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {value.length < 12 && (
        <ImageUploader
          key={value.length}
          label="Add screenshot"
          value={null}
          disableCrop
          folder={folder}
          onChange={(url) => url && onChange([...value, url])}
        />
      )}
    </div>
  );
}

function move<T>(list: T[], i: number, delta: number) {
  const next = [...list];
  const [item] = next.splice(i, 1);
  next.splice(i + delta, 0, item);
  return next;
}

// ── Metrics rows ────────────────────────────────────────────────────────
type Metric = { value: string; label: string };
function Metrics({ value, onChange }: { value: Metric[]; onChange: (v: Metric[]) => void }) {
  const set = (i: number, patch: Partial<Metric>) => onChange(value.map((m, j) => (j === i ? { ...m, ...patch } : m)));
  return (
    <div className="space-y-2">
      {value.map((m, i) => (
        <div key={i} className="flex gap-2">
          <input className={`${input} w-32`} placeholder="5,000+" maxLength={30} value={m.value} onChange={(e) => set(i, { value: e.target.value })} />
          <input className={input} placeholder="Concurrent users" maxLength={80} value={m.label} onChange={(e) => set(i, { label: e.target.value })} />
          <button type="button" aria-label="Remove metric" onClick={() => onChange(value.filter((_, j) => j !== i))} className="p-2 text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      {value.length < 8 && (
        <button type="button" onClick={() => onChange([...value, { value: "", label: "" }])} className="text-sm font-medium text-navy inline-flex items-center gap-1">
          <Plus size={14} /> Add metric
        </button>
      )}
    </div>
  );
}

// ── Architecture components ─────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  users: "Users",
  dns: "DNS (e.g. Route 53)",
  cdn: "CDN / edge (e.g. CloudFront)",
  alb: "Load balancer (ALB)",
  autoscaling: "Auto Scaling Group",
  ec2: "EC2 instances",
  ecs: "Containers (ECS)",
  api: "API",
  app: "Application",
  database: "Database (e.g. RDS)",
  cache: "Cache",
  queue: "Queue",
  storage: "Object storage (e.g. S3)",
  cicd: "CI/CD",
  monitoring: "Monitoring",
  backup: "Backups",
};
type ArchNode = { type: string; label: string; detail?: string; group?: string; multiple?: boolean };

function Architecture({ value, onChange }: { value: ArchNode[]; onChange: (v: ArchNode[]) => void }) {
  const set = (i: number, patch: Partial<ArchNode>) => onChange(value.map((n, j) => (j === i ? { ...n, ...patch } : n)));
  return (
    <div className="space-y-2">
      <p className={small}>
        Components are drawn top to bottom in this order. “Request path” items form the main flow; an
        Auto Scaling Group directly followed by EC2/containers is drawn as a group. Never include IPs,
        ports, hostnames or other internal details.
      </p>
      {value.map((n, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-start p-3 border border-gray-200 rounded-lg bg-gray-50">
          <select className={`${input} col-span-12 md:col-span-3`} value={n.type} onChange={(e) => set(i, { type: e.target.value })} aria-label="Component type">
            {ARCHITECTURE_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          <input className={`${input} col-span-12 md:col-span-3`} placeholder="Label" maxLength={80} value={n.label} onChange={(e) => set(i, { label: e.target.value })} aria-label="Label" />
          <input className={`${input} col-span-12 md:col-span-3`} placeholder="Short description" maxLength={160} value={n.detail ?? ""} onChange={(e) => set(i, { detail: e.target.value })} aria-label="Description" />
          <select className={`${input} col-span-6 md:col-span-2`} value={n.group ?? "flow"} onChange={(e) => set(i, { group: e.target.value })} aria-label="Position">
            <option value="flow">Request path</option>
            <option value="data">Data (beside path)</option>
            <option value="ops">Operations</option>
          </select>
          <div className="col-span-6 md:col-span-1 flex justify-end gap-1">
            <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => onChange(move(value, i, -1))} className="p-2 disabled:opacity-30">
              <ArrowUp size={14} />
            </button>
            <button type="button" aria-label="Move down" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, 1))} className="p-2 disabled:opacity-30">
              <ArrowDown size={14} />
            </button>
            <button type="button" aria-label="Remove component" onClick={() => onChange(value.filter((_, j) => j !== i))} className="p-2 text-red-600">
              <Trash2 size={14} />
            </button>
          </div>
          <label className="col-span-12 text-xs text-gray-600 flex items-center gap-2">
            <input type="checkbox" checked={!!n.multiple} onChange={(e) => set(i, { multiple: e.target.checked })} />
            Show as multiple instances
          </label>
        </div>
      ))}
      {value.length < 20 && (
        <button type="button" onClick={() => onChange([...value, { type: "api", label: "", group: "flow" }])} className="text-sm font-medium text-navy inline-flex items-center gap-1">
          <Plus size={14} /> Add component
        </button>
      )}
    </div>
  );
}

// ── Field renderer ──────────────────────────────────────────────────────
export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Exclude<Field, { type: "section" }>;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const id = `f-${field.name}`;
  const text = (value as string) ?? "";
  const control = (() => {
    switch (field.type) {
      case "text":
      case "url":
      case "slug":
        return (
          <input
            id={id}
            className={input}
            type={field.type === "url" ? "url" : "text"}
            value={text}
            required={field.required}
            maxLength={field.max}
            placeholder={field.placeholder ?? (field.type === "url" ? "https://" : undefined)}
            pattern={field.type === "slug" ? "[a-z0-9]+(-[a-z0-9]+)*" : undefined}
            title={field.type === "slug" ? "Lowercase letters, numbers and single hyphens" : undefined}
            onChange={(e) => onChange(field.type === "slug" ? e.target.value.toLowerCase() : e.target.value)}
          />
        );
      case "textarea":
        return (
          <textarea
            id={id}
            className={input}
            rows={field.rows ?? 4}
            value={text}
            required={field.required}
            maxLength={field.max}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "number":
        return <input id={id} className={`${input} w-32`} type="number" value={String(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))} />;
      case "date":
        return <input id={id} className={`${input} w-48`} type="date" value={text} onChange={(e) => onChange(e.target.value)} />;
      case "toggle":
        return (
          <label className="inline-flex items-center gap-2 text-sm text-navy cursor-pointer">
            <input id={id} type="checkbox" className="w-4 h-4" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
            {field.help}
          </label>
        );
      case "tags":
        return <Tags value={(value as string[]) ?? []} onChange={onChange} placeholder={field.placeholder} />;
      case "image":
        return (
          <ImageUploader
            label=""
            value={(value as string) || null}
            onChange={(url) => onChange(url ?? "")}
            disableCrop={!field.crop}
            aspect={field.aspect}
            folder={field.folder}
          />
        );
      case "gallery":
        return <Gallery value={(value as string[]) ?? []} onChange={onChange} folder={field.folder} />;
      case "select":
        return (
          <select id={id} className={input} value={text} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
      case "relation":
        return <Relation table={field.table} value={text} onChange={onChange} />;
      case "suggest":
        return (
          <>
            <input id={id} className={input} list={`${id}-list`} value={text} required={field.required} maxLength={field.max} onChange={(e) => onChange(e.target.value)} />
            <datalist id={`${id}-list`}>
              {field.suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </>
        );
      case "metrics":
        return <Metrics value={(value as Metric[]) ?? []} onChange={onChange} />;
      case "architecture":
        return <Architecture value={(value as ArchNode[]) ?? []} onChange={onChange} />;
    }
  })();

  return (
    <div>
      {field.type !== "toggle" && (
        <label htmlFor={id}>
          <Label field={field} />
        </label>
      )}
      {control}
      {field.help && field.type !== "toggle" && <p className={small}>{field.help}</p>}
    </div>
  );
}
