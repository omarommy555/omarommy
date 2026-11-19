# J.A.R.V.I.S 2.0 — Product Roadmap

## Product direction

A personal mobile AI command center for the owner's work, projects, planning, and everyday questions. The interface should be fast, calm, secure, and useful rather than pretending that unfinished integrations are active.

## Phase 1 — Foundation

- [x] Expo React Native mobile shell
- [x] Dark cyan JARVIS dashboard
- [x] Text chat interface
- [x] Node/Express backend
- [x] Groq chat integration
- [x] Optional Hugging Face provider fallback
- [x] Codespaces configuration and setup documentation
- [ ] Run the app successfully on a physical iPhone
- [ ] Verify API connectivity from the iPhone

## Phase 2 — Reliability and identity

- [ ] User authentication and secure sessions
- [ ] Per-user authorization
- [ ] Rate limiting and abuse prevention
- [ ] Persistent database and conversation history
- [ ] User preferences and assistant profile
- [ ] Error reporting, health monitoring, and backups

## Phase 3 — Assistant capabilities

- [ ] Voice-to-text input with explicit microphone permission
- [ ] Text-to-speech responses with user-controlled playback
- [ ] Reminder creation, editing, and push notifications
- [ ] Web research with source links and citations
- [ ] Image generation integration
- [ ] Searchable personal notes and files

## Phase 4 — Workspaces

- [ ] Project tracker: tasks, owners, due dates, status
- [ ] Business dashboard: sales, expenses, inventory, reports
- [ ] Finance dashboard using manually entered or authorized data
- [ ] Analytics and charts
- [ ] Exportable summaries and reports

## Phase 5 — Production

- [ ] Deploy API to managed hosting
- [ ] Configure secrets in the host's secret manager
- [ ] Configure HTTPS, domain, monitoring, and backups
- [ ] Add privacy policy and data deletion controls
- [ ] Test on supported iPhone sizes and accessibility settings
- [ ] Build iOS app with Expo EAS and prepare App Store review

## Current truth

Only the Phase 1 starter foundation is in the repository. The unchecked items are not active features. Do not connect bank accounts, store sensitive personal information, or expose an unprotected production API until the security work is complete.
