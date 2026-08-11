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
One page to run before an AI agent touches anything real. A new hire gets an access
review; the agent got a key to the building and no job description. This is the
job description.

## When to use it

Before an agent goes near production, and again whenever its tools change. Fifteen
minutes. If filling it in feels unnecessary, that is usually because nobody can
answer row three — which is the reason to fill it in.

## The practice

**Scope it from the bad day.** Do not list what the agent needs on a normal day —
normal days are not what access reviews are for. Start from the worst believable
run: the agent misreads a task, retries something destructive, or is deliberately
fed a malicious instruction. Grant only what survives that day.

## The review — answer in writing

1. **What can it read?** List the actual systems, not "the database."
2. **What can it change?** Every write permission, one line each.
3. **Who approved each line above — by name?** A permission nobody approved is
   the finding. Stop and get the signature before going further.
4. **What is the most expensive thing it could do with what it has?** Write the
   scenario in two sentences. If you cannot, you do not understand the access yet.
5. **What stops it?** The limit, the timeout, the human checkpoint — named, not
   assumed.
6. **Who gets woken when it does something strange — and do they know that?**

## The rule that makes this stick

An agent's access review is a living document: **re-run it every time a tool is
added**, because each new tool changes the answer to question four. The review you
did at launch describes an agent that no longer exists.
