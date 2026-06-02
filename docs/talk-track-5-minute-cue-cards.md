# 5-Minute Cue Cards (Ultra-Short)

Use this as a quick speaker-notes sheet. One line per cue.

## Slide Order

1. docs/slide-user-flow-executive.md
2. docs/slide-user-flow-technical.md
3. docs/user-flow-one-page.md (only if asked)

## Time Cues and One-Liners

### 0:00-0:30

Problem: symptom tracking is scattered, so patterns are hard to see.

### 0:30-1:00

Goal: complete check-in in under 90 seconds and convert entries into trends.

### 1:00-1:40

Flow: App Open -> Login if needed -> Home hub with two actions.

### 1:40-2:20

Check-In: mood, sleep, energy, optional symptoms, save, return to Home.

### 2:20-3:00

Trends: week and month views, plus no-data fallback to Start Check-In.

### 3:00-3:40

Reliability: validation gates, auth retry, preserved form state on network errors.

### 3:40-4:20

Delivery: core loop first, then polish, QA, and release hardening.

### 4:20-5:00

Close: practical UX flow, clear technical behavior, realistic implementation plan.

## Rapid Q&A Prompts

- Why this first: shortest path to recurring user value and retention.
- Why users return: fast logging plus visible trend insights.
- Risk control: explicit error states, empty states, and validation rules.

## Judge and Instructor Fast Answers

- Privacy: authenticated user-scoped data, no sensitive detail in analytics payloads.
- Missed days: partial data still renders and nudges users back into the flow.
- Reliability: users can retry failed saves without losing form entries.
