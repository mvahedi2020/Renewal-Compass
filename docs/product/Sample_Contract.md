# Fictional sample and state contract

This is an invented product fixture, not an employer contract or legal interpretation. No real customer, contract amount, retained revenue, outreach or commercial outcome is used. Mo owns Product / Program Management direction; AI assists implementation and verification.

## Finite account fixture: account-1

Vale Studio is an invented account. Its renewal review is November 28, 2026; the decision review date defaults to November 6. Existing obligation: current workspace access and standard support through the review period. New dashboard and export development are outside that sample obligation. Business need: prepare a cross-team review without reconciling three files manually. Requested features: custom dashboard, reusable export and faster preparation. A request is not an obligation.

| Record | Classification | What it supports | What it does not prove |
|---|---|---|---|
| O1 | Observation | Four fictional reviewers combine three files before each review | Renewal causality or willingness to accept a bridge |
| O2 | Observation | 12 of 20 fictional accounts use the same review fields | Future adoption or achieved value |
| A1 | Assumption | The account team might accept a temporary operating bridge | Actual acceptance |
| A2 | Assumption | A custom dashboard might affect renewal | Any confirmed commercial influence |

This four-record sample is transparent and finite. It is illustrative rather than sampled research. Observations are invented scenario inputs, not reports from human participants.

## Independently calculable options

Baseline total capacity is 14 invented team days. Six days are reserved for a shared accessibility milestone serving 12 fictional accounts. Available package capacity is therefore 14 − 6 = 8 days. The selector offers 10, 14, 20 and 24 total-day scenarios; saved drafts accept whole numbers 6–30 to keep the model bounded.

| Package | Scope and cost | Baseline remaining | Evidence | Wider impact / exclusion |
|---|---|---|---|---|
| Shared export + operating bridge | Reusable review export 6 + bridge 2 = 8 days | 8 − 8 = 0 | O1, O2, A1 | Potential reuse across 12 accounts; no custom dashboard, delivery date or support extension |
| Operating bridge only | Preparation workaround 2 days | 8 − 2 = 6 | O1, A1 | One account; manual burden continues; no export or dashboard |
| Account-specific dashboard | Dedicated dashboard 14 days | 8 − 14 = −6 | O1, A2 | Blocked at baseline; could displace the six-day shared milestone if all capacity were assigned to it; no reusable export |

At 10 days, package budget is 4: shared is blocked by 4, bridge leaves 2, custom is blocked by 10. At 20 days, custom consumes all 14 package days; feasibility still does not satisfy discovery and approval dependencies. At 24 days, custom leaves 4 package days. Increasing scenario capacity is an invented what-if, never an approved allocation.

## Interaction and storage contract

Initial working recommendation is shared export plus bridge, visibly provisional. Draft fields include package, capacity, owner, review date, conditions and unresolved risks. Owner must be nonempty and at most 120 characters; conditions require 20–1200 characters; risks require 10–1200. Review date must be a real November or December 2026 date. Saving a decision requires a feasible package and valid fields.

Edits stay in memory until a reviewed decision is confirmed. Preview includes scope, exclusions, capacity, owner, conditions, risks, date and full evidence records. Cancel and Escape make no saved change. A scope edit invalidates the preview; confirmation also checks the exact draft version. A recorded snapshot contains detached copies of the package and evidence version account-1, not mutable references. Later drafts preserve old snapshots. Withdrawal appends an ordered event and retains the original snapshot. “Revise from this record” copies old scope into a new draft; another review is required to record it. Reset clears draft and local history only after review; it cannot undo downloaded files.

Storage key `renewal-compass-v1`, schema 1, contains revision, draft and ordered review/withdrawal history. Unknown keys, bad package/evidence references, changed calculations, malformed dates in reviews, duplicate or reordered events and unsupported versions are rejected. A maximum of 98 events bounds history; the UI stops recording near that limit and offers explicit reset.

Every write compares the exact observed raw bytes and readability, including same-revision edits from another tab. A conflict rejects the action and offers reload. Invalid data remains unchanged until an explicit reset bound to the observed raw content. Reset rejects new bytes or new readability during its review. If reads fail while writes work, neither confirmation nor reset writes unseen bytes. Write failure keeps usable memory state with a refresh-loss notice. Compatible refresh restores recorded history; unrecorded edits are discarded. Downloads include the exact reviewed snapshot and fictional/non-promise label.

## Late-date scenario and visible history boundary

Review dates after November 6 are permitted only as explicitly late fictional scenarios. The draft, preview, immutable reviewed snapshot and export carry the derived timing warning. Dates on or after the November 28 renewal review state that the advance review window is missed and do not imply a timely decision or retained renewal. This warning supplements the date rather than silently treating all November/December dates as timely. The default November 6 date remains within the decision window, with discovery and approvals unresolved.

The history count shows reviews and withdrawals out of 98. At 98, recording and withdrawal stop with an explicit notice: export reviewed records, then deliberately review a sample reset to begin again. Domain operations enforce the same limit. Reset clears local history and cannot undo exports.
