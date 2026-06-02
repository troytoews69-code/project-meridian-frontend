# Slide: User Flow and System Behavior (Technical Audience)

## Headline

Authenticated flow with explicit validation, error recovery, and data-state handling.

## Diagram

```mermaid
flowchart TD
  A[App Open] --> B{Authenticated?}
  B -- No --> C[Login or Register]
  C --> D{Auth Success?}
  D -- No --> E[Auth Error State]
  E --> C
  D -- Yes --> H[Home Today]
  B -- Yes --> H

  H --> I[Start Check-In]
  I --> J[Check-In Form]
  J --> K{Final Save?}
  K -- No --> L[Save Draft]
  L --> H
  K -- Yes --> M{Valid Inputs?}
  M -- No --> N[Inline Validation Errors]
  N --> J
  M -- Yes --> O{API Success?}
  O -- No --> P[Error and Preserve Form State]
  P --> J
  O -- Yes --> Q[Persisted Check-In]
  Q --> H

  H --> R[View Trends]
  R --> S{Has Data?}
  S -- No --> T[Empty State and CTA to Check-In]
  T --> J
  S -- Yes --> U[Week Trends]
  U --> V[Month Trends]
```

## Speaker Script (4 Points)

1. Entry is gated by authentication with a defined retry path for auth failures.
2. Check-In supports draft and final save with field validation before persistence.
3. Network failures are recoverable because form state is preserved for user retry.
4. Trends handle both data-present and empty-data states with a clear recovery action.

## Room-Fit Notes

- Best for developers, TAs, technical reviewers, and architecture discussions.
- Focus on state transitions, failure handling, and implementation confidence.
