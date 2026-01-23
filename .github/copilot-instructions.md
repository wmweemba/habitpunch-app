# HabitPunch AI Coding Instructions

## ⚠️ CRITICAL: Always Read Changelog First

**Before making any changes**, read [CHANGELOG.md](../CHANGELOG.md) to understand:
- **Recent production issues** and their resolutions (AdMob, RevenueCat, Metro build failures)
- **Current build status** and production configuration changes
- **Known error patterns** and their specific fixes
- **Environment configuration** updates (API keys, build settings)
- **Breaking changes** and migration notes

The changelog contains battle-tested solutions to production problems and the most up-to-date configuration details that may not be reflected elsewhere in the codebase.

## Architecture Overview

This is a **monorepo** with two apps sharing common patterns but different runtimes:
- `apps/mobile/` - React Native (Expo 54) with web support via react-native-web
- `apps/web/` - React Router 7 SPA with Hono backend and Neon PostgreSQL

### Mobile App (`apps/mobile/`)

**File-based routing**: Uses Expo Router 6 with file-based navigation in `src/app/`. The `(tabs)/` directory contains bottom tab navigation screens.

**Entry points and initialization**:
- `index.tsx` - Native entry (registers React Native app with AppRegistry, sets up DeviceErrorBoundary in dev mode)
- `App.tsx` - Web entry (wraps app with ErrorBoundary, SafeAreaProvider, Toaster, AlertModal)
- `src/app/_layout.jsx` - Root layout initializing QueryClient, GestureHandlerRootView, RevenueCat, and AdMob

**Cross-platform polyfills**: Platform-specific implementations live in `polyfills/`:
- `polyfills/web/*.web.{tsx,jsx}` - Web-only implementations (alerts, notifications, maps, etc.)
- `polyfills/native/*.native.jsx` - Native-only implementations  
- `polyfills/shared/*.tsx` - Shared cross-platform code

Metro config (`metro.config.js`) aliases polyfills via `WEB_ALIASES` and `NATIVE_ALIASES` objects. When writing code that uses native modules (Alert, WebView, SecureStore, Notifications, Maps, Location, Contacts, etc.), **always check if a polyfill exists first** - the polyfill may expose a different API or have web-specific limitations.

**Important**: React Native Web doesn't support all native APIs. The polyfill system is critical:
- `alerts.web.tsx` - Replaces native Alert with modal-based dialogs
- `webview.web.tsx` - Embeds iframes for WebView functionality
- `secureStore.web.ts` - Uses localStorage instead of native secure storage
- `maps.web.jsx` - Uses `@teovilla/react-native-web-maps` for Google Maps
- `notifications.web.tsx`, `haptics.web.ts`, `location.web.ts` - Stub implementations

**Patches**: This project heavily patches npm packages. After installing dependencies, `patch-package` runs automatically via postinstall hook. Current patches in `apps/mobile/patches/` include:
- `@expo/cli+54.0.21.patch` - CLI fixes
- `expo-router+6.0.21.patch` - Routing improvements
- `react-native-purchases+9.7.1.patch` - RevenueCat integration fixes
- `react-native-purchases-ui+9.7.1.patch` - RevenueCat UI fixes
- `sonner-native+0.21.2.patch` - Toast notification improvements
- `react-native-web-refresh-control+1.1.2.patch` - Pull-to-refresh on web
- `react-native+0.81.4.patch` (if needed)

**Never modify node_modules directly** - use `npx patch-package <package-name>` from `apps/mobile/` directory to create/update patches.

**Build configuration**:
- `app.json` - Expo config with `newArchEnabled: true` (React Native new architecture)
- `eas.json` - EAS Build profiles (development, preview, production)
- `babel.config.js` - Uses `babel-preset-expo` with `unstable_transformImportMeta: true`
- Metro config includes custom error handling (`handle-resolve-request-error.js`) and error reporting (`report-error-to-remote.js`)
- **Critical Metro blockList fix**: Must include `@expo` in negative lookahead to prevent production build failures

### Web App (`apps/web/`)

**React Router 7**: File-based routing in `src/app/` with SSR enabled. Custom route builder in `routes.ts` scans directories for:
- `page.jsx/tsx` files (route pages)
- `layout.jsx/tsx` files (layout wrappers)
- Parameter routes using `[param]` syntax
- Catch-all routes using `[...param]` syntax

**Backend**: Hono server in `__create/index.ts` handles:
- **Auth.js** with Credentials provider using Argon2 password hashing
- **Custom Neon PostgreSQL adapter** (`__create/adapter.ts`) for session/user storage
- **API routes via route builder** (`__create/route-builder.ts`) - auto-discovers `route.js` files in `src/app/api/`
- **AsyncLocalStorage** for request tracing with requestId middleware
- **Console patching** to prefix all logs with `[traceId:xxx]`
- CORS support via `process.env.CORS_ORIGINS`
- Body size limit (4.5mb to match Vercel)
- WebSocket proxy via ws package (`neonConfig.webSocketConstructor = ws`)

