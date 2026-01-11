# Changelog

All notable changes to the HabitPunch project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- **Mobile App**: Expo development server configured with tunnel support
- **Development Server**: Working with `npx expo start --tunnel`
- **Project Structure**: Industry-standard monorepo layout
- **Dependencies**: All required packages installed and configured
- **Branding**: Fully converted from Anything.com to HabitPunch

### Known Issues
- Some Expo packages are slightly behind latest versions (non-critical)
- Metro cache warnings persist but don't affect functionality

### Next Steps
- [ ] Test mobile app functionality on Android device via Expo Go
- [ ] Verify all app features work without anything.com dependencies
- [ ] Address any runtime errors during testing
- [ ] Prepare for production build configuration