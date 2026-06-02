# GitHub Issues Ready Backlog

Use this file to create issues quickly. Each section is a complete copy/paste issue body with title, labels, estimate, dependencies, and acceptance criteria.

## Frontend Repository Issues

Repository target:

- woman-over-40-health-app-frontend

Suggested labels:

- area:frontend
- type:feature
- type:tech-debt
- priority:p0
- priority:p1
- priority:p2
- size:S
- size:M
- size:L

### 1) FE-01 Build route skeleton for MVP screens

Title:
FE-01: Build route skeleton for MVP screens

Labels:
area:frontend, type:feature, priority:p0, size:M

Body:
Summary

- Replace starter demo screens with MVP routes for Home, Daily Check-In, and Trends.

Scope

- Update route files under src/app.
- Ensure Home can navigate to Check-In and Trends.
- Preserve existing theming and component conventions.

Dependencies

- None

Estimate

- M (4-8 hours)

Acceptance Criteria

- User can navigate among Home, Check-In, and Trends without dead ends.
- App runs successfully on web and mobile.

Definition of Done

- Route changes are merged.
- Navigation path is validated manually on web and Expo Go.

### 2) FE-02 Create API client and auth token handling

Title:
FE-02: Create API client and auth token handling

Labels:
area:frontend, type:feature, priority:p0, size:M

Body:
Summary

- Add centralized HTTP client and authenticated request plumbing.

Scope

- Add API base URL config from EXPO_PUBLIC_API_URL.
- Add token storage utility.
- Inject Bearer token for protected requests.

Dependencies

- FE-01
- BE-01

Estimate

- M (4-8 hours)

Acceptance Criteria

- Protected API requests include Authorization Bearer token.
- API URL is fully environment driven.
- Error handling returns usable messages to screen layer.

Definition of Done

- API client module is used by at least one screen.
- Manual test confirms authenticated and unauthenticated behavior.

### 3) FE-03 Implement Home Today screen from UX contract

Title:
FE-03: Implement Home Today screen from UX contract

Labels:
area:frontend, type:feature, priority:p0, size:L

Body:
Summary

- Implement Home screen with greeting, next check-in time, quick actions, and daily summaries.

Scope

- Display greeting and next check-in reminder time.
- Show quick actions Start Check-In and View Trends.
- Show today summary values for mood, sleep, energy.
- Map screen to profile, check-in, and reminder data.

Dependencies

- FE-02
- BE-02

Estimate

- L (8-16 hours)

Acceptance Criteria

- Start Check-In navigates to current-day check-in flow.
- View Trends opens trends screen.
- Latest same-day values are visible when data exists.

Definition of Done

- UI is responsive on common mobile widths.
- Loading, empty, and error placeholders exist.

### 4) FE-04 Implement Daily Check-In flow

Title:
FE-04: Implement Daily Check-In flow

Labels:
area:frontend, type:feature, priority:p0, size:L

Body:
Summary

- Build form for mood, sleep, energy, and symptoms with save behaviors.

Scope

- Add progress indicator.
- Add required controls for mood, sleep, and energy.
- Add symptom selection controls.
- Add Save Draft and Final Save behavior.

Dependencies

- FE-02
- BE-03

Estimate

- L (8-16 hours)

Acceptance Criteria

- Required fields are enforced for final save.
- Successful save provides user confirmation.
- Errors are shown with actionable guidance.
- Unsaved changes are protected on accidental navigation where feasible.

Definition of Done

- Check-in creates or updates same-day data correctly.
- Validation and edge states are test-covered manually.

### 5) FE-05 Implement Trends week and month views

Title:
FE-05: Implement Trends week and month views

Labels:
area:frontend, type:feature, priority:p0, size:L

Body:
Summary

- Build trends screen with default week view, month toggle, and insight list.

Scope

- Integrate trends summary endpoint.
- Render metric summaries for sleep, mood, and energy.
- Add month range toggle.
- Add Share Summary action trigger.

