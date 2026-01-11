# HabitPunch

A modern habit tracking application built with React Native (Expo) and web technologies.

## Project Structure

```
habitpunch_app/
├── apps/
│   ├── mobile/          # React Native mobile app (Expo)
│   └── web/             # Web application
├── .gitignore
├── package.json         # Workspace root
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Expo Go app on your mobile device

### Installation

1. Clone the repository
2. Install dependencies for all apps:
   ```bash
   npm run install:all
   ```

### Development

#### Mobile App (React Native + Expo)

```bash
# Navigate to mobile app and start development server
cd apps/mobile
npm start

# Or from root directory
npm run dev:mobile
```

#### Web App

```bash
# Navigate to web app and start development server
cd apps/web
npm run dev

# Or from root directory
npm run dev:web
```

### Mobile Development

1. Start the development server:
   ```bash
   cd apps/mobile
   npx expo start
   ```

2. Connect with Expo Go:
   - Install Expo Go on your mobile device
   - Scan the QR code displayed in the terminal
   - Or press `s` to send via SMS, `e` for email

### Features

- Habit tracking and punch cards
- User authentication
- Premium features with in-app purchases (RevenueCat)
- Cross-platform (iOS, Android, Web)
- Real-time data synchronization

### Tech Stack

#### Mobile
- React Native (0.81.4)
- Expo (54.0.1)
- TypeScript
- Zustand (State management)
- React Query (Data fetching)
- RevenueCat (In-app purchases)
- React Navigation

#### Web
- Modern web stack (check apps/web for details)

### Troubleshooting

#### Clear Cache
```bash
# Mobile app
npm run clean:mobile

# Or manually
cd apps/mobile
npx expo start --clear
```

#### Common Issues
- Ensure you're in the correct directory (apps/mobile for mobile commands)
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### License

MIT