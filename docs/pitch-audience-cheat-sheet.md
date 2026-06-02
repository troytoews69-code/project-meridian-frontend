# Pitch Audience Cheat-Sheet

Use this quick guide to choose which flow slide to present and in what order based on who is in the room.

## Slides Available

- Executive slide: docs/slide-user-flow-executive.md
- Technical slide: docs/slide-user-flow-technical.md
- Balanced slide: docs/slide-user-flow.md
- One-page flow backup: docs/user-flow-one-page.md

## 1) Instructor or Professor (Evaluation Focus)

Goal:
- Show clear product thinking, user value, and complete flow coverage.

Recommended deck order:
1. docs/slide-user-flow-executive.md
2. docs/slide-user-flow.md
3. docs/user-flow-one-page.md (only if asked for detail)

What to emphasize:
- Why this flow is low-friction for daily use.
- How flow supports assignment outcomes (UX intent plus implementation path).

Time split:
- 60% outcome and UX intent
- 40% implementation confidence

## 2) Non-Technical Stakeholders (Sponsors, Product, Community Partners)

Goal:
- Focus on impact, clarity, and user behavior change.

Recommended deck order:
1. docs/slide-user-flow-executive.md
2. docs/slide-user-flow.md

What to emphasize:
- Fast check-in loop.
- Trend insight value for appointments.
- Simplicity and trust for repeat daily use.

Time split:
- 80% value narrative
- 20% lightweight implementation notes

## 3) Technical Reviewers (Developers, TAs, Architects)

Goal:
- Prove state handling, validation, and error recovery are well-designed.

Recommended deck order:
1. docs/slide-user-flow-technical.md
2. docs/slide-user-flow.md
3. docs/user-flow-one-page.md (for complete branch discussion)

What to emphasize:
- Auth branching and retries.
- Validation and network failure behavior.
- Empty-state and recovery paths.

Time split:
- 30% UX intent
- 70% system behavior and reliability

## 4) Mixed Audience (Decision-Makers and Engineers Together)

Goal:
- Land business value first, then support with technical credibility.

Recommended deck order:
1. docs/slide-user-flow-executive.md
2. docs/slide-user-flow-technical.md
3. docs/slide-user-flow.md (optional bridge slide)

What to emphasize:
- Start with outcomes, then show feasibility.
- Keep transitions explicit: value -> flow -> reliability.

Time split:
- 50% value and user outcomes
- 50% architecture and edge-case handling

## 5) Demo Day or Capstone Showcase (Broad Audience, Limited Time)

Goal:
- Deliver a clean, memorable narrative with minimal complexity.

Recommended deck order:
1. docs/slide-user-flow.md
2. docs/slide-user-flow-executive.md (if one extra slide is allowed)

What to emphasize:
- The single core loop: Home -> Check-In -> Trends -> repeat.
- Why this matters for women over 40 tracking health patterns.

Time split:
- 70% story and outcomes
- 30% implementation confidence

## Fast Selection Rule

- If the room asks "Why does this matter?" start with executive.
- If the room asks "How will this actually work?" start with technical.
- If time is under 2 minutes, use only docs/slide-user-flow.md.
- If Q&A gets deep, open docs/user-flow-one-page.md as backup.
