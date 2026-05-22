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

## Environment Variables

Create a `.env` file in the root:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000
```

Important: use your machine's local IP address, not localhost, when connecting from a physical device.

## Project Docs

See the [docs](docs) folder for the project proposal and architecture diagram.
