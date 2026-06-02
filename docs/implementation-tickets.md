# Implementation Tickets: UX Flows to Production

## Scope

This backlog converts the UX spec into executable frontend and backend tickets with estimates, dependencies, and delivery order.

Related specs:

- docs/ux-user-flows-wireframes.md
- docs/architecture.excalidraw

Estimate scale:

- S = 2-4 hours
- M = 4-8 hours
- L = 8-16 hours

## Dependency Order Summary

1. FE-01 App shell and route structure
2. FE-02 API client and auth token plumbing
3. FE-03 Home/Today screen implementation
4. FE-04 Daily Check-In screen implementation
5. FE-05 Trends screen implementation
6. FE-06 Loading, empty, and error states
7. FE-07 Analytics instrumentation
8. FE-08 QA and usability pass
9. FE-09 Release hardening and deployment verification

Backend support tickets run in parallel where noted and should complete before FE integration checkpoints.

## Frontend Tickets

### FE-01: Build route skeleton for MVP screens

Description:

- Replace starter demo tabs/screens with app routes for Home/Today, Daily Check-In, and Trends.
- Keep existing theme and component patterns.

Deliverables:

- New or updated routes in src/app
- Navigation path from Home to Check-In and Trends

Acceptance criteria:

- User can navigate among Home, Check-In, and Trends without dead ends.
- Existing app starts and runs on web and mobile.

Estimate:

- M

Dependencies:

- None

### FE-02: Create API client and auth token handling

Description:

- Add centralized HTTP client using EXPO_PUBLIC_API_URL.
- Add token storage and auth header injection for protected endpoints.

Deliverables:

- API client module and request helpers
- Token persistence utilities

Acceptance criteria:

- Authenticated requests include Bearer token.
- API URL is environment-driven for local and Render use.

Estimate:

- M

Dependencies:

- FE-01
- BE-01

### FE-03: Implement Home/Today screen from wireframe

Description:

- Implement greeting, next check-in time, quick actions, and today summary metrics.
- Pull profile, latest check-in, and reminder data.

Deliverables:

- Home/Today UI matching UX contract
- Data fetch and state mapping

Acceptance criteria:

- Start Check-In routes to current-day check-in.
- View Trends routes to trends screen.
- Home reflects most recent same-day values when present.

Estimate:

- L

Dependencies:

- FE-02
- BE-02

### FE-04: Implement Daily Check-In flow

Description:

- Build check-in form for mood, sleep, energy, and symptoms with progress indicator.
- Support save draft and final save behavior.

Deliverables:

- Check-In form screen and validation
- Save/update integration with check-ins API

Acceptance criteria:

- Required fields enforced for final save.
- Save gives success or actionable error feedback.
- Unsaved edits are protected during accidental back navigation where feasible.

Estimate:

- L

Dependencies:

- FE-02
- BE-03

### FE-05: Implement Trends screen and range toggle

Description:

- Build weekly and monthly trends views with key metrics and insights.
- Add share summary trigger button with placeholder behavior if share export is phased.

Deliverables:

- Trends chart/list UI for week and month
- Integration to trends summary endpoint

Acceptance criteria:

- Week view is default.
- Month view is reachable in one action.
- Empty state provides direct path back to Start Check-In.

Estimate:

- L

Dependencies:

- FE-02
- BE-04

### FE-06: Standardize loading, empty, and error states

Description:

- Add consistent states across Home, Check-In, and Trends.
- Ensure copy and actions support recovery.

Deliverables:

- Reusable state components or patterns
- Screen-level fallback handling

Acceptance criteria:

- Every API-backed section has loading, empty, and error states.
- Error states include retry or next-step action.

Estimate:

- M

Dependencies:

- FE-03
- FE-04
- FE-05

### FE-07: Add analytics events for core flows

Description:

- Instrument key events from UX spec.
- Include event properties needed for flow conversion tracking.

Deliverables:

- Analytics event helper
- Event calls on screen view and key button actions

Acceptance criteria:

- Events emitted: home_viewed, checkin_started, checkin_saved_draft, checkin_submitted, trends_viewed_week, trends_viewed_month, summary_share_tapped.
- Events include timestamp, platform, and user context where available.

Estimate:

- M

Dependencies:

- FE-03
- FE-04
- FE-05

