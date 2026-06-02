# 5-Minute Talk Track

Use this script for a mixed audience. It balances user value and implementation confidence.

## Slide Order (Recommended)

1. docs/slide-user-flow-executive.md
2. docs/slide-user-flow-technical.md
3. docs/user-flow-one-page.md (only if there is time for questions)

## Time Plan

- 0:00-0:45: Problem and product goal
- 0:45-2:00: User flow and experience
- 2:00-3:30: Technical behavior and reliability
- 3:30-4:30: Delivery plan and readiness
- 4:30-5:00: Close and ask

## Script (Read-Friendly)

### 0:00-0:45 - Problem and Goal

"Women over 40 often track symptoms in scattered places, so patterns are hard to spot and hard to discuss in appointments. Our app gives one clear daily flow: quick check-in, trend visibility, and useful summaries."

"Our goal is simple: capture meaningful daily data in under 90 seconds, then turn it into insights users can act on."

### 0:45-2:00 - User Flow Story

"The user opens the app and either logs in or lands directly on Home. Home is the hub with two actions: Start Check-In and View Trends."

"In Check-In, the user records mood, sleep, energy, and optional symptoms. They can save draft or final. After save, they return to Home with updated same-day status."

"From Home, they can open Trends to review weekly and monthly patterns. If there is no data yet, the app provides a direct path back to Start Check-In, so there are no dead ends."

"This loop drives daily behavior: Home to Check-In to Trends and back to Home."

### 2:00-3:30 - Technical Confidence

"Technically, this flow is built around explicit state handling. Auth has a retry path. Final save has validation gates. Network failures preserve form state so users do not lose entries."

"Trends supports both data-present and empty-data states, and both are designed intentionally."

"On the backend, route families already exist for auth, check-ins, trends, reminders, and profile. The frontend plan maps screen-by-screen to those contracts."

### 3:30-4:30 - Delivery and Execution Plan

"Execution is sequenced with dependencies. Sprint 1 covers routes, API client, and Home. Sprint 2 delivers Check-In and Trends. Sprint 3 hardens loading and error states, analytics, QA, and release checks."

"This reduces risk by delivering the core value loop early, then improving reliability and polish."

### 4:30-5:00 - Close and Ask

"In summary, this is a practical flow with clear user outcomes, clear technical behavior, and a realistic delivery path."

"If helpful, I can go deeper either on outcomes or on technical state transitions, depending on this room's priorities."

## Filler Cuts (Use These If You Are Running Long)

- Replace "our app gives one clear daily flow" with "one clear daily flow".
- Replace "designed intentionally" with "intentional".
- Replace "depending on this room's priorities" with "as needed".
- If under time pressure, skip the final sentence in the 2:00-3:30 section.

## Likely Judge and Instructor Q&A

1. Why this flow first?
- It is the shortest path to recurring user value and measurable retention.

2. What if users skip days?
- Trends still render partial data and guide users back into the check-in loop without penalties.

3. How do you prevent friction?
- Large tap targets, minimal typing, required fields only where necessary, and recovery paths for errors.

4. How do you handle bad network conditions?
- We preserve form state locally, show a non-blocking error, and let users retry without re-entering data.

5. How do you protect user privacy?
- Data is user-scoped behind authenticated API access, and we avoid sending sensitive health details to analytics.

6. Why include draft save?
- Draft save lowers abandonment when users are interrupted, which is common in daily-life usage.

7. What is your MVP success metric?
- Check-in completion rate, repeat weekly usage, and percentage of users who view trends after check-in.

8. What is the biggest implementation risk?
- Inconsistent data states between frontend and backend; we reduce this with explicit API contracts and integration tests.

9. How will you validate usability?
- We run a focused QA pass on small-screen readability, one-thumb reachability, and error recovery paths.

10. Why is this different from a generic tracker?
- It is optimized for women over 40 with a focused daily loop and trend framing intended for real appointment conversations.
