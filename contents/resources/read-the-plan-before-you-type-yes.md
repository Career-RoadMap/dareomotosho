---
title: The Before-Yes Check
slug: read-the-plan-before-you-type-yes
episode: "Terraform Plan and Apply: How I Took a Live App Down"
takeaway: "Before you type yes, find the word destroy, check the count, know which system it's pointing at, and look at anything left blank."
domain: cloud-platform
audience: newcomer
date: 2026-10-22
---

# The Before-Yes Check

*From the episode: Terraform Plan and Apply: How I Took a Live App Down*

Terraform shows you a plan of everything it is about to do, and nothing happens until you type
yes. This page is the four things to find in that plan before you type it, whether you wrote the
Terraform file yourself or ChatGPT or Gemini wrote it for you.

- **What it is:** a one-page check for one Terraform plan: one word, one count, one name, and
  anything left blank, then a yes or a message to your team.
- **Who fills it in:** whoever is about to type yes, including somebody new to cloud who has
  never run `terraform apply` on a shared system before.
- **When:** after `terraform plan` (or `terraform apply`) shows the plan, and before you type
  yes. Fill in a fresh page for every plan.
- **Time:** a couple of minutes on a small plan. Longer on a big one, and that is time well
  spent.

---

## How to fill it in

1. **Run the plan and do not type anything yet.** `terraform plan` changes nothing. `terraform
   apply` shows the same plan and then waits for you to type yes.
2. **Write what you meant this change to do, in one line.** Before you read the plan, so the plan
   cannot talk you into it.
3. **Find the word destroy.** Search the plan for "destroy" and for "must be replaced". "Must be
   replaced" means Terraform deletes the old one and builds a new one. Write down every resource
   either phrase appears on.
4. **Check the count.** The last line of the plan starts with "Plan:" and gives three counts: to
   add, to change, to destroy. Copy them as Terraform wrote them, then write what you expected
   beside them.
5. **Write the name it points at.** Which account, which environment, which project, and is it
   test or live. If the plan does not show it, check your provider settings and workspace. If
   you still cannot tell, write "unknown".
6. **List anything left as a default.** Any setting in the file you did not fill in, especially
   anything about deletion, expiry or backups. For each one, write what the default does, or
   "unknown". A blank is a choice somebody else made for you.
7. **Decide.** Everything matches what you meant: type yes. Anything surprised you, or any answer
   is "unknown": do not type yes. Send the message at the bottom of the page instead.

---

## The page

**What I meant this change to do (one line, written before reading the plan):**

> ______________________________________________

**The word: every resource marked to be destroyed or that "must be replaced":**

> ______________________________________________

> ______________________________________________

**Did I mean any of these to be deleted?** Yes / No / Not sure

> ______________________________________________

**The count, as Terraform wrote it:**

| | To add | To change | To destroy |
|---|---|---|---|
| What the plan says | ______ | ______ | ______ |
| What I meant | ______ | ______ | ______ |

**The name: where this plan is pointing (write "unknown" for any you cannot confirm):**

- Account: ______________________________
- Environment: ______________________________
- Project: ______________________________
- Test or live: ______________________________

**Anything left as a default:**

| Setting I left blank | What the default does (or "unknown") |
|---|---|
| ______________________ | ______________________ |
| ______________________ | ______________________ |
| ______________________ | ______________________ |

**My decision:** Type yes / Do not type yes, send the message

**If something surprised me, the message I send instead (what the plan wants to do, that I have
not applied anything, and who I need to look at it with me):**

> ______________________________________________

**An example, filled in** *(example)*

- **What I meant:** add one new server *(example)*
- **The count:** the plan says one to add and four to destroy; I meant one to add and nothing to
  destroy, so something in the file is doing more than I asked for *(example)*
- **The word:** the plan says the customer database must be replaced, and I only meant to resize
  it *(example)*
- **Test or live:** unknown, so I do not type yes until it is known *(example)*
- **The message:** "The plan wants to replace the customer database, not just resize it. I
  haven't applied anything. Can someone who knows that database look at it with me first?"
  *(example)*

---

## Rules that keep it honest

- **Write what you meant before you read the plan.** Read it first and the plan becomes what you
  meant.
- **"Unknown" is a stop, not a pass.** An account, an environment or a default you cannot name is
  a reason to ask, never a reason to type yes and hope.
- **This check is one layer, not all of them.** A plan that reads fine can still break something
  once it is running, so keep the backups, the testing and a second pair of eyes on big changes.

---

## What this buys you

A couple of minutes between the plan and the yes, spent on the one check that is completely
yours. The yes you type is one you read first, and when something looks wrong you have a plain
message ready instead of a guess. The line to keep in mind while you fill it in:

> **Before you type yes, find the word destroy, check the count, know which system it's pointing at, and look at anything left blank.**