### FE-08: End-to-end UX QA pass

Description:

- Verify one-thumb mobile usability and visual consistency.
- Validate behavior under slow network and no-data conditions.

Deliverables:

- QA checklist pass report
- Bugfix PR for critical and high issues

Acceptance criteria:

- All MVP acceptance criteria in UX spec are met.
- No critical path blocker remains in Home, Check-In, or Trends.

Estimate:

- M

Dependencies:

- FE-06
- FE-07

### FE-09: Deployment and release hardening

Description:

- Verify production API URL wiring, error logging, and release build behavior.
- Smoke test Render-hosted frontend against deployed backend.

Deliverables:

- Release checklist completion
- Build verification notes

Acceptance criteria:

- Web build completes and loads with live API URL.
- Core user flows pass smoke test on deployed environment.

Estimate:

- S

Dependencies:

- FE-08

## Backend Tickets

### BE-01: Confirm auth contract and token lifecycle

Description:

- Finalize login/register response contract for frontend consumption.
- Document token expiry behavior and refresh strategy for MVP.

Deliverables:

- API contract notes
- Stable response shape for auth endpoints

Acceptance criteria:

- Frontend can reliably parse user and token payload from login/register.
- Auth errors return predictable status codes and messages.

Estimate:

- S

Dependencies:

- None

### BE-02: Home aggregate endpoint optimization

Description:

- Ensure profile + latest check-in + reminder fetch path is efficient.
- If needed, add a dedicated lightweight endpoint for Home payload.

Deliverables:

- Query optimization or new endpoint
- Ownership and date-scoping validation

Acceptance criteria:

- Home payload can be delivered in one request.
- p95 response time target under 500ms in development baseline.

Estimate:

- M

Dependencies:

- BE-01

### BE-03: Check-In upsert and validation hardening

Description:

- Enforce one check-in per user per day and required fields for final save.
- Support draft-state behavior if frontend uses draft mode.

Deliverables:

- Validation updates
- Consistent response and error payloads

Acceptance criteria:

- Duplicate same-day submissions upsert or reject according to defined contract.
- Validation errors return field-level clarity.

Estimate:

- M

Dependencies:

- BE-01

### BE-04: Trends summary reliability and range support

Description:

- Ensure trends endpoint supports week and month ranges with stable output schema.
- Add fallback behavior for sparse or missing data.

Deliverables:

- Trends service/controller updates
- Output schema documented for frontend

Acceptance criteria:

- Week and month responses share predictable metric keys.
- Empty datasets return non-error empty payload contract.

Estimate:

- M

Dependencies:

- BE-03

### BE-05: Analytics ingestion strategy decision

Description:

- Decide whether analytics are client-only, backend-proxied, or hybrid for MVP.
- If backend-proxied, add lightweight ingest endpoint with guardrails.

Deliverables:

- Decision record
- Optional ingest endpoint

Acceptance criteria:

- Event pipeline approach is documented and testable.
- No PII leakage in analytics payloads.

Estimate:

- S

Dependencies:

- BE-01

### BE-06: Test coverage for MVP flow contracts

Description:

- Add or update tests for auth, check-ins, trends, and profile/reminder payload assumptions.

Deliverables:

- Extended integration tests in test suite

Acceptance criteria:

- Passing tests cover successful and failure paths for the three primary UX flows.
- Contract changes are captured by tests.

Estimate:

- M

Dependencies:

- BE-02
- BE-03
- BE-04

## Suggested Sprint Plan

### Sprint 1

- FE-01
- FE-02
- FE-03
- BE-01
- BE-02

### Sprint 2

- FE-04
- FE-05
- BE-03
- BE-04

### Sprint 3

- FE-06
- FE-07
- FE-08
- FE-09
- BE-05
- BE-06

## Critical Path

Primary delivery path:

- FE-01 -> FE-02 -> FE-03 -> FE-04 -> FE-05 -> FE-06 -> FE-08 -> FE-09

Backend path that can block frontend integration milestones:

- BE-01 -> BE-02 and BE-03 -> BE-04 -> BE-06

## Definition of Done

- UX flow acceptance criteria from docs/ux-user-flows-wireframes.md are satisfied.
- Frontend and backend integration is validated in deployed environment.
- Core tests pass.
- No critical or high severity issues remain in Home, Check-In, Trends paths.