Dependencies

- FE-02
- BE-04

Estimate

- L (8-16 hours)

Acceptance Criteria

- Week view loads by default.
- Month view is reachable in one action.
- Empty state includes direct action to start first check-in.

Definition of Done

- Trends renders with full, partial, and empty datasets.
- Core interactions validated on web and mobile.

### 6) FE-06 Standardize loading empty error states

Title:
FE-06: Standardize loading empty error states

Labels:
area:frontend, type:tech-debt, priority:p1, size:M

Body:
Summary

- Add consistent state handling across Home, Check-In, and Trends.

Scope

- Create reusable loading/empty/error patterns.
- Apply patterns to all API-backed screen sections.
- Ensure retry or next-step actions are available.

Dependencies

- FE-03
- FE-04
- FE-05

Estimate

- M (4-8 hours)

Acceptance Criteria

- Every API-backed section has all three states.
- Error states provide recovery actions.

Definition of Done

- UX copy is consistent and non-technical.
- State handling is visually consistent across screens.

### 7) FE-07 Add analytics events for MVP flows

Title:
FE-07: Add analytics events for MVP flows

Labels:
area:frontend, type:feature, priority:p1, size:M

Body:
Summary

- Instrument core flow events from UX specification.

Scope

- Emit events: home_viewed, checkin_started, checkin_saved_draft, checkin_submitted, trends_viewed_week, trends_viewed_month, summary_share_tapped.
- Include event properties: userId, timestamp, platform, completionTimeSeconds where relevant.

Dependencies

- FE-03
- FE-04
- FE-05
- BE-05

Estimate

- M (4-8 hours)

Acceptance Criteria

- Events fire once per intended user action.
- Event payloads match agreed schema.

Definition of Done

- Event logging tested in development.
- No sensitive health details sent in analytics payload.

### 8) FE-08 End to end UX QA pass

Title:
FE-08: End to end UX QA pass for MVP flows

Labels:
area:frontend, type:feature, priority:p1, size:M

Body:
Summary

- Validate UX quality and flow stability across supported platforms.

Scope

- Test one-thumb usability on representative device sizes.
- Test poor network, no data, and API error behavior.
- Log and fix critical and high-severity issues.

Dependencies

- FE-06
- FE-07

Estimate

- M (4-8 hours)

Acceptance Criteria

- MVP acceptance criteria from UX spec are met.
- No critical-path blockers remain in Home, Check-In, Trends.

Definition of Done

- QA checklist completed.
- Critical and high bugs are resolved or accepted with explicit signoff.

### 9) FE-09 Release hardening and deployment verification

Title:
FE-09: Release hardening and deployment verification

Labels:
area:frontend, type:feature, priority:p2, size:S

Body:
Summary

- Final release checks for deployed environment.

Scope

- Validate production EXPO_PUBLIC_API_URL.
- Verify web build and hosted app smoke tests.
- Confirm observability/error logging behavior.

Dependencies

- FE-08

Estimate

- S (2-4 hours)

Acceptance Criteria

- Web build completes successfully.
- Deployed app passes smoke test for Home, Check-In, Trends.

Definition of Done

- Release checklist is complete.
- Any known limitations are documented.

## Backend Repository Issues

Repository target:

- woman-over-40-health-app-backend

Suggested labels:

- area:backend
- type:feature
- type:tech-debt
- priority:p0
- priority:p1
- priority:p2
- size:S
- size:M

### 10) BE-01 Confirm auth contract and token lifecycle

Title:
BE-01: Confirm auth contract and token lifecycle

Labels:
area:backend, type:feature, priority:p0, size:S

Body:
Summary

- Stabilize auth response contract and token behavior for frontend integration.

Scope

- Finalize login and register response payload shape.
- Document token expiry behavior and MVP refresh strategy.
- Ensure error responses are predictable.

Dependencies

- None

Estimate

- S (2-4 hours)

