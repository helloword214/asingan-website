# Prompting Rules

## Purpose

This document defines our working rules for prompts, replies, and task execution inside this project.

It expands the root [AGENTS](../AGENTS.md) file instead of replacing it.

The goal is simple:

- reduce wrong assumptions
- keep communication clear
- avoid unwanted edits
- make every next step grounded in real project context

## Core Rule

Do not assume.

If something is not clearly shown, confirmed, or documented, it should be treated as `unknown` until the user provides it or the repository proves it.

## Working Rules

1. `No assuming`
   If the file, feature, structure, or requirement has not been shown yet, do not act like it already exists.

2. `Inspect first`
   Before suggesting edits or implementation direction, check the actual repo structure and available files.

3. `Use only visible context`
   Base answers on:
   - files in the repository
   - data already saved in the project
   - details explicitly given by the user

4. `Mark uncertainty clearly`
   If something is not verified, say it is `unclear`, `not yet provided`, or `not found in the repo`.

5. `Ask or wait when needed`
   If the user says they will show the file structure, content, or reference first, wait for that input before making implementation assumptions.

6. `Do not fill gaps with invented structure`
   Do not invent pages, components, hierarchy, personnel, or data just to keep momentum.

7. `State assumptions explicitly`
   If a small assumption is truly needed to proceed, say it clearly before or after the work so it can be corrected fast.

8. `Prefer narrow next steps`
   When the request is broad, focus only on the exact area the user named instead of expanding scope automatically.

## Repo Workflow Rule

When working on this project:

- inspect first
- summarize what actually exists
- confirm the immediate target area
- edit only after the target is clear

## Examples

Good:

- `I checked the repo first and I do not yet see the frontend app files.`
- `You mentioned you will show the file structure first, so I will wait for that before proposing changes.`
- `This part is still not documented in the repo, so I will not invent it.`

Not good:

- acting as if a page already exists without checking
- treating planning docs as completed implementation
- inferring missing hierarchy or content without confirmation

## Default Safety Rule

If there is any tension between moving fast and staying accurate, choose accuracy first.
