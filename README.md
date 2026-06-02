# women-over-40-health-app - Frontend

React Native mobile app for women-over-40-health-app, built with Expo.

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
