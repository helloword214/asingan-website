# Organization Structure Guide

This document defines what `organization structure` means on the website and how the repo should store stable roles separately from changing personnel assignments.

## Why This Matters

The organization structure section helps the public understand:

- Who leads the station
- How responsibilities are organized
- Which units or offices handle specific functions

It also strengthens the website's credibility because it shows that the station is not just a building, but an organized public-service institution.

## What This Section Should Show

At minimum, the website's organization structure section should include:

- `Station head / current fire marshal`
- `Main offices, teams, or functional groups`
- `Short role description per group`
- `Optional assigned personnel names` only if you want them public and confirmed

## Flexible Assignment Rule

The organization structure should be `role-based`, not `person-based`.

That means:

- keep the section, unit, and designation slots stable
- assign people through a separate assignment file
- replace only the assignee when staffing changes
- keep the former assignee in archive instead of deleting them from project history

This prevents the whole organization chart from being rewritten every time only the personnel assignment changes.

## Best Website Presentation

The organization structure does not have to be shown as a complicated government chart.

Best options:

- `Card-based structure section`
- `Simple hierarchy diagram`
- `Grouped team blocks`

For this project, the most practical first version is:

- `station head at the top`
- `major functional groups below`
- `short one-line description per group`

## Information We Need

For each part of the structure, the best fields are:

- `group name`
- `role or function`
- `lead person` if public and confirmed
- `support members` if public and confirmed
- `notes` if needed

## Suggested Data Format

When we later encode the real structure, each entry should be easy to store in a content file.

Example fields:

- `id`
- `name`
- `type`
- `description`
- `leadName`
- `leadRank`
- `members`
- `order`

For a flexible system, split the data into `two layers`:

- `organization-structure.json` for fixed role slots and group hierarchy
- `personnel-assignments.json` for current assignees and archived former assignees

This way, the role stays the same even when the person changes.

## Safe Planning Rule

Do not invent the organization structure just to fill the page.

If some parts are still unclear, the first website version can use:

- confirmed leadership
- confirmed functional groups
- minimal or no named subordinate personnel

This is better than publishing a structure that looks formal but is not accurate.

## Current Status

As of `May 17, 2026`, the project now has a documented `role-based organization structure`.

What is already stored:

- `Stable section, unit, and role hierarchy` in [organization-structure.json](/Users/johnmichaell.benito/Documents/asingan-fs-website/data/organization-structure.json)
- `Current assignee per role` in [personnel-assignments.json](/Users/johnmichaell.benito/Documents/asingan-fs-website/data/personnel-assignments.json)
- `Personnel profile directory` in [personnels.json](/Users/johnmichaell.benito/Documents/asingan-fs-website/data/personnels.json)

What still needs ongoing verification:

- overlapping workbook-derived assignments for some lead roles
- preferred public expansion for `COMMEL` and `IIU`
- which support-role names should appear publicly on the website

## Current Leadership Reference

The top leadership slot is stored as a stable `roleId`, while the current assignee is kept in the assignment layer.

Current assignment in project records as of `May 17, 2026`:

- `Head of Station / Fire Marshal`: `SFO4 Derrick P Zulueta`
- `Effective start in saved project records`: `February 16, 2026`

## Next Working Focus

For the next context, focus only on these follow-up items:

1. `Confirm unresolved overlapping assignments`
2. `Approve public wording for COMMEL and IIU`
3. `Decide which support-role names should be visible on the website`

That keeps future edits focused on verification and presentation, not on rebuilding the structure from scratch.

## Recommended Input for Future Revisions

The easiest way to revise this section later is if you provide updates in this simple pattern:

- `Head of Station`
- `Group or office name`
- `What they handle`
- `Lead person if needed`

Example format only:

- `Fire Marshal`
- `Administration`
- `Operations`
- `Fire Safety Enforcement`
- `EMS / Rescue`
- `Logistics / Transport`

These are only planning examples. We should use only the categories that match the actual station structure.

## Copy-And-Fill Update Template

Use this exact fill-in pattern when future structure revisions are ready:

```text
Head of Station:
Rank and Name:

Group 1:
What this group handles:
Lead name for public display (optional):

Group 2:
What this group handles:
Lead name for public display (optional):

Group 3:
What this group handles:
Lead name for public display (optional):
```

If some groups are still uncertain, leave them out instead of guessing.

## Public-Facing Rule for Version One

The first website version does not need an over-detailed internal command chart.

A strong and safe first version can be:

- `Current head of station`
- `Major functional groups`
- `One-line responsibility per group`

That is enough to make the station look organized without publishing unnecessary or uncertain internal details.

## Archive Rule

When a person is replaced in a designation:

1. keep the `role slot` unchanged
2. move the old assignment to archive
3. add the replacement under the same `roleId`
4. keep the former person's profile in the personnel directory if you still want them preserved in project records

This is the safest long-term model for a real station website because staffing changes happen more often than the structure itself changes.

## Suggested Content Order on the Website

If we present this section visually, the cleanest order is:

1. `Head of Station`
2. `Primary response and operations groups`
3. `Support and administrative groups`

## Current Data Files

The current role-based structure system is stored here:

- [Organization Structure Data](/Users/johnmichaell.benito/Documents/asingan-fs-website/data/organization-structure.json)
- [Personnel Assignments Data](/Users/johnmichaell.benito/Documents/asingan-fs-website/data/personnel-assignments.json)