**Vite configuration** (`vite.config.ts`): Custom plugins in `plugins/` for:
- `nextPublicProcessEnv.ts` - Exposes `NEXT_PUBLIC_*` env vars (legacy naming)
- `aliases.ts` - Package aliasing (e.g., `@auth/create/react` → `@hono/auth-js/react`)
- `loadFontsFromTailwindSource.ts` - Loads fonts referenced in Tailwind config
- `restart.ts` - Auto-restarts on page/layout/route file changes
- `restartEnvFileChange.ts` - Auto-restarts on .env changes
- `addRenderIds.ts` - Adds render IDs for debugging
- `layouts.ts` - Layout wrapper plugin
- `console-to-parent.ts` - Console forwarding

**API route pattern**: Create `route.js` files in `src/app/api/**/`. The route builder (`__create/route-builder.ts`):
1. Recursively scans for `route.js` files
2. Transforms file paths to Hono patterns (e.g., `api/users/[id]/route.js` → `/api/users/:id`)
3. Imports and mounts handlers (GET, POST, PUT, DELETE, PATCH)
4. Uses custom fetch override from `src/__create/fetch.ts`

## Development Workflows

### Starting the apps
```bash
# Mobile (from root)
npm run dev:mobile

# Mobile with tunnel (for network issues/testing on physical devices)
cd apps/mobile && npx expo start --tunnel

# Mobile with cache clear (fixes most build issues)
cd apps/mobile && npx expo start --clear

# Web (from root)
npm run dev:web
```

### Production builds
```bash
# CRITICAL: Always run from apps/mobile directory, NOT root
cd apps/mobile

# Development build (for device testing)
eas build --platform android --profile development

# Preview build (APK for testing)
eas build --platform android --profile preview

# Production build (AAB for Play Store)
eas build --platform android --profile production
```

### Adding dependencies
**Critical**: Always run `npm install` from the workspace directory (`apps/mobile/` or `apps/web/`), **not from root**. The root `package.json` manages workspaces but dependencies are app-specific. Each app has its own `node_modules`.

### Creating patches
If you need to modify a package in mobile:
1. Edit files directly in `apps/mobile/node_modules/<package>/`
2. Run `npx patch-package <package-name>` from `apps/mobile/`
3. Patch file is auto-created in `apps/mobile/patches/`
4. Committed patch files apply automatically on `npm install` via postinstall hook

### Debugging metro resolution issues
If Metro can't resolve a module:
- Check `metro.config.js` aliases (WEB_ALIASES, NATIVE_ALIASES)
- Look for `.web.tsx` or `.native.jsx` platform extensions
- Clear cache: `npx expo start --clear`
- Check `handle-resolve-request-error.js` for custom resolution logic

## Project-Specific Conventions

### State Management (Mobile)
- **Zustand** for global state - see pattern in `src/utils/auth/store.js`:
  ```js
  export const useAuthStore = create((set) => ({
    isReady: false,
    auth: null,
    setAuth: (auth) => {
      if (auth) SecureStore.setItemAsync(authKey, JSON.stringify(auth));
      else SecureStore.deleteItemAsync(authKey);
      set({ auth });
    },
  }));
  ```
- **React Query** configured in `_layout.jsx` with 5min stale time, 30min cache, 1 retry, no refetch on window focus
- **Expo SecureStore** for persistent auth data (see web polyfill at `polyfills/web/secureStore.web.ts` using localStorage)

### Styling (Mobile)
- **NativeWind** for Tailwind-like styling - requires `global.css` import and `global.d.ts` types
- Platform-specific styles via file extensions (`.web.tsx` vs `.native.jsx`)
- Custom theme system at `utils/theme` with `useAppTheme()` hook providing `colors` and `isDark`
- Color utilities in `utils/habitTheme` (e.g., `getColorByName()`)

### Components (Mobile)
- **Default exports preferred** - all components in `src/components/` use default export
- **Haptics on interactions**: `import * as Haptics from 'expo-haptics'; Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)`
- **Fonts loaded via @expo-google-fonts**: Pattern in `PunchCard.jsx`:
  ```js
  import { useFonts, Montserrat_500Medium, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
  const [fontsLoaded] = useFonts({ Montserrat_500Medium, Montserrat_600SemiBold });
  ```
- **Animations**: Use `react-native-reanimated` (modern) or `Animated` API (legacy). See `PunchCard.jsx` for patterns with `Animated.spring()`, `Animated.parallel()`, `useRef(new Animated.Value(1))`

### Authentication Flow

