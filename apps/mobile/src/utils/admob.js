// AdMob Integration for HabitPunch
// NOW USING PRODUCTION ADs - automatically switches to test in development

/**
 * ADMOB CONFIGURATION
 *
 * PRODUCTION MODE: Using live ad units
 * Development builds (__DEV__) automatically use test IDs for safety
 */

export const ADMOB_CONFIG = {
  // Automatically use test mode in development, production mode in release builds
  isDevelopment: __DEV__,

  // Test Ad Unit IDs (Google-provided, used automatically in development)
  testBannerAdUnitId: "ca-app-pub-3940256099942544/6300978111",
  testRewardedAdUnitId: "ca-app-pub-3940256099942544/5224354917",

  // PRODUCTION Ad Unit IDs (LIVE - from AdMob account)
  // These are now active and will be used in release builds
  prodAppId: "ca-app-pub-80272982574173~9673101538",
  prodBannerAdUnitId: "ca-app-pub-80272982574173/9825322382", // LIVE Banner Ad
  prodRewardedAdUnitId: "ca-app-pub-80272982574173/6855366500", // LIVE Rewarded Ad
};

/**
 * Get the correct Ad Unit ID based on mode
 * Automatically uses test IDs in development, production IDs in release builds
 */
export const getBannerAdUnitId = () => {
  if (ADMOB_CONFIG.isDevelopment) {
    console.log("🧪 Using TEST Banner Ad (Development Mode)");
    return ADMOB_CONFIG.testBannerAdUnitId;
  }
  console.log("📱 Using PRODUCTION Banner Ad (Release Build)");
  return ADMOB_CONFIG.prodBannerAdUnitId;
};

export const getRewardedAdUnitId = () => {
  if (ADMOB_CONFIG.isDevelopment) {
    console.log("🧪 Using TEST Rewarded Ad (Development Mode)");
    return ADMOB_CONFIG.testRewardedAdUnitId;
  }
  console.log("📱 Using PRODUCTION Rewarded Ad (Release Build)");
  return ADMOB_CONFIG.prodRewardedAdUnitId;
};

/**
 * PRODUCTION MODE ACTIVE
 *
 * ✅ App is configured for production ad units
 * ✅ Development builds automatically use test ads for safety
 * ✅ Release builds will use live production ads
 *
 * Checklist:
 * 1. ✅ Production ad units configured
 * 2. ⚠️  Ensure AdMob account is fully set up:
 *    - App registered in AdMob console
 *    - Ad units created and active
 *    - Payment information configured
 *
 * 3. ⚠️  Update app.json with AdMob App ID before building:
 *    "plugins": [
 *      [
 *        "react-native-google-mobile-ads",
 *        {
 *          "androidAppId": "ca-app-pub-80272982574173~9673101538",
 *          "iosAppId": "ca-app-pub-80272982574173~9673101538"
 *        }
 *      ]
 *    ]
 *
 * 4. Test with real device (not simulator) to verify ads load
 * 5. Review AdMob policies: https://support.google.com/admob/answer/6128543
 *
 * Note: Development builds use Google test ads automatically
 */
