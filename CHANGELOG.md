# Changelog

All notable changes to the HabitPunch project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2026-01-17

### Fixed - Production App Store Issues
- **App Store Functionality Fixes**:
  - Fixed rating functionality: Now opens Google Play Store instead of "feature coming soon" message
  - Added Play Store download links to app sharing functionality in both PunchCard and Settings
  - Improved RevenueCat error handling: Now returns structured error results instead of throwing exceptions
  - Implemented AdMob fallback system: Shows placeholders when native ads unavailable (Expo managed builds)

- **Build System Critical Fixes**:
  - Fixed EAS build failures caused by running from wrong directory (root vs apps/mobile)
  - Removed conflicting configuration files from monorepo root (app.json, eas.json)
  - Fixed failing sonner-native patch for version 0.21.2 (web compatibility for toast notifications)
  - Updated all patch files to match installed package versions, eliminating warnings

- **Package Dependencies Cleanup**:
  - Updated @expo/cli patch: 54.0.1 → 54.0.21
  - Updated @expo/metro-runtime patch: 6.1.1 → 6.1.2  
  - Updated expo-router patch: 6.0.0 → 6.0.21
  - Updated metro-runtime patch: 0.83.1 → 0.83.3
  - Updated react-native-purchases patch: 9.6.1 → 9.7.1
  - Updated react-native-purchases-ui patch: 9.6.1 → 9.7.1
  - Regenerated sonner-native patch: 0.21.0 → 0.21.2

### Changed
- **Development Builds**:
  - Successfully created development APK: Build `684d7ecb-a899-43d1-91b6-c800f0e77723`
  - All EAS build commands now run from correct apps/mobile directory
  - Clean patch application with zero version warnings

### Developer Experience
- Development builds now install successfully on Android devices for testing
- Clean build environment with properly versioned patches
- Eliminated all dependency version mismatch warnings

## [1.0.4] - 2026-01-12

### Production Release
- **First Production Build Completed**:
  - Successfully built Android AAB for Google Play Store submission
  - Build ID: `68e86b07-665e-47c7-b1fe-783917754de5`
  - Version: 1.0.0 (Version Code: 2)
  - AAB artifact: https://expo.dev/artifacts/eas/dXmR4ZeHtxPYm2sqMkqfnt.aab
  - Android Keystore generated and stored securely by EAS
  - Build completed in ~20 minutes on EAS infrastructure

- **App Store Assets**:
  - Captured production-ready screenshots using dev tools
  - Screenshots include onboarding flow and key app features
  - Assets ready for Google Play Console submission

### Production Status
- ✅ Production build completed and tested
- ✅ App ready for Google Play Store submission
- ✅ All monetization configured (RevenueCat, AdMob)
- ✅ Screenshots and assets prepared
- 🚀 Ready for public release

## [1.0.3] - 2026-01-12

### Added - EAS Build Configuration & Developer Tools
- **EAS Build Setup**:
  - Installed and configured EAS CLI for production builds
  - Created EAS project: `@wmweemba/habitpunch`
  - Generated `eas.json` with development, preview, and production build profiles
  - Project ID: `30093ce3-f4d8-4e4f-867c-c39bfae5dd84`
  - Configured for both iOS and Android platforms
  - Production profile includes auto-increment for build numbers

- **Developer Tools**:
  - Added `clearAllData()` function to `habitStorage.js` for resetting app to first launch state
  - Added 🗑️ clear data button to dev menu (AnythingMenu) for taking onboarding screenshots
  - Clear data resets: habits, onboarding status, premium status, and all app settings
  - Automatic app reload after data clear

### Changed
- **RevenueCat Configuration**:
  - Updated live API key from `goog_SWjDQARhamdHehzOCNtDyhZgItS` to `gooog_SWJDQARhamdHehzOCNtDyhZgItS` (corrected key)
  - Maintained automatic test/production environment switching

### Fixed
- **App Configuration Issues**:
  - Removed invalid `privacy` field from `app.json` (not supported in Expo SDK 54)
  - Removed hardcoded `owner` field to allow proper EAS authentication
  - Removed invalid `projectId` placeholder, replaced with EAS-generated UUID
  - Removed invalid `updates.url` that referenced non-existent project

### Developer Experience
- App can now be reset to fresh install state via dev menu for screenshot capture
- EAS build system ready for creating production APK/AAB for Google Play Store
- Development builds can be created to test custom app icon display

