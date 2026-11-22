import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { Severity } from "@devdigest/shared";
import messages from "../../../../../../../../messages/en/prReview.json";
import { SeverityFilter } from "./SeverityFilter";

afterEach(cleanup);

const SEVERITIES: readonly Severity[] = ["CRITICAL", "WARNING", "SUGGESTION"];
const COUNTS = { CRITICAL: 3, WARNING: 5, SUGGESTION: 0 };

function renderFilter(value: Severity | null, onChange = vi.fn()) {
  render(
    <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
      <SeverityFilter severities={SEVERITIES} counts={COUNTS} value={value} onChange={onChange} />
    </NextIntlClientProvider>,
  );
  return onChange;
}

const chip = (name: RegExp) => screen.getByRole("button", { name });

describe("SeverityFilter", () => {
  it("renders one labelled counter per severity, including zero", () => {
    renderFilter(null);
    expect(screen.getByRole("group", { name: "Filter findings by severity" })).toBeInTheDocument();
    expect(chip(/3 CRITICAL/)).toBeInTheDocument();
    expect(chip(/5 WARNING/)).toBeInTheDocument();
    expect(chip(/0 SUGGESTION/)).toBeInTheDocument();
  });

  it("marks no chip as pressed when the filter is off", () => {
    renderFilter(null);
    for (const b of screen.getAllByRole("button")) expect(b).toHaveAttribute("aria-pressed", "false");
  });

  it("marks only the selected chip as pressed", () => {
    renderFilter("WARNING");
    expect(chip(/WARNING/)).toHaveAttribute("aria-pressed", "true");
    expect(chip(/CRITICAL/)).toHaveAttribute("aria-pressed", "false");
    expect(chip(/SUGGESTION/)).toHaveAttribute("aria-pressed", "false");
  });

  it("selects a severity on click", () => {
    const onChange = renderFilter(null);
    fireEvent.click(chip(/CRITICAL/));
    expect(onChange).toHaveBeenCalledWith("CRITICAL");
  });

  it("switches to another severity when one is already active", () => {
    const onChange = renderFilter("CRITICAL");
    fireEvent.click(chip(/WARNING/));
    expect(onChange).toHaveBeenCalledWith("WARNING");
  });

  it("clears the filter when the active chip is clicked again", () => {
    const onChange = renderFilter("CRITICAL");
    fireEvent.click(chip(/CRITICAL/));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
