# Changelog

All notable changes to the HabitPunch project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Ad system using test/simulation mode (requires production AdMob setup)
- RevenueCat payments using test mode (requires App Store Connect setup)

### Next Steps
- [ ] Prepare for production build configuration
- [ ] Set up App Store Connect and configure IAP products
- [ ] Configure production RevenueCat API keys
- [ ] Integrate production AdMob rewarded video ads
- [ ] Test with TestFlight before release