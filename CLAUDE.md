# CLAUDE.md — AmbitionBox Career Assistant

Operating guidance for Claude Code in this project. **Read this file and `PROJECT_CONTEXT.md` before doing any work.**

## Roles & workflow
- **Read `PROJECT_CONTEXT.md` before implementing any checkpoint.** It is the canonical product/decision source.
- **Codex owns product logic, planning, sequencing and review gates.**
- **Claude Code is the implementation executor** and **must stop at each review gate.**
- **Never continue into another checkpoint without an explicit instruction.**

## Design system — a foundation, not a template
Design system location (**READ-ONLY**):
`/Users/anmol.maggon/Documents/ai-exp/AmbitionBox Repos_Understanding_Product/design-system`
Source files under `ai/`: `HOW-TO-USE.md`, `DESIGN-SYSTEM.md`, `tokens.css`, `components.css`, `components.json`, `references/`.

Treat this repository as read-only: **do not modify its generated files and do not copy the entire repository into this project.**

- The AmbitionBox design system is the **visual foundation and vocabulary — not a rigid template or a ceiling.**
- **Preserve AmbitionBox brand foundations:** colours, typography, spacing scale, accessibility, base controls and interaction fundamentals.
- **Prefer existing tokens and primitives over arbitrary values.**
- **Reuse existing components when they fit** — but do **not** force them when they make the experience feel generic, dashboard-like or less useful.

## Creative liberties (allowed — and expected for AI-first surfaces)
- Creative liberties are allowed for **page composition, hierarchy, AI intelligence surfaces, progressive disclosure, subtle depth/glow, motion, and new product-specific interactions.**
- **New visual patterns must remain recognisably AmbitionBox**, reuse existing foundations where possible, and stay **local / experimental until approved.**
- **Briefly document why a new pattern was necessary** when the design system did not cover it.
- **Mobbin references guide spacing, rhythm, hierarchy and motion — they are not templates to copy.**

## Source of truth
- **`PROJECT_CONTEXT.md` controls product decisions.** The **design system controls foundations, not product logic.**

## Hard stops
- Stop at every review gate.
- **Never begin the next checkpoint (or build a deferred module) without an explicit instruction.**
