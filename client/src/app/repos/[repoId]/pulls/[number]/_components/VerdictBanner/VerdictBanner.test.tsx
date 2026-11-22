import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../../../../../messages/en/prReview.json";
import costMessages from "../../../../../../../../messages/en/cost.json";
import { VerdictBanner } from "./VerdictBanner";

afterEach(cleanup);

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ prReview: messages, cost: costMessages }}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("VerdictBanner (smoke)", () => {
  it("shows verdict label + score + finding/blocker counts", () => {
    renderWithIntl(
      <VerdictBanner
        verdict="request_changes"
        summary="Hardcoded secret introduced."
        score={42}
        findingsCount={1}
        blockers={1}
        agentName="Security Reviewer"
      />,
    );
    expect(screen.getByText("Request changes")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText(/1 findings · 1 blockers/)).toBeInTheDocument();
  });

  it("shows the run cost and token pair when given", () => {
    renderWithIntl(
      <VerdictBanner
        verdict="request_changes"
        summary="Hardcoded secret introduced."
        score={42}
        findingsCount={1}
        blockers={1}
        costUsd={0.0013}
        tokensIn={9119}
        tokensOut={1240}
      />,
    );
    expect(screen.getByText("$0.0013")).toBeInTheDocument();
    expect(screen.getByText("9.1K→1.2K")).toBeInTheDocument();
  });

  it("hides the cost row when the cost is unknown", () => {
    renderWithIntl(
      <VerdictBanner
        verdict="approve"
        summary={null}
        score={88}
        findingsCount={0}
        blockers={0}
        costUsd={null}
      />,
    );
    expect(screen.queryByTitle("Cost of this review")).not.toBeInTheDocument();
    expect(screen.queryByText("—")).not.toBeInTheDocument();
  });
});
