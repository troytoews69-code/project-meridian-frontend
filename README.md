# Women Over 40 Health App — Frontend

## Project Overview

A production-ready, full-stack mobile health application addressing a critical gap in women's healthcare technology. This React Native app serves as a comprehensive daily health companion for women navigating perimenopause and menopause—a market of 47 million women in the US alone, experiencing an underserved life transition lasting 7-10 years.

### The Problem
Women in midlife face complex, interconnected symptoms (mood changes, sleep disruption, hot flashes, brain fog) but lack tools designed specifically for their biology. Existing solutions are either period trackers built for younger demographics or clinical symptom loggers with poor user experience. Medical appointments average 12 minutes, leaving patients unable to effectively communicate complex symptom patterns.

### The Solution
This application provides:
- **Daily check-in system** capturing mood, sleep quality, energy, symptoms, and menstrual flow
- **Trend visualization** revealing patterns across weeks and months
- **Evidence-based educational content** informed by current women's health research
- **Doctor report generation** providing 30-day summaries for medical appointments
- **Medication & appointment reminders** with local push notifications
- **Private journaling** for personal reflection
- **Thoughtful UI/UX** with warm, intentional design (rose tones, sage greens) prioritizing comfort over clinical sterility

### Technical Implementation
**Frontend (this repository):**
- React Native with Expo SDK 55 (cross-platform iOS/Android)
- TypeScript throughout (zero compiler errors)
- Context API for global state management (authentication, user data)
- Custom theming system with light/dark mode support
- Expo Notifications for local push reminders
- Secure token storage via expo-secure-store
- EAS Build for cloud-compiled native binaries
- Comprehensive onboarding flow collecting user health profile on first launch

**Backend (separate repository):**
- Node.js/Express REST API
- MongoDB with Mongoose ODM for data persistence
- JWT authentication with bcrypt password hashing
- Protected routes with middleware-based authorization
- Deployed to Render with automatic deploys from main branch

**Key Technical Achievements:**
- Built complete authentication flow from scratch (signup, login, token refresh, secure storage)
- Implemented complex data aggregation for trend analysis across multiple health metrics
- Designed and executed full production deployment pipeline (EAS Build → APK distribution)
- Created reusable component library with consistent theming
- Optimized for real-world mobile constraints (offline scenarios, token expiration, network errors)

### Professional Deployment
- Live REST API hosted on Render.com
- Android APK built via Expo Application Services (EAS)
- Distributed via direct download and Expo links
- Source code available on GitHub (public repositories)
- Ready for Google Play Store submission

### Impact & Market
- Addresses $600B+ global menopause market
- Targets rapidly growing femtech sector ($75B projected by 2030)
- Serves high-value demographic (ages 40-60) with disposable income
- Demonstrates understanding of healthcare UX, accessibility, and patient empowerment

This project showcases end-to-end mobile development skills, from ideation and user research through backend architecture, frontend implementation, and production deployment—all with attention to real user needs and professional software engineering practices.

---

## How to Install & Run the App

There are three ways to get the app running on your Android phone. Pick whichever is easiest.

---

### Option 1 — Install via APK file (simplest, no accounts needed)

1. Download the APK file provided to you (filename: `women-over-40-health-app.apk`)
2. Transfer it to your Android phone — email it to yourself, upload to Google Drive, or copy via USB
3. Open the file on your phone using your file manager (Files app, My Files, etc.)
4. If prompted, tap **"Install anyway"** or enable **"Install unknown apps"**:
   - Go to **Settings → Apps → Special app access → Install unknown apps**
   - Find your file manager or browser → toggle **"Allow from this source"** ON
5. Tap **Install** — the app will appear in your app drawer as **Women Over 40**

> **Note:** You may see a Google Play Protect warning — tap **"Install anyway"**. This is normal for APKs distributed outside the Play Store.

---

### Option 2 — Install via Expo link (easiest, just tap a link)

1. On your Android phone, open this link in your browser:
   **https://expo.dev/accounts/moodysprite/projects/women-over-40-health-app/builds/c12d0353-d9ea-4fde-9622-64a5fbe76b91**
2. Tap **Download** on the page
3. Open the downloaded APK and follow the same install steps as Option 1 (step 4–5 above)

---

### Option 3 — Review the source code on GitHub

- **Frontend (this repo):** https://github.com/troytoews69-code/project-meridian-frontend
- **Backend:** https://github.com/troytoews69-code/project-meridian-backend

The frontend is a React Native / Expo app (TypeScript). The backend is Node.js / Express with MongoDB, deployed on Render.

---

## Pitch Day Talk Track

> Use this section when presenting to investors, judges, or stakeholders. Adapt the tone to the room.

### The Problem (30 seconds)

Forty-seven million women in the United States are currently in perimenopause or menopause. The average woman spends 7 to 10 years in this transition. During that time she will experience mood swings, sleep disruption, brain fog, hot flashes, joint pain, weight shifts, and changes to her heart health and bone density — often all at once, often without answers.

