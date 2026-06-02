# Release Checklist 1.0

## Scope Freeze

- No new features beyond current MVP routes.
- No AI integration in 1.0.
- Only blocker and high-severity bug fixes allowed.

## Code and Quality Gates

- Frontend:
  - npx tsc --noEmit passes.
  - npx eslint src --ext .ts,.tsx passes.
  - npm run build:web passes.
- Backend:
  - npm test passes.

## Functional Coverage

- Auth: register, login, logout, session restore.
- Home: profile load, latest check-in, encouragement actions.
- Check-In: create daily check-in and open detail.
- Trends: week and month data views.
- Notes: create, edit, pin, delete.
- Reminders: create, toggle, delete.
- Profile: update profile and preferences.

## Device Validation

- iOS smoke tests completed and signed off.
- Android smoke tests completed and signed off.
- Defects triaged and blocker list empty.

## Deployment Readiness

- Production backend URL configured in frontend environment.
- Backend healthcheck confirmed post-deploy.
- Web export artifact generated.

## Demo Readiness

- Demo account prepared with seeded data.
- 5-minute happy-path script tested once on each platform.
- Backup screenshot set prepared in case of connectivity issues.

## Sign-Off

- Product owner:
- Engineering:
- QA:
- Date:
