import { useAuth } from "@/utils/auth/useAuth";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initializeRevenueCat } from "../utils/revenueCat";
import { setPermanentPremium } from "../utils/habitStorage";

// Initialize AdMob mobile-ads SDK (if available)
const initMobileAds = async () => {
  try {
    // dynamic require to avoid runtime errors in Expo Go where native module isn't present
    // eslint-disable-next-line global-require
    const mobileAds = require("react-native-google-mobile-ads").default;
    if (mobileAds && typeof mobileAds === "function") {
      const result = await mobileAds().initialize();
      console.log("✅ Mobile Ads initialized:", result);
    }
  } catch (e) {
    // Not fatal; log for debugging. In Expo Go the native module won't exist.
    console.log("⚠️ Mobile Ads not initialized (module missing or failed):", e.message || e);
  }
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate, isReady } = useAuth();

  useEffect(() => {
    initiate();

    // Initialize monetization (RevenueCat) on app startup
    const initMonetization = async () => {
      try {
        await initializeRevenueCat(setPermanentPremium);
        console.log("✅ RevenueCat initialized on app startup");
      } catch (error) {
        console.error("❌ Error initializing RevenueCat:", error);
      }
    };

    // Initialize AdMob SDK (best-effort)
    initMobileAds();

    initMonetization();
  }, [initiate]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
