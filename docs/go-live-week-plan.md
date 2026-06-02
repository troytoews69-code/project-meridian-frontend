# Go-Live Week Plan

## Target

Launch the app by end of week with production backend, validated mobile flows, and rollback-ready deployment.

## Progress Checkpoint

- Day 3 of 7 status: Complete
- Checkpoint date: 2026-06-02
- Notes: Optimization, cleanup, and regression validation completed; continue with Day 4 quality freeze and release readiness tasks next.

## Definition of Live

- Frontend web build is deployed and reachable.
- Backend API is deployed and healthy.
- Frontend is configured with production API URL.
- iOS and Android smoke tests pass on physical devices.
- No blocker or critical defects remain open.

## Day-by-Day Execution

### Day 1: Environment and Deployment Setup

- Confirm production backend service URL.
- Confirm backend environment variables in Render:
  - MONGO_URI
  - JWT_SECRET
- Confirm frontend environment variable in Render:
  - EXPO_PUBLIC_API_URL (points to backend production URL)
- Deploy backend and run health checks:
  - GET /
  - GET /api/healthcheck
- Deploy frontend web build.

Exit criteria:

- Both frontend and backend URLs are live and reachable.
- Health checks return success.

### Day 2: End-to-End Mobile Validation

- Run iOS smoke flow from [docs/mobile-smoke-tests-1.0.md](docs/mobile-smoke-tests-1.0.md).
- Run Android smoke flow from [docs/mobile-smoke-tests-1.0.md](docs/mobile-smoke-tests-1.0.md).
- Verify core journeys:
  - Register/Login
  - Daily check-in create/detail
  - Trends week/month
  - Notes create/edit/pin/delete
  - Reminders create/toggle/delete
  - Profile update

Exit criteria:

- Full smoke passes on both platforms.
- Any defects captured with severity.

### Day 3: Fix and Retest

- Triage defects from Day 2.
- Fix only blocker/high defects.
- Re-run smoke tests on impacted flows.

Exit criteria:

- Blocker/high defects closed and verified.

### Day 4: Release Freeze and Demo Readiness

- Freeze scope (no new feature additions).
- Re-run quality gates:
  - Frontend: npx tsc --noEmit
  - Frontend: npx eslint src --ext .ts,.tsx
  - Frontend: npm run build:web
  - Backend: npm test
- Confirm release checklist completion in [docs/release-checklist-1.0.md](docs/release-checklist-1.0.md).
- Prepare demo account and seeded data.

Exit criteria:

- All quality gates green.
- Release checklist complete.

### Day 5: Go Live

- Deploy final approved frontend/backend revisions.
- Run final post-deploy checks:
  - Auth login
  - Check-in save
  - Trends load
  - Notes/reminders/profile updates
- Monitor logs and error rates for first 2 to 4 hours.

Exit criteria:

- Live users can complete the full core flow.
- No critical errors in initial monitoring window.

## Launch Risk Controls

- Freeze policy: only blocker fixes allowed after Day 4.
- Rollback policy: keep previous known-good deployment target available.
- Communication policy: one owner for release command, one owner for verification, one owner for incident response.

## Owner Checklist

- Product Owner: confirms scope freeze and launch sign-off.
- Engineering: confirms deploy + quality gates + rollback path.
- QA: confirms iOS and Android smoke pass.

## Fast Rollback Plan

- Revert frontend service to previous successful deploy.
- Revert backend service to previous successful deploy.
- Re-verify:
  - /api/healthcheck
  - Auth login
  - Check-in save

## Final Launch Gate

Launch only if all are true:

- Quality gates are green.
- Device smoke tests are green.
- No blocker/high defects are open.
- Rollback path is verified.
