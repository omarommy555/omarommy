# J.A.R.V.I.S 2.0

A mobile-first personal AI assistant starter built with Expo React Native and a Node.js API.

## Repository layout

- `app/` — Expo mobile application
- `server/` — Express API that calls Groq
- `.devcontainer/` — GitHub Codespaces development setup
- Root `package.json` — workspace convenience commands

## Start in GitHub Codespaces

1. Open this repository in GitHub Codespaces.
2. If the Codespace was created before `.devcontainer/devcontainer.json` was added, use **Codespaces: Rebuild Container** from the Command Palette. This installs the app and server dependencies automatically.
3. Open a terminal in the Codespace.
4. Start the mobile development server with `npm run start:app`.
5. Open the forwarded port 8081. For Expo Go, use the Expo QR code/link provided by the Expo CLI. If you are using only an iPhone, Codespaces in Safari is the coding workspace and Expo Go is the preview app; you may need to open the Expo link in Expo Go.

## Start the API

1. Create `server/.env` from `server/.env.example`.
2. Put a newly generated Groq key in `server/.env` as `GROQ_API_KEY=...`.
3. Start the API using `npm run start:api`.
4. The health endpoint is `/api/health` on forwarded port 8787.

In Codespaces, the API URL normally has the form `https://<your-codespace-name>-8787.app.github.dev`. Set `EXPO_PUBLIC_API_URL` in the app's local environment to that URL and restart Expo after changing it.

## Security

This repository is public. Never commit API keys, passwords, private data, or a real `.env` file. Provider keys must stay on the server, never in `EXPO_PUBLIC_*` variables. Use GitHub Codespaces secrets or a backend host's secret manager for sensitive values. If a key has been exposed, revoke it and create a new one.

## Current scope

Implemented: JARVIS-themed mobile dashboard, module placeholders, text chat UI, Express health endpoint, and Groq-backed chat endpoint.

Not yet implemented: voice input/output, authentication, persistent storage, reminders, live web research, image generation, business integrations, finance data, and analytics. These are planned development modules, not working features yet.
