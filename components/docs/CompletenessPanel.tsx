"use client";

import { useState } from "react";
import type { CompletenessMeta } from "@/lib/docs";
import clsx from "clsx";

const statusColors: Record<string, string> = {
  Thin: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Usable: "bg-sage-100 text-sage-800 dark:bg-sage-900/40 dark:text-sage-300",
  Solid: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

interface CompletenessPanelProps {
  meta: CompletenessMeta;
}

export function CompletenessPanel({ meta }: CompletenessPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 rounded-xl border border-paper-200 bg-paper-100 dark:border-ink-800 dark:bg-ink-900">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-ink-700 dark:text-paper-300">
            Completeness
          </span>
          <span
            className={clsx(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              statusColors[meta.status]
            )}
          >
            {meta.status}
          </span>
          <span className="font-mono text-xs text-ink-500 dark:text-paper-500">
            {meta.score}/100
          </span>
        </div>
        <span className="text-ink-400 dark:text-paper-500" aria-hidden="true">
          {open ? "▾" : "▸"}
        </span>
      </button>

      {open && (
        <div className="border-t border-paper-200 px-4 py-4 dark:border-ink-800">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-sage-400">
                Done
              </h4>
              <ul className="space-y-1 text-sm text-ink-600 dark:text-paper-400">
                {meta.done.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-sage-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-terracotta-600 dark:text-terracotta-400">
                Remaining
              </h4>
              <ul className="space-y-1 text-sm text-ink-600 dark:text-paper-400">
                {meta.remaining.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-terracotta-500">○</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-paper-500">
                Out of scope
              </h4>
              <ul className="space-y-1 text-sm text-ink-500 dark:text-paper-500">
                {meta.outOfScope.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
