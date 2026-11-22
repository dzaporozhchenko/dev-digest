import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../messages/en/cost.json";
import { CostBadge } from "./CostBadge";
import { formatCost, formatTokenPair } from "./helpers";

afterEach(cleanup);

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ cost: messages }}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("formatCost", () => {
  it("keeps four decimals under a cent so real runs are not $0.00", () => {
    // A typical review run costs well under a cent; two decimals would hide it.
    expect(formatCost(0.0013)).toBe("$0.0013");
    expect(formatCost(0.0014)).toBe("$0.0014");
  });

  it("uses three decimals between a cent and a dollar", () => {
    expect(formatCost(0.5)).toBe("$0.500");
  });

  it("uses two decimals from a dollar up", () => {
    expect(formatCost(2.5)).toBe("$2.50");
  });

  it("renders an em dash for unknown cost", () => {
    expect(formatCost(null)).toBe("—");
    expect(formatCost(undefined)).toBe("—");
    expect(formatCost(Number.NaN)).toBe("—");
  });
});

describe("formatTokenPair", () => {
  it("formats an in→out pair", () => {
    expect(formatTokenPair(9119, 1240)).toBe("9.1K→1.2K");
  });

  it("returns undefined when either side is missing", () => {
    expect(formatTokenPair(9119, null)).toBeUndefined();
    expect(formatTokenPair(null, 1240)).toBeUndefined();
  });
});

describe("CostBadge", () => {
  it("renders the formatted cost", () => {
    renderWithIntl(<CostBadge usd={0.0013} />);
    expect(screen.getByText("$0.0013")).toBeInTheDocument();
  });

  it("renders an em dash when the cost is unknown", () => {
    renderWithIntl(<CostBadge usd={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("appends the token suffix when given", () => {
    renderWithIntl(<CostBadge usd={0.021} tokens="9.1K→1.2K" />);
    expect(screen.getByText("9.1K→1.2K")).toBeInTheDocument();
  });

  it("labels the cost for screen readers / hover", () => {
    renderWithIntl(<CostBadge usd={0.021} />);
    expect(screen.getByTitle("Cost of this review")).toBeInTheDocument();
  });
});
