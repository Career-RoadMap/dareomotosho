---
title: The Half-Life Filter
slug: tools-expire-tradeoffs-do-not
episode: Tools expire, trade-offs do not
takeaway: "Write down what it costs."
domain: cloud-platform
audience: practitioner
date: 2026-08-13
---

# The Half-Life Filter

**From the episode:** *Tools expire, trade-offs do not.*

Half of what you are about to learn has an expiry date and nobody tells you which
half. This page sorts it before you spend the evening, and gives you three lines to
leave behind so the next engineer inherits the reasoning instead of the steps.

- **What it is:** a sorting pass over your learning list, plus three lines you paste
  into anything you write down.
- **Who fills it in:** you, on your own. Nobody needs to approve this.
- **When:** before you start the next course, doc or tutorial — and again whenever you
  finish writing something someone else will read.
- **Time:** ten minutes for the list. Two minutes for the three lines.

## How to fill it in

1. **Write down the next five things on your learning list.** Whatever is actually
   queued up — the course, the certification, the docs you keep meaning to read. Real
   ones only. One per row.
2. **For each one, answer the middle column: product or problem?** A product fact is
   true about a thing somebody ships — this flag, this menu, this console. A problem
   fact is true about the work itself — why you would scale out instead of up, what
   each choice costs. If a row is genuinely both, write **both** and carry on.
3. **Then column three: what is still true if the product changes?** One phrase. If
   the honest answer is *nothing*, write nothing. That is not a reason to drop the
   row — it is the row telling you what it is.
4. **Now decide the hours, out loud, in column four.** You are not banning product
   facts. You need them and you will keep learning them. You are choosing the split
   on purpose instead of by default.
5. **Turn to Part 2 the next time you write something down for somebody else.** Not
   later, and not as an exercise — the three lines belong at the bottom of a real
   document, where the person who opens it in two years will find them.
6. **Fill the three lines in your own words, in this order.** What we chose, then what
   we gave up, then what would change our mind. The middle one is the one people skip
   and the one that is still worth reading later, so if you only manage one, make it
   that.
7. **"I do not know yet" is a legal answer on the third line, and only the third.**
   Nobody knows in advance what evidence would change their mind; writing that down
   honestly is worth more than inventing a threshold you will not act on. The first two
   lines you do know, because you just made the decision.
8. **Then stop.** Do not tidy the table, do not add rows you are not really going to do,
   and do not go back and improve the wording.

## Part 1 — the sorting pass

| What I am about to learn | Product fact or problem fact? | What survives if the product changes | Hours I will give it |
|---|---|---|---|
| *(example)* *the new console for the deploy tool we use* | *product* | *nothing — it is a fact about their UI* | *enough to be useful this week* |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

The first row is an example. Replace it.

**What goes in each column:**

- **What I am about to learn** — name the actual thing. "Kubernetes" — or whatever the big platform word is where you work — is too big to sort; "how traffic arriving from outside gets routed to the right part of our system" is a row.
- **Product fact or problem fact** — product, problem, or both. If you cannot tell,
  write **cannot tell** and move on. That answer is honest and it is common; a row
  you cannot sort is worth noticing, not worth guessing at.
- **What survives if the product changes** — one phrase, plain words. "Nothing" is a
  complete answer.
- **Hours I will give it** — a number you would defend out loud, or *unknown* if you
  do not know yet. Do not round a guess up to look decisive.

## Part 2 — the three lines

Paste these into the bottom of the next design document, written procedure or handover note you write. Answer them in your own words. This is the whole of *write down what it costs*:

**What we chose:**

> ________________________________________

**What we gave up to choose it:**

> ________________________________________

**What we would need to see to choose differently:**

> ________________________________________

If you can only manage one, make it the second.

## Rules that keep it honest

1. **Do not sort a row by how hard it was to learn.** Depth is not the test. Plenty
   of difficult product knowledge expires on schedule.
2. **Never write a number you cannot source.** In column four, *unknown* is a legal
   answer. A dressed-up guess reads as a decision you did not make.
3. **Do not go back and tidy Part 2 later.** Written at the time it is evidence.
   Rewritten afterwards it is a report, and nobody trusts a report.

## What this buys you

Two things. Your learning hours stop leaking into material that will not be true by
the time you need it — and the next person to open your document gets the reasoning,
not a list of steps that stopped working. That document is still worth opening in two
years. The step-by-step procedure beside it is not.
