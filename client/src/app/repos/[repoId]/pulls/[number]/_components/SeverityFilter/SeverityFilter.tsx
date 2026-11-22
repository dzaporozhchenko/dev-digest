/* SeverityFilter — single-select severity chips ("3 CRITICAL · 5 WARNING · 2 SUGGESTION").
   Clicking a chip selects that severity; clicking the active chip clears the filter.
   Purely presentational: counts and selection are owned by the parent. */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Icon, SEV } from "@devdigest/ui";
import type { Severity } from "@devdigest/shared";
import { s, type ChipState } from "./styles";

export function SeverityFilter({
  severities,
  counts,
  value,
  onChange,
}: {
  /** Severities to render, in display order. */
  severities: readonly Severity[];
  counts: Record<Severity, number>;
  /** The selected severity, or null when the filter is off. */
  value: Severity | null;
  onChange: (next: Severity | null) => void;
}) {
  const t = useTranslations("prReview");

  return (
    <div role="group" aria-label={t("panel.severityFilterLabel")} style={s.group}>
      {severities.map((sev, i) => {
        const meta = SEV[sev];
        const SevIcon = Icon[meta.icon];
        const state: ChipState = value == null ? "idle" : value === sev ? "active" : "muted";
        return (
          <React.Fragment key={sev}>
            {i > 0 && (
              <span aria-hidden="true" style={s.separator}>
                {t("panel.severityFilterSeparator")}
              </span>
            )}
            <button
              type="button"
              aria-pressed={value === sev}
              data-severity={sev}
              onClick={() => onChange(value === sev ? null : sev)}
              style={s.chip(state, meta.c, meta.bg)}
            >
              <SevIcon size={12.5} style={s.icon(state, meta.c)} />
              <span className="tnum">{t(`panel.severity.${sev}`, { count: counts[sev] })}</span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
