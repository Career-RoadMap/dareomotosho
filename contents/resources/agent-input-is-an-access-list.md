---
title: The Input Inventory
slug: agent-input-is-an-access-list
episode: Your agent reads its instructions from strangers
takeaway: "List whose words reach it."
domain: security
audience: practitioner
date: 2026-08-13
---

# The Input Inventory

**From the episode:** *Your agent reads its instructions from strangers.*

Your access review wrote down what the agent can reach. This page writes down the
other half: every place its words come from, and who is allowed to put words there.
One agent, one page, about twenty minutes.

- **What it is:** a table of every input channel your agent has, and who can write to it.
- **Who fills it in:** whoever configured the agent. You will not need anyone else for
  the first pass.
- **When:** now, for the agent you already have — and again every time it is given a new
  source to read.
- **Time:** about twenty minutes for the first agent. Ten for the next one.

## How to fill it in

1. **Open the agent's configuration and work top to bottom.** Do not do this from
   memory. Memory produces the channels you meant to give it, not the ones it has.
2. **Write one row for every place text comes from.** Start with the obvious ones — the instructions you wrote for it, the tickets waiting to be handled, the inbox, the documents. Then keep going to
   the ones that do not feel like inputs: file names, page titles, calendar invites,
   code comments, log lines, anything it fetches from the open web. If text from it
   reaches the AI model driving the agent, it is a row.
3. **Fill in the "who can write here" column, honestly and specifically.** This is the
   column the page exists for. "The team" is not an answer. "Anyone who can email
   support@" is an answer, and so is "any customer, through the feedback form".
4. **Then read the column on its own, top to bottom.** Ignore everything else on the
   page. You are looking for the rows where the answer is *anyone*, or *any customer*,
   or *whoever wrote that web page*. That is what this page produces.
5. **For those rows only, fill in the last two columns.** Everything else can stay
   blank. Most rows are fine and do not need a decision.
6. **Then stop.** This is an inventory, not a remediation plan. You are finding out
   what is true. Fixing comes after, and it is a different conversation.

## The inventory

| Where the text comes from | Who can put words there | Can the agent act straight off it? | What we are doing about it |
|---|---|---|---|
| *(example)* *the public support inbox* | *anyone who knows the address* | *yes — it triages without a human* | *put a review step between reading and acting* |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

The first row is an example. Replace it.

**What goes in each column:**

- **Where the text comes from** — the actual source, named the way your team names it.
  One per row. If you are unsure whether something counts, it counts.
- **Who can put words there** — the honest, specific answer. If it is genuinely open,
  write **anyone** and do not soften it. If you do not know, write **need to check**
  and put a name next to it — an unknown here is a real finding, not a gap in the form.
- **Can the agent act straight off it?** — yes, no, or *sometimes*. Answer it about
  what the agent actually does today, not what it is supposed to do.
- **What we are doing about it** — only for the rows that need it. In practice it is
  almost always one of two things: take the source off the read list, or put something
  between reading and acting. Write which, and who is doing it.

## Rules that keep it honest

1. **Read the configuration, not your memory of it.** The gap between the two is
   exactly where this page earns its twenty minutes.
2. **"Anyone" is the answer you are looking for, not the answer to be embarrassed by.**
   A row that says *anyone* is the page doing its job. Write it plainly.
3. **Re-run this whenever the agent gets a new source.** The inventory you wrote at
   launch describes an agent that no longer exists.

## What this buys you

A written answer to a question nobody has been asking: whose words reach this thing.
When something odd happens, you have a list of candidate channels instead of a
guess — and before anything happens at all, you find out which of your inputs are
open to people you have never met. That is usually one row, and it is usually a
surprise.