**Mobile**: WebView-based auth flow that proxies to web backend
- `useAuthModal()` from `utils/auth/store.js` opens modal with `isOpen`, `mode` ('signup'|'signin'), `open()`, `close()`
- `AuthWebView.jsx` component renders WebView pointing to web auth pages
- `useRequireAuth()` hook auto-protects screens (implementation details in `utils/auth/`)
- Auth state stored in Zustand (`useAuthStore`) with persistence via SecureStore
- Auth token key: `${process.env.EXPO_PUBLIC_PROJECT_GROUP_ID}-jwt`

**Web**: Auth.js with credentials provider
- Hono middleware in `__create/index.ts` initializes Auth.js config
- Custom Neon adapter (`__create/adapter.ts`) manages users, accounts, sessions, verification tokens
- Argon2 password hashing (`import { hash, verify } from 'argon2'`)
- JWT session strategy with `skipCSRFCheck` enabled
- Route protection via `isAuthAction()` helper in `__create/is-auth-action.ts`
- Sign-in page: `/account/signin`, logout: `/account/logout`

### Environment Variables

**Mobile**:
- Prefix with `EXPO_PUBLIC_` to expose to client (e.g., `EXPO_PUBLIC_BASE_URL`)
- Used in both native and web builds
- Mobile uses both `EXPO_PUBLIC_PROXY_BASE_URL` and `EXPO_PUBLIC_BASE_URL` for auth WebView flow
- `EXPO_PUBLIC_PROJECT_GROUP_ID` used for SecureStore key namespacing

**Web**:
- Prefix with `NEXT_PUBLIC_` (legacy naming from Next.js migration, aliased in Vite config)
- Access via `import.meta.env.NEXT_PUBLIC_*` or `process.env.NEXT_PUBLIC_*`
- Server-only vars: `AUTH_SECRET`, `DATABASE_URL`, `CORS_ORIGINS`

## Key Integration Points

### RevenueCat (Mobile Only)
- Initialized in `_layout.jsx` via `initializeRevenueCat(setPermanentPremium)`
- **Automatic environment detection**: Uses `__DEV__` flag for test/production API keys
- **Production API key**: `goog_SWjDQARhamdHehzOCNtDyhZgItS` (fixed typo from `gooog_...`)
- **Critical**: Product must be configured as `'inapp'` (one-time purchase), NOT `'subs'` (subscription)
- Test mode: `setPermanentPremium()` from `utils/habitStorage` forces premium
- Patches applied: `react-native-purchases+9.7.1.patch`, `react-native-purchases-ui+9.7.1.patch`

### Google Mobile Ads (Mobile Only)
- Dynamic require in `_layout.jsx` via `initMobileAds()` to avoid crashes in Expo Go
- **Production AdMob IDs**:
  - App ID: `ca-app-pub-8027298257417325~2646520577`
  - Banner: `ca-app-pub-8027298257417325/7395643745`
  - Rewarded: `ca-app-pub-8027298257417325/5890990380`
- **Critical**: Use `RewardedAdEventType.ERROR` constants, NOT string literals like `'adFailedToLoad'`
- Automatic test/production switching via `isDevelopment: __DEV__`
- Best-effort initialization (non-fatal if module missing)
- Permissions in `app.json`: `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`

### Database (Web Only)
- Neon serverless PostgreSQL with WebSocket connection (`neonConfig.webSocketConstructor = ws`)
- Custom Auth.js adapter in `__create/adapter.ts` with schema:
  - `auth_users` (id, email, email_verified, name, image)
  - `auth_accounts` (user_id, provider, provider_account_id, password for credentials, OAuth tokens)
  - `auth_sessions` (session_token, user_id, expires)
  - `auth_verification_token` (identifier, expires, token)
- Connection pooling via `new Pool({ connectionString: process.env.DATABASE_URL })`
- Uses prepared statements for all queries

### Cross-App Communication
Mobile and web share no code directly but communicate via:
- Mobile WebView embeds web auth pages (`EXPO_PUBLIC_PROXY_BASE_URL`)
- Web API consumed by mobile for habits, punches, user data
- Shared data models (habits with name, color, punches array, etc.)

## Testing & Debugging

### Mobile
- Jest configured with `jest-expo` preset (see `package.json`)
- **Dev mode features** (`if (__DEV__)` in `index.tsx`):
  - AnythingMenu (dev tools overlay) via `__create/anything-menu.tsx`
  - DeviceErrorBoundary with enhanced error reporting
  - LogBox disabled: `LogBox.ignoreAllLogs()` and `LogBox.uninstall()`
- **Web-specific debugging** (`App.tsx`):
  - ErrorBoundaryWrapper for web builds
  - GlobalErrorReporter catches unhandled errors and promise rejections
  - Toaster from `sonner-native` for notifications
  - AlertModal for web-based alerts

