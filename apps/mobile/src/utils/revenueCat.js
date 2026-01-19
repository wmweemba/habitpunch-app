// RevenueCat Integration for HabitPunch
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";

// RevenueCat Configuration
// NOW USING PRODUCTION MODE - automatically switches to test in development
const REVENUE_CAT_CONFIG = {
  // Automatically use test mode in development, production mode in release builds
  isDevelopment: __DEV__,
  
  // Test API Key (used automatically in development builds)
  testKey: "test_LXNTHAIbYEWItFjLQVyQhnbwSb",
  
  // LIVE RevenueCat API Key (used in production/release builds)
  // From RevenueCat Dashboard: Project Settings → API Keys → Public app-specific API keys
  liveKey: "goog_SWjDQARhamdHehzOCNtDyhZgItS", // ✅ Production key configured
  
  // App configuration
  appId: "appaea277d857", // RevenueCat App ID from dashboard
  
  // Product configuration (same for both test and production)
  productId: "habitpunch_premium_lifetime",
  productType: "inapp", // One-time purchase, not subscription
  entitlementId: "premium",
};

// Get the appropriate API key based on environment
const getApiKey = () => {
  return REVENUE_CAT_CONFIG.isDevelopment 
    ? REVENUE_CAT_CONFIG.testKey 
    : REVENUE_CAT_CONFIG.liveKey;
};

let isConfigured = false;

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts
 */
export const initializeRevenueCat = async (setPermanentPremium) => {
  try {
    if (isConfigured) {
      console.log("RevenueCat already configured");
      return true;
    }

    // Enable debug logging in development only
    if (REVENUE_CAT_CONFIG.isDevelopment) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    const apiKey = getApiKey();
    const mode = REVENUE_CAT_CONFIG.isDevelopment ? "TEST" : "PRODUCTION";
    
    // Configure with environment-appropriate key
    Purchases.configure({
      apiKey: apiKey,
      appUserId: null, // Let RevenueCat auto-generate anonymous user IDs
      observerMode: false, // We want RevenueCat to handle purchases
      userDefaultsSuiteName: null,
      useStoreKit2IfAvailable: true, // Use latest StoreKit on iOS
    });

    isConfigured = true;
    console.log(`✅ RevenueCat initialized successfully (${mode} mode)`);

    // Check initial premium status
    if (setPermanentPremium) {
      await checkPremiumStatus(setPermanentPremium);
    }

    return true;
  } catch (error) {
    console.error("❌ Error initializing RevenueCat:", error);
    return false;
  }
};

/**
 * Check if user has active premium entitlement
 */
export const checkPremiumStatus = async (setPermanentPremium) => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const hasPremium =
      typeof customerInfo.entitlements.active[
        REVENUE_CAT_CONFIG.entitlementId
      ] !== "undefined";

    console.log("Premium status from RevenueCat:", hasPremium);

    // Sync with local storage
    if (setPermanentPremium) {
      await setPermanentPremium(hasPremium);
    }

    return hasPremium;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
};

/**
 * Get available offerings (products)
 */
export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    console.log("Available offerings:", offerings);
    return offerings;
  } catch (error) {
    console.error("Error fetching offerings:", error);
    return null;
  }
};

/**
 * Purchase premium lifetime product
 */
export const purchasePremium = async (setPermanentPremium) => {
  try {
    // Get offerings
    const offerings = await Purchases.getOfferings();

    if (!offerings.current) {
      throw new Error("No current offering available");
    }

    // Find the lifetime package
    const lifetimePackage = offerings.current.availablePackages.find(
      (pkg) =>
        pkg.identifier === "$rc_lifetime" || pkg.identifier === "lifetime",
    );

    if (!lifetimePackage) {
      // If no lifetime package found, try the first available package
      const firstPackage = offerings.current.availablePackages[0];
      if (!firstPackage) {
        throw new Error("No packages available");
      }
      console.log("Using first available package:", firstPackage.identifier);
      const { customerInfo } = await Purchases.purchasePackage(firstPackage);
      const hasPremium =
        typeof customerInfo.entitlements.active[
          REVENUE_CAT_CONFIG.entitlementId
        ] !== "undefined";

      if (hasPremium && setPermanentPremium) {
        await setPermanentPremium(true);
      }

      return { success: true, customerInfo };
    }

    // Purchase the package
    console.log("Purchasing package:", lifetimePackage.identifier);
    const { customerInfo } = await Purchases.purchasePackage(lifetimePackage);

    // Check if purchase was successful
    const hasPremium =
      typeof customerInfo.entitlements.active[
        REVENUE_CAT_CONFIG.entitlementId
      ] !== "undefined";

    if (hasPremium && setPermanentPremium) {
      await setPermanentPremium(true);
      console.log("✅ Premium purchase successful!");
    }

    return { success: hasPremium, customerInfo };
  } catch (error) {
    console.error("Error purchasing premium:", error);

    // Check if user cancelled
    if (error && error.userCancelled) {
      return { success: false, cancelled: true };
    }

    // Return structured error to caller so UI can show actionable message
    return { success: false, cancelled: false, errorMessage: error.message || String(error) };
  }
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (setPermanentPremium) => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const hasPremium =
      typeof customerInfo.entitlements.active[
        REVENUE_CAT_CONFIG.entitlementId
      ] !== "undefined";

    if (hasPremium && setPermanentPremium) {
      await setPermanentPremium(true);
      console.log("✅ Purchases restored successfully!");
    }

    return { success: true, hasPremium, customerInfo };
  } catch (error) {
    console.error("Error restoring purchases:", error);
    return { success: false, error };
  }
};

/**
 * Get product price information
 */
export const getPremiumPrice = async () => {
  try {
    const offerings = await Purchases.getOfferings();

    if (
      !offerings.current ||
      offerings.current.availablePackages.length === 0
    ) {
      return "$4.99"; // Fallback price
    }

    const pkg = offerings.current.availablePackages[0];
    return pkg.product.priceString || "$4.99";
  } catch (error) {
    // Expected error in development if product isn't configured in RevenueCat dashboard
    if (REVENUE_CAT_CONFIG.isDevelopment) {
      console.warn("⚠️ RevenueCat product not configured (using fallback price in development)");
    } else {
      console.error("Error getting price:", error);
    }
    return "$4.99"; // Fallback price
  }
};

export default {
  initializeRevenueCat,
  checkPremiumStatus,
  getOfferings,
  purchasePremium,
  restorePurchases,
  getPremiumPrice,
  config: REVENUE_CAT_CONFIG,
};
