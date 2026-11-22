# References and rationale

## Source

The section structure, the append-only rule, and the read-before-write loop come from
MindStudio's self-learning skill write-ups:

- <https://www.mindstudio.ai/blog/self-learning-ai-skill-system-learnings-md-wrap-up>
- <https://www.mindstudio.ai/blog/self-improving-ai-skills-claude-code>
- <https://www.developersdigest.tech/blog/self-improving-skills-claude-code>

## Where this design deviates, and why

**The file is `INSIGHTS.md`, not `LEARNINGS.md`, and there is one per module.** The source
describes a single project-level file and mentions scoped files only in passing. Per-module
files are the whole point here: a session in `server/` should not page in e2e lessons, and
the file sits next to the code whose behaviour it describes.

**`Session Notes` is dropped — six sections, not seven.** The source defines it as "dated
session summaries", which is precisely the narration the admission filter exists to reject.
It is the section with no admission test, so it collects everything the other six refuse.
Decisions worth keeping have a home in `Codebase Patterns` or `What Works`.

**`What Doesn't Work` is first in the file, not second.** The source itself observes that
it is the most-skipped and most-valuable section. Putting it at the top is what acts on that.

**No confidence tiers.** The source's high/medium/low tiers belong to a flow where a human
reviews proposed updates. Here the five gates are the tier: anything that would have been
"low" fails gate 1 or 2, and genuine uncertainty goes to `Open Questions`. A three-level
tier is also the source's own documented failure mode — a subjective criterion nobody can
score, so everything gets labelled "medium" and readers stop reading it.

**Append-only has one explicit carve-out and one escape hatch.** Deleting a `_(none yet)_`
placeholder is not deleting an entry. And consolidation — which the source assigns to "a
designated maintainer" — is a human-started session here, because append-only is a
constraint on autonomous behaviour, not a property of the file.

## The failure mode this is built against

All three sources name the same one: the file grows without curation and stops being read.
Everything distinctive here — the five binary gates, the 3-entry session cap, the
DO-NOT-RECORD list, the per-section soft caps, the displacement test, the explicit
statement that zero entries is a success — exists to keep that from happening. A skill
that writes something every session has already failed.
