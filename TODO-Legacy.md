# Legacy TODOs (React/Tailwind/Vite)

> هذا الملف منفصل للحفاظ على وضوح `TODO-steps.md` لمسار Enterprise Foundation فقط.

## Ultra Modern React Transformation TODO

### Status: 0/15 ✅ Completed

#### Phase 1: Project Setup (1/3)
- [x] Step 1: Create Vite React+TS project in frontend-react/ via `npm create vite@latest frontend-react -- --template react-ts`
- [x] Step 2: Install core deps: `npm i react-router-dom zustand framer-motion @react-three/fiber three @react-three/drei lucide-react`
- [x] Step 3: Install UI/3D/Perf deps: `npm i tailwindcss postcss autoprefixer @headlessui/react @radix-ui/react-slot clsx tailwind-merge tsparticles/react react-use lenis use-sound @tanstack/react-virtual`

#### Phase 2: Config & Base (2/4)
- [ ] Step 4: Setup TailwindCSS + global neon/glassmorphism CSS
- [ ] Step 5: Vite config: proxy /api -> ../api.php, RTL support
- [ ] Step 6: App.tsx base: Router + ThemeProvider + Canvas + LenisScroll
- [ ] Step 7: Copy assets /photo/ /images/ to public/

#### Phase 3: Components (4/6)
- [ ] Step 8: UI primitives: Button3D, CardGlass, NeonInput (shadcn-style)
- [ ] Step 9: 3D: ParticleBg.tsx, HeroGlobe.tsx, ProductCard3D.tsx
- [ ] Step 10: Layout: HeaderNav.tsx (neon nav), CustomCursor.tsx, ThemeToggle.tsx
- [ ] Step 11: Hooks: useCart.ts, useProducts.ts (zustand + api fetch)
- [ ] Step 12: Common: LoadingSpinner3D.tsx, MicroSFX.tsx

#### Phase 4: Pages (3/4)
- [ ] Step 13: Home.tsx (3D Hero + ProductsGrid + About/Contact glassmorphic)
- [ ] Step 14: Products.tsx (search + infinite 3D grid), Cart.tsx (3D cart + checkout)
- [ ] Step 15: Others (delivery/login stubbed)

#### Phase 5: Polish & Test (0/2)
- [ ] Step 16: Add parallax scroll cam, hover effects, PWA manifest
- [ ] Step 17: Test perf, build `npm run build`, update original index.html link

**Next Action:** Execute via TODO-steps.md. Phase 2 next.

**Status:** 3/17 ✅ Plan approved. TODO-steps.md created.

**Usage after completion:**
1. `cd frontend-react`
2. `npm install`
3. `npm run dev` → http://localhost:5173 (APIs proxied)
4. `npm run build` → dist/ for prod (copy to XAMPP htdocs)