## [1.0.2] - 2026-01-12

### Added - Production Monetization Configuration
- **RevenueCat Production Setup**:
  - Added live RevenueCat API key configuration (`goog_SWjDQARhamdHehzOCNtDyhZgItS`)
  - Implemented automatic environment detection using `__DEV__` flag
  - Created `getApiKey()` helper for automatic test/production key selection
  - Development builds automatically use test key, production builds use live key
  
- **AdMob Production Setup**:
  - Configured live production ad unit IDs for banner and rewarded ads
  - Banner Ad: `ca-app-pub-80272982574173/9825322382`
  - Rewarded Ad: `ca-app-pub-80272982574173/6855366500`
  - App ID: `ca-app-pub-80272982574173~9673101538`
  - Implemented automatic environment detection for safe development

- **App Configuration Enhancements** (app.json):
  - Added `slug`: "habitpunch"
  - Added app description for store listings
  - Added `primaryColor`: "#FF6B35" (brand orange)
  - Added `backgroundColor`: "#FF6B35"
  - Added `assetBundlePatterns` for proper asset bundling
  - Added iOS `bundleIdentifier`: "com.habitpunch.app"
  - Added iOS `buildNumber`: "1.0.0"
  - Added Android `versionCode`: 1
  - Added `expo-notifications` plugin for push notifications
  - Added EAS project configuration
  - Added update configuration with `fallbackToCacheTimeout`: 0
  - Added app scheme: "habitpunch" for deep linking
  - Added splash screen configuration

### Changed
- **Monetization Mode**: Switched from test-only to production-ready configuration
  - RevenueCat: Now uses live API key in production builds
  - AdMob: Now uses live ad units in production builds
  - Both systems automatically use test mode in development (`__DEV__ = true`)
  
- **Configuration Updates**:
  - Updated `admob.js`: Replaced `testMode` flag with `isDevelopment: __DEV__`
  - Updated `revenueCat.js`: Separated test and live keys with automatic selection
  - Enhanced logging to indicate current mode (TEST/PRODUCTION)

### Production Readiness
- ✅ Live RevenueCat API key configured and active
- ✅ Live AdMob ad units configured and active
- ✅ Automatic test/production mode switching implemented
- ✅ App metadata complete for store submission
- ✅ Version 1.0.0 / versionCode 1 / buildNumber 1.0.0
- ✅ All required permissions configured
- ✅ EAS build configuration ready
- ✅ No debug flags in production builds

### Notes
- Development builds remain safe with automatic test mode
- Production builds will use live monetization automatically
- Ready for EAS build and TestFlight/Play Store testing

---

## [1.0.1] - 2026-01-11

### Added
- Added `semver` package dependency for react-native-reanimated compatibility
- Created `.github/copilot-instructions.md` with comprehensive AI coding guidelines
- Added Metro bundler cache directories (`caches/.metro-cache`)

### Changed
- Removed npm workspaces configuration to resolve Metro bundler node_modules resolution issues
- Updated web app dependencies to resolve peer dependency conflicts:
  - `@types/react` from `^18.3.1` to `^19.0.0`
  - `@types/react-dom` from `^18.3.1` to `^19.0.0`
  - `vite` from `^6.3.3` to `^7.0.0`
  - `react-router-hono-server` from `^2.13.0` to `^2.22.0`
- Updated mobile app TypeScript configuration:
  - Added explicit `"jsx": "react-native"` compiler option
  - Changed expo/tsconfig.base extends path to use node_modules reference

### Fixed
- **Critical**: Fixed TypeScript JSX configuration errors preventing compilation
- **Critical**: Fixed Metro bundler module resolution by removing workspace hoisting
- **Critical**: Fixed ExceptionsManager import error (not accessible in Expo Go)
- **Critical**: Fixed AnythingMenuWrapper reference in development mode
- Fixed invalid `fileMapCacheDirectory` Metro configuration option
- Fixed semver module resolution error for react-native-reanimated
- Fixed web app TypeScript types configuration to use `@types/node`

### Removed
- Removed ExceptionsManager import from mobile app entry point
- Removed invalid Metro config option `fileMapCacheDirectory`
- Removed workspace configuration from root package.json

### Testing
- ✅ Verified mobile app loads successfully in Expo Go
- ✅ Tested habit tracking features (add, punch, edit, delete, reset)
- ✅ Tested 24-hour premium grant feature (simulated ad watch)
- ✅ Verified premium features lock/unlock correctly
- ✅ Confirmed banner ads hide when premium active
- ✅ Tested payment flow (expected test mode behavior)

