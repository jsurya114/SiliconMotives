"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Save,
  Star,
  Trash2,
} from "lucide-react";
import { FieldInput, type Field } from "./fields";
import {
  deleteRow,
  listRows,
  reorder,
  saveRow,
  updateRow,
  type CollectionTable,
  type Row,
} from "../lib/data";

export interface CollectionConfig {
  table: CollectionTable;
  title: string;
  singular: string;
  description: string;
  /** Columns to load for list + edit (never include ip_hash). */
  columns: string;
  titleField: string;
  subtitle?: (row: Row) => string;
  /** How a row is published: a boolean column, or a status column. */
  publish: { field: string; on: unknown; off: unknown; onLabel?: string; offLabel?: string };
  featured?: boolean;
  /** Public URL for a published row, for the "View" link. */
  viewPath?: (row: Row) => string | null;
  /** Generate the slug from this field when creating. */
  slugFrom?: string;
  defaults: Record<string, unknown>;
  fields: Field[];
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

const btn = "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
const iconBtn = "p-2 rounded-md text-gray-500 hover:text-navy hover:bg-gray-100 disabled:opacity-30";

export default function CollectionManager({ config }: { config: CollectionConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<{ id: string | null; values: Record<string, unknown> } | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  const isPublished = useCallback((row: Row) => row[config.publish.field] === config.publish.on, [config]);

  const refresh = useCallback(async () => {
    try {
      setRows(await listRows(config.table, config.columns));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const run = async (action: () => Promise<unknown>) => {
    try {
      setError("");
      await action();
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const startEdit = (row?: Row) => {
    setSlugTouched(!!row);
    setEditing({ id: row?.id ?? null, values: row ? { ...row } : { ...config.defaults, sort_order: rows.length } });
    window.scrollTo({ top: 0 });
  };

  const setValue = (name: string, value: unknown) =>
    setEditing((prev) => {
      if (!prev) return prev;
      const values = { ...prev.values, [name]: value };
      if (config.slugFrom === name && !slugTouched) values.slug = slugify(String(value ?? ""));
      if (name === "slug") setSlugTouched(true);
      return { ...prev, values };
    });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {};
      for (const field of config.fields) {
        if (field.type === "section") continue;
        let v = editing.values[field.name];
        if ((field.type === "date" || field.type === "relation" || field.type === "image") && v === "") v = null;
        if (field.type === "text" || field.type === "textarea" || field.type === "url") v = String(v ?? "").trim();
        payload[field.name] = v;
      }
      await saveRow(config.table, editing.id, payload);
      setEditing(null);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const moveRow = (index: number, delta: number) => {
    const ids = rows.map((r) => r.id);
    const [id] = ids.splice(index, 1);
    ids.splice(index + delta, 0, id);
    run(() => reorder(config.table, ids));
  };

  const header = (
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-navy">{editing ? (editing.id ? `Edit ${config.singular}` : `New ${config.singular}`) : config.title}</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">{config.description}</p>
        </div>
        {!editing && (
          <button onClick={() => startEdit()} className={`${btn} bg-navy text-white hover:bg-navy-light`}>
            <Plus size={16} /> Add {config.singular}
          </button>
        )}
      </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <Loader2 className="animate-spin text-navy" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {header}
      {error && (
        <div role="alert" className="m-6 mb-0 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      {editing ? (
        <form onSubmit={submit} className="p-6 space-y-6">
          {config.fields.map((field, i) =>
            field.type === "section" ? (
              <div key={`s-${i}`} className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wide">{field.label}</h3>
                {field.help && <p className="text-xs text-gray-500 mt-1">{field.help}</p>}
              </div>
            ) : (
              <FieldInput
                key={field.name}
                field={field}
                value={editing.values[field.name]}
                onChange={(v) => setValue(field.name, v)}
              />
            ),
          )}
          <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(null)} className={`${btn} text-gray-600 hover:bg-gray-100`}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className={`${btn} bg-navy text-white hover:bg-navy-light disabled:opacity-60`}>
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save
            </button>
          </div>
        </form>
      ) : rows.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No {config.title.toLowerCase()} yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {rows.map((row, i) => {
            const published = isPublished(row);
            const viewUrl = published ? config.viewPath?.(row) : null;
            return (
              <li key={row.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                <div className="flex flex-col">
                  <button className={iconBtn} aria-label="Move up" disabled={i === 0} onClick={() => moveRow(i, -1)}>
                    <ArrowUp size={14} />
                  </button>
                  <button className={iconBtn} aria-label="Move down" disabled={i === rows.length - 1} onClick={() => moveRow(i, 1)}>
                    <ArrowDown size={14} />
                  </button>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-navy">{String(row[config.titleField] ?? "Untitled")}</strong>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {published ? config.publish.onLabel ?? "Published" : String(row[config.publish.field] === config.publish.off ? config.publish.offLabel ?? "Draft" : row[config.publish.field])}
                    </span>
                    {config.featured && row.featured === true && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Featured</span>
                    )}
                  </div>
                  {config.subtitle && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{config.subtitle(row)}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className={iconBtn}
                    title={published ? "Unpublish" : "Publish"}
                    aria-label={published ? "Unpublish" : "Publish"}
                    onClick={() =>
                      run(() =>
                        updateRow(config.table, row.id, {
                          [config.publish.field]: published ? config.publish.off : config.publish.on,
                        }),
                      )
                    }
                  >
                    {published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  {config.featured && (
                    <button
                      className={`${iconBtn} ${row.featured ? "text-amber-500" : ""}`}
                      title={row.featured ? "Remove from homepage" : "Feature on homepage"}
                      aria-label={row.featured ? "Unfeature" : "Feature"}
                      onClick={() => run(() => updateRow(config.table, row.id, { featured: !row.featured }))}
                    >
                      <Star size={16} fill={row.featured ? "currentColor" : "none"} />
                    </button>
                  )}
                  {viewUrl && (
                    <a className={iconBtn} href={viewUrl} target="_blank" rel="noopener noreferrer" title="View on site" aria-label="View on site">
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button className={iconBtn} title="Edit" aria-label="Edit" onClick={() => startEdit(row)}>
                    <Pencil size={16} />
                  </button>
                  <button
                    className={`${iconBtn} hover:text-red-600`}
                    title="Delete"
                    aria-label="Delete"
                    onClick={() => {
                      if (window.confirm(`Delete “${String(row[config.titleField] ?? "this item")}”? This cannot be undone.`))
                        run(() => deleteRow(config.table, row.id));
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
