import type { FindingRecord, Severity } from "@devdigest/shared";
import { FILTER_SEVERITIES, LOW_CONFIDENCE_THRESHOLD, SEVERITY_ORDER } from "./constants";

/** Findings that survive the "hide low confidence" toggle. */
function confidenceFiltered(findings: FindingRecord[], hideLow: boolean): FindingRecord[] {
  return hideLow ? findings.filter((f) => f.confidence >= LOW_CONFIDENCE_THRESHOLD) : findings;
}

/** Optionally drop low-confidence findings, keep only one severity, and sort by severity. */
export function visibleFindings(
  findings: FindingRecord[],
  hideLow: boolean,
  severity: Severity | null = null,
): FindingRecord[] {
  let shown = confidenceFiltered(findings, hideLow);
  if (severity) shown = shown.filter((f) => f.severity === severity);
  return [...shown].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9),
  );
}

/** Findings per severity after the confidence toggle but before the severity filter,
 *  so each count equals what the list shows once that severity is selected. */
export function severityCounts(
  findings: FindingRecord[],
  hideLow: boolean,
): Record<Severity, number> {
  const counts = Object.fromEntries(FILTER_SEVERITIES.map((sev) => [sev, 0])) as Record<
    Severity,
    number
  >;
  for (const f of confidenceFiltered(findings, hideLow)) counts[f.severity] += 1;
  return counts;
}
