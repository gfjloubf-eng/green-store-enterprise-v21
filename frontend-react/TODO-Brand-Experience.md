# Qutoof Nature — Brand Experience Integration (SAFE)

## Goal
Apply the official Qutoof Nature brand consistently across the application.
Focus ONLY on branding, dead-code cleanup, and production metadata.

## Steps
- [ ] 1. Delete unused Vite scaffold asset `src/App.css`
- [ ] 2. Delete unused Vite scaffold assets `src/assets/react.svg` + `src/assets/vite.svg`
- [ ] 3. Update `package.json` → name `qutoof-nature`, version `1.0.0`
- [ ] 4. Brand footer version string in `src/i18n/locale.ts`
- [ ] 5. Expand `index.html` production metadata (apple-touch-icon, og:image, twitter card, status bar)
- [ ] 6. Expand `manifest.webmanifest` PWA metadata (apple-touch-icon, display_override)
- [ ] 7. Verify `npm run build` → 0 TS errors, 0 build errors
- [ ] 8. Verify `npm run dev` → app starts, branding consistent, no broken assets