### Development Notes
- Dependencies now installed per-app (not hoisted to root)
- Metro cache cleared and rebuilt successfully
- All critical TypeScript and build errors resolved
- App running smoothly in development mode with Expo Go

---

## [1.0.0] - 2026-01-10

### Added
- Workspace-level `package.json` with monorepo configuration
- Convenient npm scripts for development workflow (`dev:mobile`, `dev:web`, `install:all`, etc.)
- Comprehensive `README.md` with setup instructions and project documentation
- Mobile app npm scripts (`start`, `start:tunnel`, `start:lan`) in mobile package.json
- Missing peer dependencies (`expo-asset`, `expo-file-system`) for expo-three compatibility
- Metro cache directory structure for proper bundler operation

### Changed
- **BREAKING**: Restructured entire project to industry-standard monorepo layout
  - Moved from `_/apps/` to `apps/` directory structure
  - Relocated `.gitignore` to project root
  - Consolidated duplicate folder structures
- App name from "Anything mobile app" to "HabitPunch" in app.json
- Package name from `xyz.create.CreateExpoEnvironment` to `com.habitpunch.app` 
- Mobile package name from "mobile" to "habitpunch-mobile"
- Environment configuration from PRODUCTION to DEVELOPMENT mode
- Metro bundler configuration:
  - Set proper `projectRoot` and `watchFolders` for new structure
  - Added blockList to prevent parent directory watching
  - Fixed path resolution for monorepo structure

### Fixed
- Metro bundler path resolution issues causing connection failures
- Expo development server host configuration for local network access
- Cache write errors by properly configuring cache directories
- Entry point configuration to work with new project structure
- Package dependency mismatches and peer dependency warnings

### Removed
- Anything.com platform dependencies and configurations
- `AnythingMenu` wrapper component from app entry point
- Anything.com specific environment variables and URLs
- Confusing underscore (`_`) directory structure
- Hardcoded anything.com API endpoints and project IDs
- Legacy `.DS_Store` files and system artifacts

### Security
- Cleared production API keys and endpoints for local development
- Removed external platform dependencies for standalone operation

---

## Development Environment Setup

### Prerequisites Met
- ✅ Node.js v24.11.0 (LTS)
- ✅ npm v11.6.1
- ✅ Expo CLI v54.0.1
- ✅ React Native 0.81.4
- ✅ Expo SDK 54

### Current Status
- **Mobile App**: Fully functional in Expo Go with all features tested
- **Development Server**: Running stable with `npx expo start`
- **Project Structure**: Optimized for Expo/React Native (per-app node_modules)
- **Dependencies**: All packages installed and properly configured
- **TypeScript**: Fully configured with JSX support
- **Testing**: Core features verified and working

### Known Issues
- Some Expo packages slightly behind latest versions (non-critical, warnings only)
- Duplicate dependencies in node_modules (non-blocking for EAS builds)
- Custom app icon won't display in Expo Go (architectural limitation, shows in production builds)

### Completed Production Setup ✅
- ✅ EAS Build configured with production profile
- ✅ Production RevenueCat API key configured (`gooog_SWJDQARhamdHehzOCNtDyhZgItS`)
- ✅ Production AdMob ad units configured
- ✅ Android Keystore generated and stored by EAS
- ✅ First production build completed (AAB ready)
- ✅ Screenshots captured for store listing

### Next Steps - App Store Submission
- [ ] **Google Play Console Setup**:
  - [ ] Create app listing on Google Play Console
  - [ ] Upload production AAB (https://expo.dev/artifacts/eas/dXmR4ZeHtxPYm2sqMkqfnt.aab)
  - [ ] Complete store listing (screenshots, description, privacy policy)
  - [ ] Configure RevenueCat product in Play Console (`habitpunch_premium_lifetime`)
  - [ ] Submit for review and publish

- [x] **RevenueCat Dashboard Configuration**:
  - [x] Create product offering for `habitpunch_premium_lifetime`
  - [x] Link Google Play Store product to RevenueCat
  - [x] Test in-app purchases in production environment

- [ ] **iOS Build & Submission** (Optional):
  - [ ] Run `eas build --platform ios --profile production`
  - [ ] Set up App Store Connect listing
  - [ ] Configure IAP products in App Store Connect
  - [ ] Submit for App Store review