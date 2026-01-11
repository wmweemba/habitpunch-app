// AdMob Integration for HabitPunch
// Using TEST ADs for safe preview/development

/**
 * ADMOB CONFIGURATION
 *
 * CURRENT: Using TEST AD IDs for safe development
 * PRODUCTION: Switch to live IDs before publishing
 */

export const ADMOB_CONFIG = {
  // TEST MODE - Safe for development (always use these for testing)
  testMode: true, // SET TO FALSE FOR PRODUCTION

  // Test Ad Unit IDs (provided by Google, safe for development)
  testBannerAdUnitId: "ca-app-pub-3940256099942544/6300978111",
  testRewardedAdUnitId: "ca-app-pub-3940256099942544/5224354917",

  // PRODUCTION Ad Unit IDs (from your AdMob account)
  // Switch to these when ready for production:
  prodAppId: "ca-app-pub-80272982574173~9673101538",
  prodBannerAdUnitId: "ca-app-pub-80272982574173/9825322382",
  prodRewardedAdUnitId: "ca-app-pub-80272982574173/6855366500",
};

/**
 * Get the correct Ad Unit ID based on mode
 */
export const getBannerAdUnitId = () => {
  if (ADMOB_CONFIG.testMode) {
    console.log("🧪 Using TEST Banner Ad");
    return ADMOB_CONFIG.testBannerAdUnitId;
  }
  console.log("📱 Using PRODUCTION Banner Ad");
  return ADMOB_CONFIG.prodBannerAdUnitId;
};

export const getRewardedAdUnitId = () => {
  if (ADMOB_CONFIG.testMode) {
    console.log("🧪 Using TEST Rewarded Ad");
    return ADMOB_CONFIG.testRewardedAdUnitId;
  }
  console.log("📱 Using PRODUCTION Rewarded Ad");
  return ADMOB_CONFIG.prodRewardedAdUnitId;
};

/**
 * TO SWITCH TO PRODUCTION:
 *
 * 1. Set testMode to false:
 *    testMode: false
 *
 * 2. Ensure AdMob account is fully set up:
 *    - App registered in AdMob console
 *    - Ad units created and active
 *    - Payment information configured
 *
 * 3. Update app.json with AdMob App ID:
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
 *
 * 5. Review AdMob policies: https://support.google.com/admob/answer/6128543
 */

// Note: react-native-google-mobile-ads package needs to be installed
// The Anything platform will handle this automatically when you use AdMob components
