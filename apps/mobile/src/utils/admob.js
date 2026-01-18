// AdMob Integration for HabitPunch
// NOW USING PRODUCTION ADs - automatically switches to test in development

import { Platform } from 'react-native';
import { InterstitialAd, AdEventType, TestIds, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

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
  // Updated with correct IDs from verified AdMob account
  prodAppId: "ca-app-pub-8027298257417325~2646520577",
  prodBannerAdUnitId: "ca-app-pub-8027298257417325/7395643745", // LIVE Banner Ad
  prodRewardedAdUnitId: "ca-app-pub-8027298257417325/5890990380", // LIVE Rewarded Ad
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

// Rewarded Ad Functionality
let rewardedAd = null;

export const initializeRewardedAd = () => {
  const adUnitId = getRewardedAdUnitId();
  
  if (rewardedAd) {
    rewardedAd = null; // Clean up existing ad
  }
  
  rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: false,
    keywords: ['habits', 'productivity', 'self-improvement']
  });

  return rewardedAd;
};

export const showRewardedAd = ({ onReward, onError }) => {
  return new Promise((resolve, reject) => {
    if (!rewardedAd) {
      rewardedAd = initializeRewardedAd();
    }

    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('✅ Rewarded ad loaded successfully');
      rewardedAd.show();
    });

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('🎉 User earned reward:', reward);
        onReward && onReward(reward);
        resolve(reward);
      }
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(RewardedAdEventType.DISMISSED, () => {
      console.log('❌ Rewarded ad dismissed');
      // Clean up listeners
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
      
      // Initialize new ad for next time
      rewardedAd = initializeRewardedAd();
    });

    const unsubscribeError = rewardedAd.addAdEventListener('ad_error', (error) => {
      console.error('❌ Rewarded ad error:', error);
      onError && onError(error);
      reject(error);
      
      // Clean up listeners
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    });

    // Load and show the ad
    rewardedAd.load();
  });
};
