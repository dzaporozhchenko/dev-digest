/* CostBadge — the real USD cost of one review run, ported from the design's
   primitives.jsx. Used on the PR list, the verdict banner, each review-run
   accordion header, and the PR timeline. Renders an em dash when the cost is
   unknown (failed run, or a model missing from the price book). */
"use client";

import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { formatCost, NO_COST } from "./helpers";

export function CostBadge({
  usd,
  tokens,
  size = "sm",
  muted = false,
}: {
  usd: number | null | undefined;
  /** Optional in→out token suffix, e.g. `9.1K→1.2K` (see `formatTokenPair`). */
  tokens?: string;
  size?: "sm" | "lg";
  muted?: boolean;
}) {
  const t = useTranslations("cost");
  const fontSize = size === "lg" ? 13 : 11.5;

  if (usd == null) {
    return (
      <span className="mono" style={{ fontSize: size === "lg" ? 13 : 12, color: "var(--text-muted)" }}>
        {NO_COST}
      </span>
    );
  }

  const wrap: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize,
    fontWeight: 500,
    color: muted ? "var(--text-muted)" : "var(--text-secondary)",
  };

  return (
    <span className="mono tnum" title={t("title")} style={wrap}>
      {formatCost(usd)}
      {tokens && <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>{tokens}</span>}
    </span>
  );
}

export default CostBadge;
