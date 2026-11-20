# AUTO DJ AI — Product & Technical Plan

## Product
AUTO DJ AI is a dark, professional, cross-platform DJ application for iOS, Android, web, Windows and macOS.

## Product promise
A user can build a queue, analyze compatible audio, and run an automatic DJ session with beat-aware transitions where the source and platform permit full audio access.

## Platform strategy
- iOS and Android: Expo / React Native application, with native audio modules for production playback and mixing.
- Web: Expo web-compatible interface; browser audio capabilities and user-gesture/autoplay rules apply.
- Windows and macOS: desktop shell (Tauri) around the shared web UI, with native audio integration where required.
- Shared TypeScript domain models, queue logic, settings and design system.

## Audio and provider boundaries
- Local files: primary MVP source. Users explicitly select/import files; analyze metadata and audio locally where feasible. Implement two-deck playback, gain, crossfade, beat-grid/BPM analysis and transition scheduling.
- Apple Music: investigate MusicKit-supported catalog/library/playback features for each target platform. Do not extract protected streams, bypass DRM, or promise unrestricted mixing of subscription tracks. Only expose controls permitted by Apple's APIs and terms.
- Spotify and other streaming providers: use only official, currently permitted SDK/API capabilities. Do not capture, record, modify, or mix protected streams. A provider connection may offer search, playlist handoff, metadata or authorized playback controls rather than DJ mixing.
- Never request or store streaming-service passwords. Use official authorization flows.
- No claim of universal service support until each provider's current developer terms and platform support are verified.

## MVP scope
1. Dark responsive application shell and navigation.
2. Local music library import / file picker.
3. Track list, queue and playlist management.
4. Audio metadata display (duration, BPM and key when available).
5. Two-deck local playback with play/pause, cue, gain and crossfader.
6. Automatic queue mode with safe crossfade on compatible audio.
7. Session state and basic settings.
8. Tests for queue transitions, timing and state management.

## Later milestones
- Beat-grid alignment and tempo matching.
- Improved BPM/key analysis and transition recommendations.
- Apple Music MusicKit integration, subject to platform eligibility and terms.
- Additional provider adapters, each separately reviewed for permitted capabilities.
- Desktop controller / MIDI mapping and audio-device routing.
- Authentication, sync and cloud playlists only after the local-first MVP.

## Quality requirements
- Do not claim a feature works until implemented and tested on the target platform.
- Gracefully degrade when browser, OS, codec, provider or audio-device APIs are unavailable.
- Keep secrets on a server; never commit credentials or tokens.
- Provide clear permissions, privacy disclosures and user control over playback.
- Design for accessible contrast, keyboard navigation and responsive layouts.

## Current milestone
Repository branch: `feature/auto-dj-ai`.
Initial work: product scope, platform boundaries and implementation sequence. Next: inspect the existing Expo app structure and implement the first responsive DJ console without disrupting the existing JARVIS project.
