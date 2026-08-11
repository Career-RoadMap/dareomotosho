---
title: The Cost Decision Sheet
slug: cost-is-an-ownership-problem
episode: Cloud cost optimization is an org chart problem
takeaway: "Cost the options. Do not rank them."
domain: cloud-platform
audience: decision-maker
date: 2026-08-11
---

# The Cost Decision Sheet

**From the episode:** *Cloud cost optimization is an org chart problem.*
One page, used in a real design review. It moves the invoice to the person making
the design decision — at the moment they make it, not in next month's report.

## When to use it

Any review where an architecture choice is being made and nobody in the room can
say what each option costs per month. That gap is the whole problem.

## The practice

**Cost the options. Do not rank them.** Put a monthly figure beside every serious
option and then stop. The moment you rank, you have made the business decision for
the room — and that decision belongs to whoever answers for the budget. Your job is
to make the trade-off visible, not to win it.

## The sheet — fill this in during the review

| | Option A | Option B | Option C |
|---|---|---|---|
| What it is (one line) | | | |
| Monthly cost, this scale | | | |
| Monthly cost, 10x scale | | | |
| Who answers for this line item | | | |
| What we give up by choosing it | | | |

**Rules for filling it honestly:**
1. A cost you cannot estimate gets written as "unknown" — never a guess dressed as
   a figure. An unknown in the sheet is information; an invented number is a trap.
2. "Who answers for this line item" takes a name, not a team. If no name fits,
   that row *is* the finding — the cost has no owner, and it will grow.
3. The 10x row is where the options separate. Most look identical at today's scale.

## The question this sheet forces

Not "which option is cheapest" — *"who is choosing to spend this, and do they know?"*
When the person deciding the design can see the invoice, the argument about cost
happens before the bill exists instead of after.
