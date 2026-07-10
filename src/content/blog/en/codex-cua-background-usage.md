---
title: 'Codex usage felt off, then soonsoon checked the processes'
description: 'A note on soonsoon’s practical look at Codex Computer Use background activity and usage drain.'
pubDate: 'Jul 09 2026'
status: observed
source: soonsoon.io
sourceUrl: https://soonsoon.io/openai-codex-cua-background-usage-drain/
---

I had been trying to make sense of a Codex usage-limit issue.

The shape of it was familiar: the weekly limit seemed to move faster than my own sense of usage. Maybe it was delayed accounting. Maybe it was Desktop. Maybe it was background work. Maybe I had simply done more than I remembered. Annoying, but also interesting.

Then I found soonsoon's post.

> [Codex 사용량이 줄어드는 이유? Computer Use / CUA 백그라운드 작업에서 찾은 힌트](https://soonsoon.io/openai-codex-cua-background-usage-drain/)

I was glad to find it. Not because it proved the answer, but because soonsoon grounded the question in a real macOS environment, running processes, and local logs. That is a much better starting point than staring at the usage counter and squinting.

soonsoon's post describes several processes that appeared to be related to Codex Desktop and Computer Use, or CUA. They were still present even when no prompt was being actively typed.

The process names that stood out were:

- `SkyComputerUseService`
- `cua_node/bin/node_repl`
- `VideoCaptureService`

soonsoon also noted that the period when those processes were visible overlapped substantially with the period when weekly usage seemed to fall quickly.

That overlap is the observation. It is not the conclusion.

## The Useful Question

The useful question is whether the boundary of "using Codex" is as obvious as it feels from this side of the screen.

For a prompt-and-response tool, the mental model is tidy. You type a prompt, wait for the answer, and call that the usage event.

Codex Desktop makes that tidiness a little suspicious. The surrounding execution environment may also be doing work around the prompt:

- checking screen state
- controlling desktop applications
- using a browser
- capturing the screen
- running helper processes
- keeping task state alive
- creating and ending threads

OpenAI's documentation describes Computer Use as the capability that lets Codex see and operate the graphical interface on macOS or Windows.

On macOS, that means Screen Recording and Accessibility permissions. It also means a separate execution environment that lets Codex inspect the screen, click, and type.

So the presence of extra background components is not, by itself, surprising. Computer Use involves more interface and background components than a plain CLI session.

The harder part is knowing whether any of that activity remains alive after the visible work feels done, and whether it is included in the usage calculation.

## Correlation Is Not Cause

This is where the line has to stay clean.

If background processes are present during the same window in which usage drops, that is worth checking.

It does not prove this:

> Computer Use processes directly consumed the weekly usage allowance.

Usage can move for several reasons, and more than one may apply at the same time:

- delayed usage accounting
- Codex Desktop work
- CLI runs
- IDE extensions
- automated review
- subagents
- retried work
- sessions that were not stopped
- Computer Use background execution

There has also been an OpenAI status incident for Codex usage limits depleting faster than expected.

- [OpenAI Status: Codex Usage Limits Depleting Faster Than Expected](https://status.openai.com/incidents/01KW2E6W0503W4NXJNCVAG8V6T)

For me, that keeps two things on the table: product-side usage accounting and the local execution state on the machine.

## Practical Checks

For a similar case, I would check four things before getting too confident.

### 1. Did you fully quit Codex Desktop?

First, separate closing a window from quitting the app.

On macOS, closing a window often leaves the app process alive.

### 2. Is Computer Use enabled?

Then compare the behavior with Computer Use on and off.

### 3. Are related processes still present?

Activity Monitor can show whether these related processes are still present:

- `SkyComputerUseService`
- `node_repl`
- `VideoCaptureService`

The presence of a process does not show that it is consuming usage, but it is still worth checking.

### 4. Did you record usage changes by time period?

Finally, keep a timeline. A written record is more useful than a vague sense that the counter moved.

| Time | Codex state | Computer Use | Direct work | Usage change |
|---|---|---|---|---|
| 09:00 | Running | On | Document review | Baseline |
| 12:00 | Idle | On | None | Check change |
| 15:00 | Quit | Off | None | Check change |

That kind of record makes it easier to compare states instead of chasing a hunch.

## My Takeaway

I do not read soonsoon's post as proof that Computer Use caused the usage drain.

I read it as a reminder that usage is not always explained by prompt count alone.

> To understand AI tool usage, we should not only count prompts.
> We also need to look at applications, background sessions, automated work, and helper processes.

Codex can involve CLI sessions, Desktop work, IDE integrations, Computer Use, automated review, and subagents under one usage system. In that kind of setup, it is hard for a user to attribute usage cleanly to one feature.

An observation like soonsoon's cannot replace an official root-cause analysis. It can still be useful because it suggests where I would look next.

If my own Codex usage moves in a way I do not expect, I would not stop at asking whether I submitted too many prompts. I would also check the Desktop app state, Computer Use settings, background processes, and execution records.

---

Original post:

- [Codex 사용량이 줄어드는 이유? Computer Use / CUA 백그라운드 작업에서 찾은 힌트](https://soonsoon.io/openai-codex-cua-background-usage-drain/)

References:

- [OpenAI Codex Computer Use official documentation](https://developers.openai.com/codex/app/computer-use)
