## 🎯 HabitPunch

A modern, cross-platform habit tracking application built with **React Native (Expo)** and **TypeScript**. Track your daily habits, build streaks, and achieve your goals with beautiful punch card visualizations.

![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0.1-black?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

- **📱 Cross-Platform**: iOS, Android, and Web support
- **🎨 Modern UI**: Beautiful, intuitive interface with smooth animations
- **📊 Visual Progress**: Punch card system for tracking habit streaks
- **🔔 Smart Reminders**: Customizable notifications for your habits
- **💎 Premium Features**: In-app purchases with RevenueCat integration
- **🎵 Audio Feedback**: Satisfying sounds for habit completion
- **🌙 Dark Mode**: Automatic theme switching
- **📈 Analytics**: Track your progress over time

---

## 🛠️ Tech Stack

### Mobile
- **React Native** 0.81.4 with Expo 54
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **Zustand** for state management
- **React Query** for data fetching
- **React Native Reanimated** for animations
- **RevenueCat** for in-app purchases

### Premium Integrations
- **RevenueCat** - In-app purchase management
- **Expo Notifications** - Push notifications
- **React Native Maps** - Location-based habits
- **Expo Audio** - Sound feedback

---

## 📁 Project Structure

```
habitpunch-app/
├── apps/
│   ├── mobile/                 # React Native mobile app
│   │   ├── src/
│   │   │   ├── app/           # Expo Router pages
│   │   │   ├── components/    # Reusable UI components
│   │   │   └── utils/         # Utilities and hooks
│   │   ├── assets/           # Images and static files
│   │   ├── app.json          # Expo configuration
│   │   └── package.json      # Mobile dependencies
│   └── web/                   # Web application
├── .gitignore
├── CHANGELOG.md              # Project changelog
├── README.md                 # This file
└── package.json             # Workspace configuration
```

---

## 🎯 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher)
- **Expo Go** app on your mobile device
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wmweemba/habitpunch-app.git
   cd habitpunch-app
   ```

2. **Install dependencies**
   ```bash
   # Install all workspace dependencies
   npm run install:all
   
   # Or install mobile app dependencies only
   cd apps/mobile
   npm install
   ```

### 📱 Mobile Development

1. **Start the development server**
   ```bash
   cd apps/mobile
   npm start
   # or
   npx expo start
   ```

2. **Connect with Expo Go**
   - Install **Expo Go** on your mobile device
   - Scan the QR code displayed in the terminal
   - Your app will load on your device!

3. **Alternative connection methods**
   ```bash
   # For network issues, use tunnel
   npx expo start --tunnel
   
   # For LAN connection
   npx expo start --lan
   
   # Clear cache if needed
   npx expo start --clear
   ```

### 🌐 Web Development

```bash
cd apps/web
npm run dev
```

---

## 📝 Development Scripts

```bash
# Mobile Development
npm run dev:mobile          # Start mobile dev server
npm run clean:mobile        # Clear mobile cache

# Web Development  
npm run dev:web             # Start web dev server

# Workspace Management
npm run install:all         # Install all app dependencies
npm run install:mobile      # Install mobile dependencies only
npm run install:web         # Install web dependencies only
```

---

## 🏗️ Build & Deploy

### Mobile App

```bash
cd apps/mobile

# Development build
npx expo build:ios
npx expo build:android

# Production build with EAS
npx eas build --platform all
```

### Web App

```bash
cd apps/web
npm run build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for the robust ecosystem
- **RevenueCat** for seamless in-app purchase management

---

## 📞 Support

- 🐛 **Bug Reports**: [Issues](https://github.com/wmweemba/habitpunch-app/issues)
- 💡 **Feature Requests**: [Discussions](https://github.com/wmweemba/habitpunch-app/discussions)
- 📧 **Contact**: wmweemba@gmail.com

---

<div align="center">

**Made with ❤️ by [William Mweemba](https://github.com/wmweemba)**

⭐ Star this repo if you found it helpful!

</div>