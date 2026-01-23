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
let debugMode = __DEV__; // Enable detailed logging in development

// Enhanced error logging for debugging
const logAdMobError = (error, context) => {
  console.error(`❌ AdMob Error [${context}]:`, {
    message: error.message,
    code: error.code,
    domain: error.domain,
    userInfo: error.userInfo,
    nativeStackAndroid: error.nativeStackAndroid,
    nativeStackIOS: error.nativeStackIOS,
    timestamp: new Date().toISOString(),
    isDevelopment: __DEV__,
    adUnitId: getRewardedAdUnitId()
  });
};

// Debug logging utility
const debugLog = (message, data = null) => {
  if (debugMode) {
    console.log(`🔍 [AdMob Debug] ${message}`, data ? data : '');
  }
};

export const initializeRewardedAd = () => {
  const adUnitId = getRewardedAdUnitId();
  debugLog('Initializing rewarded ad', { adUnitId, isDev: __DEV__ });
  
  if (rewardedAd) {
    debugLog('Cleaning up existing rewarded ad');
    rewardedAd = null; // Clean up existing ad
  }
  
  rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: false,
    keywords: ['habits', 'productivity', 'self-improvement']
  });

  debugLog('Rewarded ad created successfully');
  return rewardedAd;
};

export const showRewardedAd = ({ onReward, onError }) => {
  return new Promise((resolve, reject) => {
    debugLog('showRewardedAd called');
    
    if (!rewardedAd) {
      debugLog('No existing ad, initializing new one');
      rewardedAd = initializeRewardedAd();
    }

    let isResolved = false;
    let timeout = null;
    const listeners = [];

    // Helper to clean up all listeners and timeout
    const cleanup = () => {
      debugLog('Cleaning up ad listeners and timeout');
      listeners.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (err) {
          console.warn('Error unsubscribing listener:', err);
        }
      });
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };

    // Helper to resolve/reject only once
    const resolveOnce = (result) => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve(result);
      }
    };

    const rejectOnce = (error) => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        reject(error);
      }
    };

    // Set up event listeners
    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      debugLog('✅ Rewarded ad loaded successfully');
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      debugLog('Showing rewarded ad');
      rewardedAd.show();
    });
    listeners.push(unsubscribeLoaded);

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        debugLog('🎉 User earned reward:', reward);
        onReward && onReward(reward);
        resolveOnce(reward);
        // Initialize new ad for next time
        setTimeout(() => {
          rewardedAd = initializeRewardedAd();
        }, 100);
      }
    );
    listeners.push(unsubscribeEarned);

    const unsubscribeClosed = rewardedAd.addAdEventListener(RewardedAdEventType.DISMISSED, () => {
      debugLog('❌ Rewarded ad dismissed without reward');
      if (!isResolved) {
        // User closed ad without watching - not an error, just no reward
        cleanup();
        // Initialize new ad for next time
        setTimeout(() => {
          rewardedAd = initializeRewardedAd();
        }, 100);
      }
    });
    listeners.push(unsubscribeClosed);

    const unsubscribeError = rewardedAd.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
      logAdMobError(error, 'REWARDED_AD_LOAD');
      
      const errorDetails = {
        message: error.message || 'Unknown AdMob error',
        code: error.code || 'UNKNOWN_CODE',
        domain: error.domain,
        userInfo: error.userInfo,
        isDevelopment: __DEV__,
        adUnitId: getRewardedAdUnitId(),
        timestamp: new Date().toISOString()
      };
      
      debugLog('Detailed error information:', errorDetails);
      
      const userFriendlyMsg = `Unable to load rewarded ad. ${errorDetails.message}`;
      onError && onError(errorDetails);
      rejectOnce(errorDetails);
      
      // Initialize new ad for next attempt
      setTimeout(() => {
        rewardedAd = initializeRewardedAd();
      }, 1000);
    });
    listeners.push(unsubscribeError);

    // Set up timeout (15 seconds for better debugging)
    timeout = setTimeout(() => {
      debugLog('❌ Rewarded ad loading timeout after 15 seconds');
      const timeoutError = {
        message: 'Ad loading timeout - please try again',
        code: 'LOAD_TIMEOUT',
        timestamp: new Date().toISOString(),
        adUnitId: getRewardedAdUnitId(),
        isDevelopment: __DEV__
      };
      
      onError && onError(timeoutError);
      rejectOnce(timeoutError);
      
      // Initialize new ad for next attempt
      setTimeout(() => {
        rewardedAd = initializeRewardedAd();
      }, 1000);
    }, 15000); // 15 second timeout for better debugging

    // Load the ad
    debugLog('🔄 Loading rewarded ad...', { adUnitId: getRewardedAdUnitId() });
    try {
      rewardedAd.load();
    } catch (loadError) {
      debugLog('❌ Error calling rewardedAd.load():', loadError);
      logAdMobError(loadError, 'LOAD_METHOD_CALL');
      
      const loadErrorDetails = {
        message: `Failed to call load(): ${loadError.message}`,
        code: 'LOAD_METHOD_ERROR',
        originalError: loadError,
        timestamp: new Date().toISOString()
      };
      
      onError && onError(loadErrorDetails);
      rejectOnce(loadErrorDetails);
    }
  });
};
