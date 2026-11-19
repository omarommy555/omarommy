# J.A.R.V.I.S 2.0

A personal AI assistant workspace with an Expo mobile starter, Node.js API, and a macOS desktop shell.

## Project layout

- `app/` — Expo React Native application
- `server/` — Express API; AI provider keys stay on the server
- `desktop/` — Electron macOS desktop application
- `.devcontainer/` — GitHub Codespaces configuration
- `docs/ROADMAP.md` — implementation plan and module status

## Run on macOS

Requirements: macOS, a current Node.js LTS release, and npm.

1. Clone the repository and open its folder in Terminal.
2. Install dependencies: `npm run install:all`.
3. Create `server/.env` using `server/.env.example` as a template.
4. Add a newly generated AI provider key to `server/.env` (for example, `GROQ_API_KEY`). Never put provider keys in the desktop renderer or commit `.env`.
5. Launch the desktop app: `npm run start:desktop`.

The Electron main process starts the local Express API and opens the desktop window. The API listens on port 8787. If another process is already using that port, stop it before launching the desktop app. To run the API separately for debugging, use `npm run start:api`.

## Desktop capabilities and current limitations

- Electron desktop window with an isolated preload bridge and context isolation.
- Chat UI connected to the existing local AI API.
- API health and provider-configuration status.
- Optional speech output and browser-runtime speech recognition where supported and permitted.
- Navigation placeholders for projects, business, research, and image generation. These modules are not integrations yet.
- No unrestricted shell execution or automatic file modification is exposed to the renderer.

Voice recognition support depends on the Electron/macOS runtime and microphone permission. If unavailable, text chat remains usable.

## Mobile and Codespaces

The Expo mobile app remains available with `npm run start:app`. For Codespaces instructions and iPhone networking notes, see the existing setup guide below.

## AI provider configuration

Groq is the primary provider. Hugging Face is an optional fallback if `HF_TOKEN` is configured. Both secrets belong only in the server environment. Use newly generated credentials and revoke any credential previously pasted into a chat or committed to a repository.

## Security

This repository is public. Do not store secrets, personal records, financial account data, or production customer data here. The API is a local development service, not a production multi-user service. Before public deployment, add authentication, authorization, rate limiting, abuse controls, secure logging, persistent storage, and backups. Keep the API bound to localhost for desktop-only use and do not expose port 8787 publicly while testing.

## Existing Codespaces setup

1. Open this repository in GitHub Codespaces.
2. If your Codespace predates the devcontainer setup, run **Codespaces: Rebuild Container** from the Command Palette.
3. Open a terminal. Run `npm run install:all` if dependencies are not installed.
4. Add your provider key as a Codespaces secret or create `server/.env`. Never commit `.env`.
5. Start the API with `npm run start:api`.
6. In the Codespaces **Ports** panel, keep port `8787` private unless public access is intentionally required. Open its forwarded URL and append `/api/health` to test it.
7. Set `EXPO_PUBLIC_API_URL` in `app/.env` to the forwarded API URL, without a trailing slash.
8. Start Expo with `npm run start:app`.
