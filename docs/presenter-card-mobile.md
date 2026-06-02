# Presenter Card (Phone View)

Use this as a single-screen prompt card during live delivery.

## 5-Minute Run of Show

### 0:00-0:30

Problem: women over 40 need one simple place to track daily symptoms and patterns.

### 0:30-1:00

Goal: complete check-ins in under 90 seconds and turn entries into meaningful trends.

### 1:00-1:45

Flow: App Open -> Login if needed -> Home hub.

### 1:45-2:30

Action path: Home -> Start Check-In -> Save -> Home.

### 2:30-3:15

Insight path: Home -> Trends week/month -> no-data fallback to Check-In.

### 3:15-4:00

Reliability: auth retry path, validation gates, and form-state recovery on network errors.

### 4:00-4:40

Delivery confidence: phased tickets, core loop first, then polish and QA.

### 4:40-5:00

Close: clear user value, clear flow logic, realistic implementation plan.

## Slide Sequence

1. docs/slide-user-flow-executive.md
2. docs/slide-user-flow-technical.md
3. docs/user-flow-one-page.md (optional for Q&A)

## Quick Pivot Lines

- Executive room: "This is about daily clarity and better appointment conversations."
- Technical room: "This is about predictable states, validation, and recoverability."
- Mixed room: "I will cover outcome first, then implementation confidence."

## 3 Fast Q&A Replies

- Why this flow first: shortest path to repeat value and retention.
- What if users miss days: partial data still works and nudges back into check-in.
- How friction stays low: minimal typing, large tap targets, and clear recovery states.
