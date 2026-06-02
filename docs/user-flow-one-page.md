# One-Page User Flow (Class Presentation)

## Goal

Show the complete user journey from entry point to key outcomes in a single page.

## Flow Legend

- Box = screen or system state
- Arrow label = user action or result
- Diamond = decision point

## Main User Flow

```mermaid
flowchart TD
  A[App Open] --> B{Authenticated?}

  B -- No --> C[Login or Register]
  C --> D{Auth success?}
  D -- No --> E[Auth error]
  E --> C
  D -- Yes --> H[Home Today]

  B -- Yes --> H

  H -- Tap Start Check-In --> I[Daily Check-In]
  H -- Tap View Trends --> J[Trends Week]
  H -- Open Reminders --> K[Reminder Settings planned]
  H -- Open Profile --> L[Profile and Preferences planned]

  I --> M{Save type}
  M -- Save Draft --> N[Draft Saved]
  N --> H
  M -- Final Save --> O{Validation and network OK?}
  O -- No --> P[Show error and keep form state]
  P --> I
  O -- Yes --> Q[Check-In Saved]
  Q --> H

  J -- Toggle Month --> R[Trends Month]
  R --> J
  J -- No data --> S[Empty state]
  S -- Start Check-In --> I
  J -- Share Summary --> T[Share action]
  T --> J

  U[Reminder Notification planned] --> V[Open app deep link planned]
  V --> I
```

## What This Proves

- Clear entry point and authentication branch
- End-to-end completion path for Daily Check-In
- Insight path for Trends and recovery path for empty data
- Planned reminder re-entry loop

## 30-Second Talk Track

1. User opens the app and either logs in or lands on Home.
2. From Home, the two core actions are Start Check-In and View Trends.
3. Check-In supports draft and final save, with validation and network error recovery.
4. Trends supports week and month views, sharing, and no-data fallback back to Check-In.
