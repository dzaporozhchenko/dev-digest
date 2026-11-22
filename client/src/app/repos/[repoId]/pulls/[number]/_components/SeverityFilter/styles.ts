import type { CSSProperties } from "react";

/** Visual state of one severity chip. */
export type ChipState = "idle" | "active" | "muted";

/** Co-located styles for SeverityFilter. Colours come from the SEV map / CSS tokens. */
export const s = {
  group: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  } satisfies CSSProperties,
  separator: {
    color: "var(--text-muted)",
    fontSize: 12,
    userSelect: "none",
  } satisfies CSSProperties,
  chip: (state: ChipState, sevColor: string, sevBg: string): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "3px 9px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: "background .15s, color .15s, border-color .15s, opacity .15s",
    border: `1px solid ${state === "active" ? sevColor : "var(--border)"}`,
    background: state === "active" ? sevBg : "transparent",
    color:
      state === "active"
        ? sevColor
        : state === "muted"
          ? "var(--text-muted)"
          : "var(--text-secondary)",
    opacity: state === "muted" ? 0.6 : 1,
  }),
  icon: (state: ChipState, sevColor: string): CSSProperties => ({
    // Idle chips keep the severity hue on the icon only; a muted chip greys it out.
    color: state === "muted" ? "var(--text-muted)" : sevColor,
    flexShrink: 0,
  }),
} as const;
