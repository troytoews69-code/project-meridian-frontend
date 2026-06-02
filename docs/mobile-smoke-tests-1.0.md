# Mobile Smoke Tests 1.0

## Purpose

Quick end-to-end validation on physical iOS and Android devices against the production backend URL.

## Preconditions

- Backend is deployed and healthy.
- Frontend .env is set:
  EXPO_PUBLIC_API_URL=https://your-production-backend-url
- Device has Expo Go installed.
- You can create a new test account email.

## Environment Checks

1. Run backend health checks:
   - GET / and GET /api/healthcheck both return success.
2. Confirm frontend environment:
   - EXPO_PUBLIC_API_URL points to production backend.
3. Start Expo:
   - npx expo start --clear

## iOS Smoke Path

1. Open app in Expo Go from QR.
2. Register a new account.
3. Sign out and sign back in.
4. Home screen:
   - Personalized greeting is visible.
   - Time-based encouragement card is visible.
   - Save Message stores note successfully.
   - Share Message opens share sheet.
5. Check-In:
   - Submit values for mood, sleep, energy, symptom severity.
   - Confirm success and return to Home.
6. Trends:
   - Week view loads with non-empty aggregates.
   - Switch to month view and verify values render.
7. Notes:
   - Create a note.
   - Edit the note.
   - Pin and unpin.
   - Delete note.
8. Reminders:
   - Create reminder with days selected.
   - Toggle enabled state.
   - Delete reminder.
9. Profile:
   - Edit name and reminder time with valid HH:MM.
   - Save and verify updates reflected.
10. Relaunch app and confirm session restore.

## Android Smoke Path

Repeat the same flow as iOS.

## Pass Criteria

- No app crash or red screen.
- All CRUD actions return expected UI state updates.
- Auth session persists after app relaunch.
- Network errors show user-safe messages and app remains usable.

## Defect Log Template

- Device and OS:
- Screen:
- Steps to reproduce:
- Expected result:
- Actual result:
- Severity:
- Screenshot/video:

## Known Limitations for 1.0

- Deep-link reminder open flow is not fully implemented.
- AI-generated messaging is intentionally out of scope.