She goes to her doctor. She gets 12 minutes. She has no data. She leaves with a shrug and a pamphlet.

There is no app built specifically for her. There are period trackers built for 22-year-olds. There are symptom loggers that look like spreadsheets. There is nothing warm, intelligent, and designed around the actual biology of this life stage.

Until now.

---

### The Product (60 seconds)

**Women Over 40** is a daily health companion for women in perimenopause and menopause.

Every morning she opens the app and does a quick check-in — mood, sleep quality, energy, symptoms, and period flow. Over time the app builds a picture of her patterns. She can see her trends week over week. She can read evidence-based articles informed by leading women's health research. She can set reminders for supplements, medications, and appointments. She can write private notes about how she's feeling.

And when she walks into that 12-minute appointment, she hits one button — **Generate Doctor Report** — and hands her doctor a clean summary of the last 30 days. Mood trends. Sleep patterns. Symptom frequency. Period changes. In 30 seconds she becomes the most prepared patient in the waiting room.

The app was built with warmth. Warm rose tones, sage greens, soft purples. Not a clinical tool. A companion.

---

### The Tech (30 seconds, for technical audiences)

- React Native with Expo SDK 55, targeting iOS and Android
- Node.js / Express backend deployed on Render
- MongoDB for user data and health history
- JWT authentication with secure token storage on device
- EAS Build for cloud-compiled native APKs
- Onboarding flow that captures menopause stage and priority symptoms on first launch
- Full TypeScript, zero compiler errors

---

### The Market (30 seconds)

The global menopause market is valued at over $600 billion and growing. The femtech market is projected to reach $75 billion by 2030. Digital health apps are one of the fastest-growing categories in the App Store and Google Play.

The women who need this app are 40 to 60 years old. They have disposable income. They are underserved by existing technology. And they are increasingly vocal about demanding better.

---

### The Ask

We are looking for partners who believe that women in the second half of their lives deserve technology built *for* them — not adapted from tools designed for someone else.

This app exists. It works. It is on device today.

Let's talk about what comes next.

---

## Prerequisites

- Node.js installed
- Expo Go app installed on your phone
- Backend server running (see woman-over-40-health-app-backend repo)

## Setup

1. Clone the repository

   ```bash
   git clone https://github.com/YOUR_USERNAME/woman-over-40-health-app-frontend.git
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the Expo development server

   ```bash
   npx expo start
   ```

4. Scan the QR code with Expo Go on your phone

## Render Deployment

This project can be deployed to Render as a static site.

Build command:

```bash
npm install && npm run build:web
```

Publish directory:

```bash
dist
```

The app expects a public backend URL in `EXPO_PUBLIC_API_URL`.

## Environment Variables

Create a `.env` file in the root:

```env
EXPO_PUBLIC_API_URL=https://your-backend.onrender.com
```

For local development, point this variable to your local machine's IP and port. For Render, set it to the deployed backend service URL.

## Project Docs

See the [docs](docs) folder for:

- Project proposal: [docs/proposal.md](docs/proposal.md)
- Architecture and design board: [docs/architecture.excalidraw](docs/architecture.excalidraw)
- UX user flows and wireframes spec: [docs/ux-user-flows-wireframes.md](docs/ux-user-flows-wireframes.md)
- One-page presentation user flow: [docs/user-flow-one-page.md](docs/user-flow-one-page.md)
- Single-slide presentation version: [docs/slide-user-flow.md](docs/slide-user-flow.md)
- Executive slide version: [docs/slide-user-flow-executive.md](docs/slide-user-flow-executive.md)
- Technical slide version: [docs/slide-user-flow-technical.md](docs/slide-user-flow-technical.md)
- 5-minute presentation talk track: [docs/talk-track-5-minute.md](docs/talk-track-5-minute.md)
- 5-minute cue cards (ultra-short): [docs/talk-track-5-minute-cue-cards.md](docs/talk-track-5-minute-cue-cards.md)
- Presenter card (phone view): [docs/presenter-card-mobile.md](docs/presenter-card-mobile.md)
- Audience cheat-sheet and deck order: [docs/pitch-audience-cheat-sheet.md](docs/pitch-audience-cheat-sheet.md)
- Implementation ticket backlog: [docs/implementation-tickets.md](docs/implementation-tickets.md)
- GitHub Issues ready copy/paste blocks: [docs/github-issues-ready.md](docs/github-issues-ready.md)
- Mobile device smoke tests (1.0): [docs/mobile-smoke-tests-1.0.md](docs/mobile-smoke-tests-1.0.md)
- Release checklist (1.0): [docs/release-checklist-1.0.md](docs/release-checklist-1.0.md)
- Go-live week plan: [docs/go-live-week-plan.md](docs/go-live-week-plan.md)
