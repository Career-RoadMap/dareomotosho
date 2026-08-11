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
One page to complete before an agent runs against a real workload. An agent decides
for itself how much work to do, so the typical run tells you nothing about your
exposure. This prices the run that hurts.

## When to use it

The afternoon before anything goes live, and again whenever the agent gets a new
tool or a bigger workload. It takes about an hour done honestly.

## The practice

**Price the worst run, not the typical one.** A typical run is why you built the
thing; the rare expensive run is what shows up on a bad Tuesday. If the worst run
cannot do real damage, you never need to predict the typical one.

## The worksheet

1. **Describe the most expensive believable run.** The agent loops, re-reads the
   same document, retries a call that will never succeed. Two or three sentences,
   concrete.
2. **Put a cost on that run.** Steps x price per step, at your model's actual
   rates. This is arithmetic, not forecasting — if a number is unknowable, write
   "unknown" and treat that as the finding.
3. **Set the two ceilings.**
   - Maximum steps per task: ______
   - Maximum spend per task: ______
4. **Name who chose the spend ceiling: ______________**
   That number is a judgment about what a single answer is worth — a business
   decision, not an engineering one. It must not live quietly in a config file
   with nobody's name on it.
5. **Write down what happens when the ceiling is hit.** The task stops — then
   what? Who is told? Is stopping itself safe for this workload? Answer it for
   *your* workload in two sentences, even roughly. A rough answer beats an
   unexamined one.

## The conversation this enables

With the worst run priced and the ceiling named, the budget conversation changes
shape: you are not asking permission — you are handing whoever owns the budget a
decision that was always theirs, with the number attached.
