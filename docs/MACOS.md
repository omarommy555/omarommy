# JARVIS 2.0 — macOS setup

## Requirements

- Apple Silicon Mac (M1, M2, M3, M4, or later)
- macOS
- Node.js LTS and npm for development builds

## Development install

```bash
git clone -b jarvis-macos-desktop https://github.com/omarommy555/omarommy.git
cd omarommy
npm run install:all
cp server/.env.example server/.env
npm run start:desktop
```

Open the newly created `server/.env` file in a text editor and add your provider credential. The desktop app reads this file when it starts. Keep it private and never commit it.

## Configure an installed app

Click **Configure AI** inside JARVIS. The app opens its private settings file in the default text editor. Add a line such as:

```dotenv
GROQ_API_KEY=your_new_provider_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Save the file and restart JARVIS. Do not share the key in screenshots, chat messages, or GitHub.

## Build an Apple Silicon installer

```bash
npm run install:all
npm --prefix desktop run dist:mac
```

The DMG output is written to `desktop/dist/`. The configured target is macOS ARM64.

## First launch and security

This project is configured for unsigned local testing. macOS may warn that the app cannot be verified because it is not signed and notarized. Do not bypass security warnings for software from an unknown source. For distribution to other users, configure Apple Developer ID code signing and notarization.

The desktop renderer cannot run Node.js directly. Its privileged operations are limited to a context-isolated preload bridge. The bundled API listens on localhost only. The app does not provide arbitrary terminal execution or unrestricted file access.

## Current feature status

Working in the source implementation:
- Electron desktop shell
- Local API embedded in the Electron main process
- Existing Groq and Hugging Face-compatible chat providers
- API health and provider-configuration indicator
- macOS native text-to-speech using the system `say` command
- Local settings file opened through a controlled desktop action

Not implemented yet:
- Reliable always-on wake-word detection
- Native speech-to-text pipeline
- Project database and reminders
- Web research integration
- Image generation integration
- Business and finance data integrations
- Automatic computer control

The build configuration and source have not yet been run on the owner's physical Mac. Build and runtime validation must happen on macOS before treating the installer as production-ready.
