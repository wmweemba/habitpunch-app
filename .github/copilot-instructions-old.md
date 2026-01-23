# HabitPunch AI Coding Instructions

## Architecture Overview

This is a **monorepo** with two apps sharing common patterns but different runtimes:
- `apps/mobile/` - React Native (Expo 54) with web support via react-native-web
- `apps/web/` - React Router 7 SPA with Hono backend and Neon PostgreSQL

### Mobile App (`apps/mobile/`)

**File-based routing**: Uses Expo Router 6 with file-based navigation in `src/app/`. The `(tabs)/` directory contains bottom tab navigation screens.

**Cross-platform polyfills**: Platform-specific implementations live in `polyfills/`:
- `polyfills/web/*.web.{tsx,jsx}` - Web-only implementations (alerts, notifications, maps, etc.)
- `polyfills/native/*.native.jsx` - Native-only implementations  
- `polyfills/shared/*.tsx` - Shared cross-platform code

**Important**: React Native Web doesn't support all native APIs. Check `polyfills/web/` before using Expo modules - many have custom web implementations (e.g., `alerts.web.tsx` replaces native Alert API with modal dialogs).

**Patches**: This project heavily patches npm packages. After installing dependencies, `patch-package` runs automatically via postinstall hook. Current patches in `apps/mobile/patches/` include:
- expo-router, expo-cli, metro-runtime (routing fixes)
- react-native-purchases (RevenueCat integration)
- sonner-native (toast notifications)
- react-native-web-refresh-control (pull-to-refresh on web)

**Never modify node_modules directly** - use `npx patch-package <package-name>` to create/update patches.

### Web App (`apps/web/`)

**React Router 7**: File-based routing in `src/app/` with SSR enabled. Routes are defined in `routes.ts`.

**Backend**: Hono server in `__create/index.ts` handles:
- Auth.js (Credentials provider with Argon2 hashing)
- Custom Neon PostgreSQL adapter (`__create/adapter.ts`)
- API routes via route builder pattern (`__create/route-builder.ts`)
- CORS, request tracing, WebSocket proxy

**Vite configuration**: Custom plugins in `plugins/` for:
- Aliasing packages (e.g., `@auth/create/react` → `@hono/auth-js/react`)
- Loading fonts from Tailwind config
- Auto-restart on env file changes
- Adding render IDs for debugging

## Development Workflows

### Starting the apps
```bash
# Mobile (from root)
npm run dev:mobile

# Mobile with tunnel (for network issues)
cd apps/mobile && npx expo start --tunnel

# Mobile with cache clear
cd apps/mobile && npx expo start --clear

# Web (from root)
npm run dev:web
```

### Adding dependencies
Always run `npm install` from the workspace directory (`apps/mobile/` or `apps/web/`), not root. The root `package.json` manages workspaces but dependencies are app-specific.

### Creating patches
If you need to modify a package:
1. Edit files in `node_modules/<package>/`
2. Run `npx patch-package <package-name>` from `apps/mobile/`
3. Patch file is auto-created in `apps/mobile/patches/`

## Project-Specific Conventions

### State Management (Mobile)
- **Zustand** for global state (see `src/utils/auth/useAuthModal.jsx` for pattern)
- **React Query** configured in `_layout.jsx` with 5min stale time, 30min cache
- **Expo SecureStore** for persistent data (see web polyfill at `polyfills/web/secureStore.web.ts`)

### Styling (Mobile)
- **NativeWind** for Tailwind-like styling (`global.css`, `global.d.ts`)
- Platform-specific styles when needed (`.web.tsx` vs `.native.jsx` extensions)
- Custom theme system via `utils/theme` with `useAppTheme()` hook

### Components (Mobile)
- Default exports preferred (see all components in `src/components/`)
- Haptics on interactions: `import * as Haptics from 'expo-haptics'`
- Fonts loaded via `@expo-google-fonts` with `useFonts()` hook pattern (see `PunchCard.jsx`)
- Animations use `react-native-reanimated` and `Animated` API

### Authentication
**Mobile**: WebView-based auth flow proxies to web backend
- `useAuthModal()` opens modal WebView to web auth page
- `useRequireAuth()` hook auto-protects screens
- Auth state in Zustand store at `utils/auth/store`

**Web**: Auth.js with credentials provider
- Session stored in database via Neon adapter
- Custom route protection via `isAuthAction()` helper

### Environment Variables
- Mobile: Prefix with `EXPO_PUBLIC_` to expose to client (e.g., `EXPO_PUBLIC_BASE_URL`)
- Web: Prefix with `NEXT_PUBLIC_` (legacy naming, aliased in Vite config)
- Mobile uses both `EXPO_PUBLIC_PROXY_BASE_URL` and `EXPO_PUBLIC_BASE_URL` for auth flow

## Key Integration Points

### RevenueCat (Mobile Only)
- Initialized in `_layout.jsx` via `initializeRevenueCat()`
- Premium features gated by subscription status
- Test mode can force premium via `setPermanentPremium()`

### Database (Web Only)
- Neon serverless PostgreSQL with WebSocket connection
- Custom Auth.js adapter in `__create/adapter.ts`
- Connection pooling via `@neondatabase/serverless`

### Cross-App Communication
Mobile and web share no code directly but communicate via:
- Mobile WebView embeds web auth pages
- Web API consumed by mobile (implied by auth flow)
- Shared data structures (habits, punches) likely synced via API

## Testing & Debugging

### Mobile
- Jest configured (`jest-expo` preset)
- Dev mode enables:
  - AnythingMenu (dev tools overlay via `__create/anything-menu.tsx`)
  - DeviceErrorBoundary with better error reporting
  - LogBox disabled (`LogBox.ignoreAllLogs()` in `index.tsx`)

### Web
- Vitest configured (`vitest.config.ts`)
- Request tracing via `requestId` middleware
- Logs prefixed with `[traceId:xxx]` for debugging

## Important Files

- **Mobile entry**: `apps/mobile/index.tsx` (native) and `apps/mobile/App.tsx` (web wrapper)
- **Mobile config**: `apps/mobile/app.json` (Expo config with newArch enabled)
- **Web entry**: `apps/web/__create/index.ts` (Hono server)
- **Mobile polyfills**: `apps/mobile/src/__create/polyfills.ts` (fetch override)
- **Patch configs**: `apps/mobile/patches/*.patch` (critical fixes)

## Common Pitfalls

1. **Don't use native-only APIs on web without polyfills** - Always check `polyfills/web/` first
2. **patch-package must run after install** - If patches aren't applied, check `postinstall` script
3. **Mobile uses both .jsx and .tsx** - No strict convention, both are acceptable
4. **Expo Router requires specific file structure** - Routes must be in `app/` directory
5. **Web backend is Node-only** - Uses Node.js APIs (AsyncLocalStorage, node:console), can't run in browser
