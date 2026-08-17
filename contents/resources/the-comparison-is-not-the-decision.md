---
title: The 3am Column
slug: the-comparison-is-not-the-decision
episode: The comparison is not the decision
takeaway: "Ask who runs it at 3am."
domain: cloud-platform
audience: practitioner
date: 2026-08-13
---

# The 3am Column

**From the episode:** *The comparison is not the decision.*

Every comparison table you have open is accurate and none of them can decide this,
because the column that decides it is about your team. This page is that column.
Open the table you already have and fill this in beside it.

- **What it is:** three questions answered per option, none of them about features.
- **Who fills it in:** whoever is proposing the options, with the person who is
  actually on call in the room. That second person is the whole point.
- **When:** when the decision has been open for more than a week and more research
  is not closing it.
- **Time:** twenty minutes, if the on-call person is there. Do not do it without them.

## How to fill it in

1. **Write the two options across the top.** Two. If you have four, cut to two
   first by any means you like — the feature comparison is genuinely fine for that
   part, and this page is not for shortlisting.
2. **Answer row one with a name.** Who gets paged when this misbehaves at 3am? An
   actual person on an actual rota. If nobody is on a rota for it yet, write **no
   rota** — you have found something more important than the decision.
3. **Row two: what do we already run that is like this?** Live capability, not sunk
   cost. "We already run something similar and three people can debug it" is a real
   answer. "We paid for a licence" is not.
4. **Row three: describe the failure, then say who reads it.** How does this thing
   break, and can the person from row one understand the output when it does? If
   you do not know how it fails, write **unknown** — an unknown here is the finding.
5. **Now read row one across.** In most decisions it is already over by this point,
   and the surprise is how rarely the answer matches the feature table.
6. **Then stop, and write one sentence saying what you gave up.** Whichever you
   pick, the other option was better at something. Name it. That sentence is what
   makes this reviewable in two years.

## The three questions

| | **Option A: ______________** | **Option B: ______________** |
|---|---|---|
| **Who runs it at 3am?** *(a name, not a team)* | | |
| **What do we already run that is like this?** | | |
| **How does it fail, and who can read that?** | | |

*(example, for a queue decision)*

| | *the managed queue* | *the one we self-host* |
|---|---|---|
| **Who runs it at 3am?** | *the vendor, then Ada* | *Ada, alone* |
| **What do we already run like this?** | *nothing — this would be first* | *two of these; four people can debug them* |
| **How does it fail, and who can read that?** | *unknown to us — we would read their status page* | *badly, but in a way Ada has seen before* |

Replace the example. It is there to show the shape of an honest answer, including
the *unknown*.

**What we chose, and what we gave up:**

> ________________________________________

## Rules that keep it honest

1. **A name, never a team.** "Platform" does not get paged. A person does, and
   whether that person has seen this tool before is usually the largest cost in the
   decision.
2. **"Unknown" is a legal answer everywhere on this page**, and it is worth more
   than a confident guess. An unknown in row three is a genuine finding about an
   option you were about to choose.
3. **Do not put features on this page.** They are already answered somewhere else,
   accurately. Adding them here turns the sheet back into the thing that could not
   decide it.

## What this buys you

The decision closes — usually in one sitting, often against the tool that won the
feature table, and with a reason the room can say out loud. And the sentence at the
bottom means that when somebody reopens this in two years, they inherit the
reasoning instead of an archaeology project.