Acceptance Criteria

- Login/register payload shape is documented and stable.
- Auth errors return consistent status and message schema.

Definition of Done

- Contract notes are committed to backend docs or README.
- Frontend can parse auth responses without special-case logic.

### 11) BE-02 Optimize Home aggregate data path

Title:
BE-02: Optimize Home aggregate data path

Labels:
area:backend, type:feature, priority:p0, size:M

Body:
Summary

- Ensure Home can fetch profile, latest check-in, and reminder info efficiently.

Scope

- Optimize existing query path or add dedicated aggregate endpoint.
- Validate ownership and date scoping.

Dependencies

- BE-01

Estimate

- M (4-8 hours)

Acceptance Criteria

- Home payload available in a single request.
- p95 response under 500ms in development baseline.

Definition of Done

- Endpoint behavior documented.
- Integration validated with frontend Home screen.

### 12) BE-03 Harden check-in upsert and validation

Title:
BE-03: Harden check-in upsert and validation

Labels:
area:backend, type:feature, priority:p0, size:M

Body:
Summary

- Enforce same-day uniqueness and clear validation for final check-in saves.

Scope

- Guarantee one check-in per user per day contract.
- Add clear field-level validation responses.
- Support draft semantics if used by frontend.

Dependencies

- BE-01

Estimate

- M (4-8 hours)

Acceptance Criteria

- Duplicate same-day behavior is consistent with API contract.
- Validation errors map cleanly to frontend fields.

Definition of Done

- Endpoint tests cover create, update, and validation failures.

### 13) BE-04 Ensure trends summary reliability for week and month

Title:
BE-04: Ensure trends summary reliability for week and month

Labels:
area:backend, type:feature, priority:p0, size:M

Body:
Summary

- Provide predictable trends schema for week and month ranges.

Scope

- Support week and month range requests.
- Return stable metric keys and empty payload contracts.
- Handle sparse data without endpoint errors.

Dependencies

- BE-03

Estimate

- M (4-8 hours)

Acceptance Criteria

- Week and month outputs are schema-consistent.
- Empty dataset responses are non-error and parseable.

Definition of Done

- Frontend Trends screen can render without schema branching hacks.

### 14) BE-05 Decide analytics ingestion strategy for MVP

Title:
BE-05: Decide analytics ingestion strategy for MVP

Labels:
area:backend, type:tech-debt, priority:p1, size:S

Body:
Summary

- Define where analytics events are processed for MVP.

Scope

- Decide client-only vs backend-proxy vs hybrid.
- If backend-proxy chosen, add minimal ingest endpoint with guardrails.
- Define prohibited fields to prevent PII leakage.

Dependencies

- BE-01

Estimate

- S (2-4 hours)

Acceptance Criteria

- Strategy is documented and testable.
- Analytics payload policy excludes sensitive health details.

Definition of Done

- Decision record is committed.
- Integration expectations are clear for frontend team.

### 15) BE-06 Expand contract test coverage for MVP flows

Title:
BE-06: Expand contract test coverage for MVP flows

Labels:
area:backend, type:tech-debt, priority:p1, size:M

Body:
Summary

- Increase integration test coverage across auth, check-ins, trends, profile, and reminders.

Scope

- Add tests for successful and failure paths that power Home, Check-In, and Trends.
- Cover empty data and malformed input edge cases.

Dependencies

- BE-02
- BE-03
- BE-04

Estimate

- M (4-8 hours)

Acceptance Criteria

- Tests cover contracts used by frontend MVP screens.
- Test suite passes consistently in CI/local.

Definition of Done

- Contract regressions are caught by tests before release.

## Suggested Milestone Mapping

Sprint 1

- FE-01, FE-02, FE-03
- BE-01, BE-02

Sprint 2

- FE-04, FE-05
- BE-03, BE-04

Sprint 3

- FE-06, FE-07, FE-08, FE-09
- BE-05, BE-06
