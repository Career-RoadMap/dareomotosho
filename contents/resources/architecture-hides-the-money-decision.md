---
title: The Commitment Line
slug: architecture-hides-the-money-decision
episode: Architecture is where the money decision hides
takeaway: "Name the moment the money is decided."
domain: business-systems
audience: decision-maker
date: 2026-08-13
---

# The Commitment Line

**From the episode:** *Architecture is where the money decision hides.*

Every design review makes at least one choice the business will still be paying for
years from now, and nothing in a normal review asks which one. This page is the
missing field — four lines, filled in while the decision is still being made.

- **What it is:** the decision written down, plus four lines about what it commits
  you to — filled in in the room, at the time.
- **Who fills it in:** whoever is running the review. Not finance — they are not there.
- **When:** during the design review, before it ends. Not written up afterwards.
- **Time:** three minutes per decision. Fewer decisions need it than you think.

## How to fill it in

1. **Pick the decisions that are hard to undo.** Not every choice needs this page. Ask
   one thing: if we wanted out of this in two years, would that be an afternoon or a
   project? Afternoon, skip it. Project, fill this in.
2. **Write the decision in one sentence, in plain words.** "We are using the managed
   queue" — not a diagram reference, not a ticket number. Somebody who was not in the
   room has to be able to read it.
3. **Then answer the commitment line: what does this commit us to paying for, and for
   how long?** This is the whole point of the page. Money, licences, headcount,
   attention — whatever it actually commits. If nobody in the room can answer it, that
   is the finding. Write **cannot answer this yet** and say who is going to find out.
4. **Put a name in the owner line.** A person, not a team. Not for blame — so the
   person reading this in two years knows who to ask.
5. **Name what you closed off.** Every real decision shuts a door. If you cannot name
   the door, you have not made a decision yet, you have taken a default.
6. **Then stop.** Do not turn this into a business case. Four lines, and back to the
   review.

## The form — one per decision

**The decision, in one sentence:**

> ________________________________________

**What this commits us to paying for, and for how long:**

> ________________________________________
> ________________________________________

**Who owns that commitment** *(a name, not a team)*:

> ________________________________________

**What this closes off:**

> ________________________________________

**What we would need to see to revisit it:**

> ________________________________________

## Where the page lives afterwards

Next to the decision, wherever decisions already live for you — the design doc, the
ADR, the review notes. Do not start a new system for this. A page in a new tool is a
page nobody opens.

## Rules that keep it honest

1. **Fill it in during the review, not after.** Written at the time it is a decision
   record. Written afterwards it is a justification, and everyone can tell.
2. **"Cannot answer this yet" is a legal answer, and it is the most valuable one this
   page produces.** Never replace it with an estimate to make the form look complete.
   A guessed figure becomes a real number the moment somebody quotes it back.
3. **One name, always.** A commitment owned by a team is owned by nobody, which is the
   exact failure the page exists to catch.

## What this buys you

The next time a bill arrives that nobody can explain, there is a sentence to read
instead of an excavation to run — written by the people who made the choice, at the
moment they made it, in words you can take into a board meeting. And the reviews
themselves change within about a month, because a room that knows it has to answer
the commitment line starts answering it before anyone asks.
