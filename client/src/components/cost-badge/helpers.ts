/** Cost formatting, shared by <CostBadge> and the run-trace COST stat tile. */

/** Em dash shown wherever a cost is unknown (no run, or unpriced model). */
export const NO_COST = "—";

/**
 * USD cost, formatted so it never collapses to a meaningless `$0.00`.
 *
 * Review runs in this app routinely cost well under a cent (~$0.0013), so the
 * sub-cent tier carries four decimals — two would render every real run as
 * `$0.00`, and three would make $0.0013 and $0.0014 indistinguishable.
 */
export function formatCost(usd: number | null | undefined): string {
  if (usd == null || !Number.isFinite(usd)) return NO_COST;
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  if (usd < 1) return `$${usd.toFixed(3)}`;
  return `$${usd.toFixed(2)}`;
}

/** Compact in→out token pair for the badge's optional suffix (e.g. `9.1K→1.2K`). */
export function formatTokenPair(
  tokensIn: number | null | undefined,
  tokensOut: number | null | undefined,
): string | undefined {
  if (tokensIn == null || tokensOut == null) return undefined;
  return `${(tokensIn / 1000).toFixed(1)}K→${(tokensOut / 1000).toFixed(1)}K`;
}
