---
title: The Unanswerable Question
slug: nobody-can-explain-what-your-agent-did
episode: Nobody can explain what your agent did
takeaway: "Record the reason at the moment, not after."
domain: business-systems
audience: decision-maker
date: 2026-08-13
---

# The Unanswerable Question

**From the episode:** *Nobody can explain what your agent did.*

You cannot attach a reason to everything your agent does — the cost is real and it
lands on every call. This page decides which actions are worth it, before somebody
outside your company asks you a fair question you cannot answer.

- **What it is:** a shortlist of the agent actions that need a reason written at the
  time, and the sentence each one should write.
- **Who fills it in:** whoever owns the agent, with whoever would have to answer for
  it. Those are often two different people, and that is the useful part.
- **When:** before the agent's next release. Again whenever it gets a new ability.
- **Time:** about forty minutes. Longer if the two people disagree, which is the
  page working.

## How to fill it in

1. **List what the agent can actually do.** Verbs, not features: sends, refunds,
   updates, deletes, replies, orders, approves. Read the tool definitions rather
   than the product description.
2. **Mark the consequential ones.** One test, and only one: **does this reach
   outside the engineering team?** Money moved, a customer record changed, something
   sent to a person outside the building. If it does not reach outside, it stays in
   the ordinary trace and off this page.
3. **For each marked action, name who would ask.** A customer, an auditor, a
   regulator, your board, a journalist. If nobody would ever ask, unmark it — you
   have just saved the latency.
4. **Write the sentence the agent should produce.** One line, plain language,
   readable by the person in column three. It has to say what it was trying to
   achieve and what it chose not to do. If you cannot write the template yourself,
   the agent will not produce anything better.
5. **Then decide out loud on the ones you are leaving off**, and write why in the
   last column. This is the point of the page. "Too expensive for the volume" is a
   perfectly good answer — an accepted risk is a decision, an unnoticed one is not.
6. **Then stop.** Do not design the storage, the retention or the dashboard here.
   That is engineering's, and it is a different meeting.

## The shortlist

| What it does | Reaches outside? | Who would ask about it | The sentence it should write | If we are skipping it, why |
|---|---|---|---|---|
| *(example)* *issues a refund* | *yes — money and a customer* | *the customer, then finance* | *"Refunded because the order was two days late against the promise; did not escalate to a human because the amount was under the standing limit."* | *n/a — doing it* |
| *(example)* *retries a failed lookup* | *no* | *nobody* | *—* | *stays in the trace; no one outside will ever ask* |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

The first two rows are examples — one that needs a reason and one that does not.
Replace both.

**What goes in each column:**

- **What it does** — a verb the agent actually performs. If two actions differ only
  in size, they are one row.
- **Reaches outside?** — yes or no. Not "sort of". A borderline row is a yes; you
  can always take it off later, and the cost of being wrong runs the other way.
- **Who would ask** — a real category of person. **"Nobody"** is a legal and common
  answer, and it is how most rows get removed.
- **The sentence** — write it as if the agent had written it. Both halves: what it
  was going for, and what it ruled out. A sentence with only the first half is a
  description, not a reason.
- **If we are skipping it, why** — for every marked row you decide not to do. This
  column is the record of a decision, which is the whole subject of the episode.

## Rules that keep it honest

1. **Plain language, or it is not a reason.** If the sentence needs somebody who
   knows the codebase, you have written another log line. The test: could the
   person in column three read it aloud without asking what a word means?
2. **"We are not doing this, and here is why" is a complete row.** An accepted cost
   written down beats an unexamined one, and this page is worth filling in even if
   the answer to every row is no.
3. **Do not let this become the logging project.** The moment somebody starts
   specifying retention, storage or a viewer, the page has stopped doing its job —
   which is choosing, not building.

## What this buys you

The next time somebody outside your company asks why it did that, there is a
sentence to read them — written at the time, in words they can understand, by the
thing that made the call. And for everything you decided not to instrument, there
is a line saying you decided, which is a very different conversation from finding
out you never thought about it.
