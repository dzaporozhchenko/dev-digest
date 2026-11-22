import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { FindingRecord, Severity } from "@devdigest/shared";
import messages from "../../../../../../../../messages/en/prReview.json";

const mutate = vi.fn();
vi.mock("../../../../../../../lib/hooks/reviews", () => ({
  useFindingAction: () => ({ mutate, isPending: false }),
}));

import { FindingsPanel } from "./FindingsPanel";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  mutate.mockClear();
});

function finding(
  id: string,
  title: string,
  severity: Severity,
  confidence: number,
  extra: Partial<FindingRecord> = {},
): FindingRecord {
  return {
    id,
    severity,
    category: "security",
    title,
    file: "src/config.ts",
    start_line: 11,
    end_line: 11,
    rationale: "Rationale.",
    suggestion: null,
    confidence,
    kind: "finding",
    trifecta_components: null,
    evidence: null,
    review_id: "r1",
    accepted_at: null,
    dismissed_at: null,
    ...extra,
  };
}

const SECRET = finding("f1", "Hardcoded secret", "CRITICAL", 0.95);
const FINDINGS: FindingRecord[] = [
  SECRET,
  finding("f2", "SQL injection", "CRITICAL", 0.4),
  finding("f3", "Unbounded loop", "WARNING", 0.9),
];

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const chip = (name: RegExp) => screen.getByRole("button", { name });
const titles = () => ["Hardcoded secret", "SQL injection", "Unbounded loop"].filter((t) => screen.queryByText(t));

describe("FindingsPanel (smoke)", () => {
  it("renders the toolbar + a finding card", () => {
    renderWithIntl(<FindingsPanel findings={[SECRET]} prId="pr1" />);
    expect(screen.getByText("Hide low confidence")).toBeInTheDocument();
    expect(screen.getByText("Hardcoded secret")).toBeInTheDocument();
  });

  it("shows the empty state when nothing matches", () => {
    renderWithIntl(<FindingsPanel findings={[]} prId="pr1" />);
    expect(screen.getByText("No findings match")).toBeInTheDocument();
  });
});

describe("FindingsPanel severity filter", () => {
  it("shows a count per severity that matches the list", () => {
    renderWithIntl(<FindingsPanel findings={FINDINGS} prId="pr1" />);
    expect(chip(/2 CRITICAL/)).toBeInTheDocument();
    expect(chip(/1 WARNING/)).toBeInTheDocument();
    expect(chip(/0 SUGGESTION/)).toBeInTheDocument();
    expect(titles()).toEqual(["Hardcoded secret", "SQL injection", "Unbounded loop"]);
  });

  it("filters to one severity, switches, and clears on a second click", () => {
    renderWithIntl(<FindingsPanel findings={FINDINGS} prId="pr1" />);

    fireEvent.click(chip(/CRITICAL/));
    expect(titles()).toEqual(["Hardcoded secret", "SQL injection"]);
    expect(chip(/CRITICAL/)).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(chip(/WARNING/));
    expect(titles()).toEqual(["Unbounded loop"]);
    expect(chip(/WARNING/)).toHaveAttribute("aria-pressed", "true");
    expect(chip(/CRITICAL/)).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(chip(/WARNING/));
    expect(titles()).toEqual(["Hardcoded secret", "SQL injection", "Unbounded loop"]);
    expect(screen.queryAllByRole("button", { pressed: true, name: /CRITICAL|WARNING|SUGGESTION/ })).toHaveLength(0);
  });

  it("respects Hide low confidence together with the severity filter", () => {
    renderWithIntl(<FindingsPanel findings={FINDINGS} prId="pr1" />);
    fireEvent.click(screen.getByRole("switch"));
    // Counts follow the confidence toggle…
    expect(chip(/1 CRITICAL/)).toBeInTheDocument();

    fireEvent.click(chip(/CRITICAL/));
    // …and the list keeps only findings passing both conditions.
    expect(titles()).toEqual(["Hardcoded secret"]);
  });

  it("shows the empty state when the selected severity has no findings", () => {
    renderWithIntl(<FindingsPanel findings={FINDINGS} prId="pr1" />);
    fireEvent.click(chip(/SUGGESTION/));
    expect(titles()).toEqual([]);
    expect(screen.getByText("No findings match")).toBeInTheDocument();
  });

  it("filters locally — no request and no finding action", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderWithIntl(<FindingsPanel findings={FINDINGS} prId="pr1" />);
    fireEvent.click(chip(/CRITICAL/));
    fireEvent.click(chip(/CRITICAL/));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("keeps counts in step with the list after a finding is dismissed", () => {
    const { rerender } = renderWithIntl(<FindingsPanel findings={FINDINGS} prId="pr1" />);
    fireEvent.click(chip(/CRITICAL/));
    // The reviews query refetches after accept/dismiss and passes new findings down.
    const next = FINDINGS.map((f) => (f.id === "f2" ? { ...f, dismissed_at: "2026-11-22T00:00:00Z" } : f));
    rerender(
      <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
        <FindingsPanel findings={next} prId="pr1" />
      </NextIntlClientProvider>,
    );
    expect(chip(/2 CRITICAL/)).toHaveAttribute("aria-pressed", "true");
    expect(titles()).toEqual(["Hardcoded secret", "SQL injection"]);
  });
});
