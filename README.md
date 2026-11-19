# J.A.R.V.I.S 2.0

A personal AI assistant workspace with an Expo mobile starter, Node.js API, and an Apple Silicon-ready macOS desktop app.

## Project layout

- `app/` — Expo React Native application
- `server/` — Express API for mobile and development
- `desktop/` — Electron macOS application, bundled local API, and DMG build configuration
- `docs/ROADMAP.md` — implementation plan and module status
- `docs/MACOS.md` — macOS setup and packaging instructions

## Run on macOS (development)

Requirements: macOS, a current Node.js LTS release, and npm.

1. Clone the `jarvis-macos-desktop` branch.
2. Install dependencies: `npm run install:all`.
3. Create `server/.env` from `server/.env.example` if it does not exist.
4. Add a newly generated AI provider key to `server/.env` (for example, `GROQ_API_KEY`). Never commit `.env`.
5. Launch: `npm run start:desktop`.

The desktop application starts its own Express API inside the Electron main process. The API listens only on `127.0.0.1:8787`. Do not run a second API instance on that port at the same time.

## Build an Apple Silicon DMG

From the repository root:

```bash
npm run install:all
npm --prefix desktop run dist:mac
```

The Apple Silicon installer is generated in `desktop/dist/`. This build targets ARM64 Macs. The app is currently configured for local unsigned development distribution; macOS may show a Gatekeeper warning. Public distribution requires an Apple Developer ID signing certificate and notarization.

## AI configuration

In the desktop app, select **Configure AI**. This opens the local environment settings file in your default text editor.

- Development: `server/.env` in the cloned project.
- Packaged app: `server.env` inside the JARVIS application support folder under macOS Application Support.

Add a provider key such as `GROQ_API_KEY=your_new_key`, save, and restart JARVIS. Never paste API keys into chat, renderer code, or GitHub. The app creates the local settings file with owner-only permissions where supported.

## Desktop capabilities and current limitations

- Electron desktop window with context isolation and a restricted preload bridge.
- Local AI chat using the existing Groq and optional Hugging Face-compatible providers.
- Local API health and provider status.
- Native macOS speech output using the built-in `say` utility.
- Browser-runtime speech recognition where supported by the installed Electron/macOS runtime; otherwise text chat remains available.
- Navigation placeholders for projects, business, research, and image generation. Those integrations are not implemented yet.
- No unrestricted shell execution or automatic file modification is exposed to the renderer.

## Mobile and Codespaces

The Expo mobile app remains available with `npm run start:app`. For Codespaces, use the API and Expo setup documented in the existing project history and configure the forwarded API URL in `app/.env`.

## Security

This repository is public. Do not store secrets, personal records, financial account data, or production customer data here. The desktop API is bound to localhost. Before public multi-user deployment, add authentication, authorization, rate limiting, abuse controls, secure logging, persistent storage, and backups.
