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

Most architecture choices are made with nobody in the room able to say what each
option costs per month. This sheet closes that gap: a monthly figure beside every
serious option, and a name beside every figure — visible at the moment the
decision is made, not in next month's report.

- **What it is:** one table you bring to a design review.
- **Who fills it in:** whoever is proposing the options — before the review, so the
  room spends its time deciding instead of looking things up.
- **When:** any review where an architecture choice is on the table.
- **Time:** twenty to thirty minutes, mostly in the vendor's price calculator.

## How to fill it in

1. **One column per serious option.** Two or three. Describe each in row one in
   words a non-engineer can read.
2. **Price each at today's scale.** Use the vendor's price calculator or your last
   invoice. A cost you cannot estimate gets written as "unknown" — never a guess
   dressed as a figure. An honest unknown is information; an invented number is a
   trap.
3. **Price it again at ten times the scale.** This is where options that look
   identical today separate. Same sources, same honesty about unknowns.
4. **Put a name in row four.** The person who answers when this line item grows —
   a name, not a team. If no name fits, that row is the finding: the cost has no
   owner, and it will grow.
5. **Row five: what you give up.** One phrase per option. Every option gives up
   something — a column with nothing here is not finished.
6. **Then stop.** Do not rank the options. The moment you rank, you have made the
   business decision for the room — and that decision belongs to whoever answers
   for the budget. Your job is to make the trade-off visible, not to win it.

## The sheet

| | *(example — replace it)* | Option A | Option B | Option C |
|---|---|---|---|---|
| What it is, one line | *the message tray the vendor runs for us* | | | |
| Monthly cost at today's scale | *figure from the vendor's calculator* | | | |
| Monthly cost at ten times the scale | *unknown — pricing tier changes, flag it* | | | |
| Who answers for this line item | *a name, not a team* | | | |
| What we give up by choosing it | *we stop being able to move this in a weekend* | | | |

**Then stop. Do not rank the options.** The moment you rank them you have made the
business decision for the room, and that decision belongs to whoever answers for the
budget. Making the trade-off visible is the job; winning it is not.

## The question this sheet forces

Not "which option is cheapest" — *who is choosing to spend this, and do they
know?* When the person deciding the design can see the invoice, the argument about
cost happens before the bill exists instead of after.
