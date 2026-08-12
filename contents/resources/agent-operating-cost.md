---
title: The Worst-Run Worksheet
slug: agent-operating-cost
episode: What an AI agent costs to run, and who pays when it is wrong
takeaway: "Price the worst run, not the typical one."
domain: cloud-platform
audience: practitioner
date: 2026-08-11
---

# The Worst-Run Worksheet

**From the episode:** *What an AI agent costs to run, and who pays when it is wrong.*

An agent decides for itself how much work to do, so the typical run tells you nothing about your exposure. The run that hurts is the expensive one — this worksheet prices that run before it happens, and puts a name on the ceiling.

**What it is:** five questions you answer in writing.
**Who fills it in:** whoever is putting the agent live, plus whoever owns the budget — question 4 is theirs.
**When:** the afternoon before the agent touches a real workload, and again every time it gets a new tool.
**Time:** about an hour, done honestly.

## The worksheet

**1. Describe the most expensive run you can believe.**
Not the average run — the bad one. The agent loops, re-reads the same document, retries a call that will never succeed. Two or three sentences, concrete enough that a colleague could picture it.

> ________________________________________
> ________________________________________

**2. Put a cost on that run.**
Count the steps in the run you just described and multiply by what one step costs at your model's actual rates. This is arithmetic, not forecasting. If a number is unknowable, write "unknown" — that is a finding, not a failure.

> Steps: ______ × cost per step: ______ = the worst run: ______

**3. Set the two ceilings.**
The point where the agent stops instead of spending more.

> Maximum steps per task: ______
> Maximum spend per task: ______

**4. Name the person who chose the spend ceiling.**
That number says what one answer is worth to the business. It is a business decision, and it needs a name on it — not a value sitting quietly in a config file with nobody's name attached.

> Chosen by: ______________

**5. Write what happens when the ceiling is hit.**
The task stops — then what? Who is told? Is stopping itself safe for this workload? Two sentences, even rough ones. A rough answer beats an unexamined one.

> ________________________________________
> ________________________________________

## How you know you did it right

- Someone who was not in the room can read answer 1 and picture the run.
- Every blank is filled — "unknown" counts as filled. An empty blank is the only wrong answer on this page.
- The name in question 4 belongs to someone who knows it is there.

## What this buys you

The budget conversation changes shape. You are not asking permission — you are handing the person who owns the budget a decision that was always theirs, with the number attached.
