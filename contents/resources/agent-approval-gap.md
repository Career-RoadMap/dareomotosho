---
title: The Bad-Day Access Review
slug: agent-approval-gap
episode: Your agent has production access and no one signed off
takeaway: "Scope it from the bad day."
domain: security
audience: practitioner
date: 2026-08-11
---

# The Bad-Day Access Review

**From the episode:** *Your agent has production access and no one signed off.*

A new hire gets an access review before they touch anything real. Your agent got a key to the building and no job description. This page is the job description — fifteen minutes, in writing, before the agent goes near production.

**What it is:** six questions about what the agent can reach and what stops it.
**Who fills it in:** whoever wired the agent up. Question 3 will pull in others.
**When:** before the agent touches production — and again every time it gets a new tool, because each new tool changes answer 4.
**Time:** about fifteen minutes.

## Before you start: think from the bad day

Do not list what the agent needs on a normal day — normal days are not what access reviews are for. Start from the worst believable one: the agent misreads a task, retries something destructive, or gets fed a malicious instruction. Grant only what survives that day.

## The review — answer in writing

**1. What can it read?**
Name the actual systems, one per line. "The database" is not an answer; the customer table is.

> ________________________________________

**2. What can it change?**
Every write permission, one line each. This list is usually longer than anyone expects — that is normal. Keep going until it is complete.

> ________________________________________

**3. Who approved each line above — by name?**
Go back through both lists and write a name next to every line. A line with no name is the finding. Stop and get the sign-off before going further.

**4. What is the most expensive thing it could do with what it has?**
Two sentences, concrete. If you cannot write them, you do not understand the access yet — go back to questions 1 and 2.

> ________________________________________
> ________________________________________

**5. What stops it?**
The limit, the timeout, the human checkpoint — named, not assumed. "It probably wouldn't" is not a stop.

> ________________________________________

**6. Who gets woken when it does something strange — and do they know that?**
A name, and a yes. If the honest answer is "nobody, officially", write that down — it is the second finding this page most often produces.

> Name: ______________   They know: yes / no

## The rule that makes this stick

Re-run this page every time a tool is added. The review you did at launch describes an agent that no longer exists.
