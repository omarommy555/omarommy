# J.A.R.V.I.S 2.0

A mobile-first personal AI assistant starter using Expo React Native and a Node.js API.

## Project layout

- `app/` — Expo mobile application
- `server/` — Express API that calls Groq
- `server/.env.example` — server environment template
- `app/.env.example` — mobile API URL template

## Security

This repository is public. **Never commit API keys, passwords, private data, or a real `.env` file.** The Groq key belongs only in `server/.env` locally or in your backend host's secret manager. The mobile app must call your backend; never put provider keys in `EXPO_PUBLIC_*` variables.

If a key has been exposed, revoke it and create a new one.

## Run the backend

1. Open a terminal in `server/`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put your new Groq key in `server/.env`.
5. Run `npm run dev`.
6. Test `http://localhost:8787/api/health`.

## Run the mobile app

1. Open another terminal in `app/`.
2. Run `npm install`.
3. Set `EXPO_PUBLIC_API_URL` to the reachable backend URL. For a physical iPhone, do not use `localhost`; use your laptop's LAN IP or a deployed HTTPS backend.
4. Run `npx expo start --tunnel` if local network discovery is unreliable.
5. Open the project with Expo Go.

## Current scope

The starter includes a JARVIS-themed dashboard, module placeholders, a chat interface, a health endpoint, and a Groq-backed chat endpoint. Voice, authentication, persistent storage, reminders, web research, image generation, business integrations, finance data, and analytics are future modules and are not implemented yet.