### Web
- Vitest configured (`vitest.config.ts`) with jsdom environment
- **Request tracing**: 
  - `requestId()` middleware generates unique ID per request
  - AsyncLocalStorage stores requestId for the request lifecycle
  - Console methods patched to prefix logs: `[traceId:xxx] message`
- Custom error page rendering via `get-html-for-error-page.ts`
- All errors serialized with `serialize-error` package for structured logging

### Common debugging commands
```bash
# Clear all caches
cd apps/mobile && npx expo start --clear

# Check Metro resolution
cd apps/mobile && npx expo customize metro.config.js

# View build config
cd apps/mobile && npx expo config

# Check EAS build config
cd apps/mobile && cat eas.json
```

## Important Files

**Mobile entry and config**:
- `apps/mobile/index.tsx` - Native entry point (AppRegistry)
- `apps/mobile/App.tsx` - Web entry point with providers
- `apps/mobile/src/app/_layout.jsx` - Root layout (QueryClient, RevenueCat, AdMob init)
- `apps/mobile/app.json` - Expo config (newArch enabled, splash, icons, permissions)
- `apps/mobile/metro.config.js` - Metro bundler config (aliases, polyfills, error handling)
- `apps/mobile/babel.config.js` - Babel preset config

**Web entry and config**:
- `apps/web/__create/index.ts` - Hono server entry (auth, API routes, middleware)
- `apps/web/__create/adapter.ts` - Neon PostgreSQL Auth.js adapter
- `apps/web/__create/route-builder.ts` - Auto-discovery of API routes
- `apps/web/vite.config.ts` - Vite bundler with custom plugins
- `apps/web/src/app/routes.ts` - File-based route configuration
- `apps/web/react-router.config.ts` - React Router 7 config

**Critical utilities**:
- `apps/mobile/src/__create/polyfills.ts` - Fetch override and global polyfills
- `apps/mobile/__create/handle-resolve-request-error.js` - Metro resolution error handling
- `apps/web/src/__create/fetch.ts` - Custom fetch implementation for API routes

**Patches** (all in `apps/mobile/patches/`):
- Critical runtime patches that auto-apply on install
- Don't delete these - they fix production bugs

## Common Pitfalls

1. **Don't use native-only APIs on web without polyfills** - Always check `polyfills/web/` first. Many APIs are stubbed or have different behavior.

2. **patch-package must run after install** - If patches aren't applied, check the `postinstall` script in `apps/mobile/package.json`. Never delete patch files.

3. **Mobile uses both .jsx and .tsx** - No strict convention. Use .tsx for new files with TypeScript, .jsx is acceptable for existing patterns.

4. **Expo Router requires specific file structure** - Routes must be in `app/` directory. Use `(tabs)/` for tab navigation, `+not-found.tsx` for 404s, `_layout.jsx` for layouts.

5. **Web backend is Node-only** - Uses Node.js APIs (AsyncLocalStorage, node:console, node:fs, node:path). Can't run in browser. Uses React Router Hono server runtime.

6. **Install dependencies in workspace directories, not root** - Always `cd apps/mobile` or `cd apps/web` before `npm install`.

7. **Metro caching issues** - When weird errors occur, try `npx expo start --clear` first. This solves 90% of build issues.

8. **Polyfill APIs may differ from native** - Example: `alerts.web.tsx` doesn't support all Alert.alert() options. Check polyfill source before using native APIs.

9. **Environment variables must use correct prefixes** - `EXPO_PUBLIC_*` for mobile client, `NEXT_PUBLIC_*` for web client. Server-only vars don't need prefixes.

10. **RevenueCat and AdMob use dynamic requires** - Don't import directly; they're loaded dynamically in `_layout.jsx` to avoid Expo Go crashes.

### Production Debugging

**AdMob Common Errors**:
- "RewardedAd.addAdEventListener(*) 'type' expected a valid event type" → Use `RewardedAdEventType.ERROR` instead of string literals
- "Unable to load rewarded ad" → Check domain verification and ad unit IDs

**RevenueCat Common Errors**:
- "PRODUCT_NOT_FOUND for habitpunch_premium_lifetime" → Product must be `'inapp'` type, not `'subs'`
- "This version of the application is not configured for billing" → Expected for non-published apps

**Metro Build Failures**:
- "Failed to get SHA-1 for @expo/cli/build/metro-require/require.js" → Add `@expo` to Metro blockList negative lookahead
- EAGER_BUNDLE phase failing → Check Metro resolver configuration

**Device debugging**:
```bash
# Install Android platform tools
brew install android-platform-tools

# Connect device and view logs
adb logcat | grep -E "(AdMob|RevenueCat|HabitPunch)"
```
