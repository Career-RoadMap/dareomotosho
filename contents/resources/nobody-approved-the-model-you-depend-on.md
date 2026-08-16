---
title: The Unsigned Inventory
slug: nobody-approved-the-model-you-depend-on
episode: Nobody approved the model you depend on
takeaway: "Send the model through procurement."
domain: security
audience: practitioner
date: 2026-08-13
---

# The Unsigned Inventory

**From the episode:** *Nobody approved the model you depend on.*

Every third-party thing in your building was signed for except the ones that
arrived as a download. This page lists them and answers the four questions
procurement would have asked if anyone had shown it the door.

- **What it is:** one row per model or hosted model service your product depends on.
- **Who fills it in:** whoever ships the thing. You will not need security for the
  first pass, and that is the point.
- **When:** once now, and again whenever a model is added or swapped.
- **Time:** about half an hour for the first product. Ten minutes after that.

## How to fill it in

1. **Find them by reading the config, not by remembering.** Model names live in
   environment variables, config files, SDK calls and someone's notebook. Memory
   gives you the ones you chose deliberately, which are not the problem.
2. **Include the hosted ones.** A model your software talks to over the internet, rather than one you run yourself, is still a supplier — more obviously so, in fact, because there are terms and an invoice. If your product stops working when theirs does, it is a row.
3. **Answer column two with a place, not a brand.** "From the vendor's own API" and
   "from a public registry, uploaded by an account we know nothing about" are very
   different answers, and only one of them needs a conversation.
4. **Column three is a name.** The person who chose it. Not the team. If nobody can
   remember, write **nobody knows** — that is the single most useful entry on this
   page and the reason it exists.
5. **Column four is the one people skip: what happens if it goes away.** Withdrawn,
   relicensed, deprecated, or the account that published it disappears. One
   sentence. **"Unknown" is a legal answer** and it is better than a guess.
6. **Then take the page to whoever handles suppliers.** Not to security. You are
   not reporting a risk; you are telling them a new kind of supplier has been
   arriving without going past their desk.
7. **Then stop.** This is an inventory. Deciding what to do about any row is a
   different conversation with different people in it.

## The inventory

| Model or service | Where it came from | Who chose it (a name) | What happens if it goes away |
|---|---|---|---|
| *(example)* *the summariser in the support tool* | *a public registry — publisher unknown to us* | *nobody knows* | *unknown — nothing else in the product does this job* |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

The first row is an example. Replace it.

**What goes in each column:**

- **Model or service** — the name your team actually says out loud, plus the
  version or tag if you pin one. If you do not pin one, write **unpinned** and move
  on; that is a finding, not a failure.
- **Where it came from** — the source, honestly. A vendor API, a public registry, a
  partner, a file somebody was sent. If you cannot establish it in five minutes,
  write **cannot establish** and put a name beside it.
- **Who chose it** — a person. **"Nobody knows"** is common, expected, and the most
  valuable thing this page produces. Do not put a team name in to fill the gap.
- **What happens if it goes away** — the boring commercial question, not the scary
  one. Most rows will be fine. The one that is not will be obvious.

## Rules that keep it honest

1. **Read the configuration, not your memory.** The gap between them is where the
   unsigned rows live.
2. **Never write a name you are guessing at.** "Nobody knows" is information;
   a wrong name closes the question and sends the next person to the wrong desk.
3. **Do not turn this into a risk assessment.** The moment a column asks how
   dangerous something is, the page stalls — that is the exact routing mistake the
   episode is about. Four boring questions, then hand it on.

## What this buys you

A supplier list for the part of your stack that never had one. The next time
somebody asks where a model came from — a customer, an auditor, or a colleague
three months from now — there is a row with an answer in it instead of an
afternoon of archaeology. And the rows that say *nobody knows* tell you, without
anybody having to be alarmed about it, exactly where to start.
