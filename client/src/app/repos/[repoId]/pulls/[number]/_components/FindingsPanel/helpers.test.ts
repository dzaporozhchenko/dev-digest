import { describe, it, expect } from "vitest";
import type { FindingRecord, Severity } from "@devdigest/shared";
import { severityCounts, visibleFindings } from "./helpers";

function finding(id: string, severity: Severity, confidence: number): FindingRecord {
  return {
    id,
    severity,
    category: "bug",
    title: id,
    file: "src/a.ts",
    start_line: 1,
    end_line: 1,
    rationale: "",
    suggestion: null,
    confidence,
    kind: "finding",
    trifecta_components: null,
    evidence: null,
    review_id: "r1",
    accepted_at: null,
    dismissed_at: null,
  };
}

const FINDINGS = [
  finding("s1", "SUGGESTION", 0.9),
  finding("c1", "CRITICAL", 0.9),
  finding("w1", "WARNING", 0.9),
  finding("c2-low", "CRITICAL", 0.3),
  finding("w2-low", "WARNING", 0.5),
];

const ids = (fs: FindingRecord[]) => fs.map((f) => f.id);

describe("severityCounts", () => {
  it("counts every finding per severity", () => {
    expect(severityCounts(FINDINGS, false)).toEqual({ CRITICAL: 2, WARNING: 2, SUGGESTION: 1 });
  });

  it("drops low-confidence findings when hideLow is on", () => {
    expect(severityCounts(FINDINGS, true)).toEqual({ CRITICAL: 1, WARNING: 1, SUGGESTION: 1 });
  });

  it("reports 0 for severities with no findings", () => {
    expect(severityCounts([], false)).toEqual({ CRITICAL: 0, WARNING: 0, SUGGESTION: 0 });
  });

  it("matches the length of the list for that severity", () => {
    for (const hideLow of [false, true]) {
      const counts = severityCounts(FINDINGS, hideLow);
      for (const sev of ["CRITICAL", "WARNING", "SUGGESTION"] as const) {
        expect(visibleFindings(FINDINGS, hideLow, sev)).toHaveLength(counts[sev]);
      }
    }
  });
});

describe("visibleFindings", () => {
  it("returns everything sorted by severity when no filter is set", () => {
    expect(ids(visibleFindings(FINDINGS, false))).toEqual(["c1", "c2-low", "w1", "w2-low", "s1"]);
  });

  it("keeps only the selected severity", () => {
    expect(ids(visibleFindings(FINDINGS, false, "WARNING"))).toEqual(["w1", "w2-low"]);
  });

  it("applies severity AND hide-low-confidence together", () => {
    expect(ids(visibleFindings(FINDINGS, true, "CRITICAL"))).toEqual(["c1"]);
  });
});
