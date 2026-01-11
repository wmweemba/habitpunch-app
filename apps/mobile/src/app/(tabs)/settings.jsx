import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import {
  Crown,
  Star,
  Share2,
  Info,
  ChevronRight,
  RefreshCw,
} from "lucide-react-native";
import { useAppTheme } from "../../utils/theme";
import {
  isPremium,
  setPermanentPremium,
  setTemporaryPremium,
  getPremiumExpiry,
  isPermanentPremium,
} from "../../utils/habitStorage";
import {
  initializeRevenueCat,
  purchasePremium,
  restorePurchases,
  getPremiumPrice,
} from "../../utils/revenueCat";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const [premium, setIsPremium] = useState(false);
  const [premiumPermanent, setPremiumPermanent] = useState(false);
  const [premiumExpiry, setPremiumExpiry] = useState(null);
  const [premiumPrice, setPremiumPrice] = useState("$4.99");
  const [loading, setLoading] = useState(false);
  const [revenueCatReady, setRevenueCatReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    initializeMonetization();
  }, []);

  const initializeMonetization = async () => {
    try {
      // Initialize RevenueCat
      const initialized = await initializeRevenueCat(setPermanentPremium);
      setRevenueCatReady(initialized);

      // Load premium status
      await loadPremiumStatus();

      // Get product price
      if (initialized) {
        const price = await getPremiumPrice();
        setPremiumPrice(price);
      }
    } catch (error) {
      console.error("Error initializing monetization:", error);
    }
  };

  const loadPremiumStatus = async () => {
    const status = await isPremium();
    const permanent = await isPermanentPremium();
    const expiry = await getPremiumExpiry();

    setIsPremium(status);
    setPremiumPermanent(permanent);
    setPremiumExpiry(expiry);
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleUpgradeToPremium = async () => {
    if (!revenueCatReady) {
      Alert.alert(
        "Not Ready",
        "Payment system is initializing. Please try again in a moment.",
      );
      return;
    }

    Alert.alert(
      "🎉 Upgrade to Premium",
      `Remove ads and unlock premium themes, custom sounds, and more!\n\nOne-time purchase: ${premiumPrice}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Purchase",
          onPress: async () => {
            setLoading(true);
            try {
              const result = await purchasePremium(setPermanentPremium);

              if (result.cancelled) {
                // User cancelled, do nothing
                return;
              }

              if (result.success) {
                await loadPremiumStatus();
                Alert.alert(
                  "Success! 🎉",
                  "Welcome to HabitPunch Premium! All features unlocked.",
                );
              } else {
                Alert.alert(
                  "Purchase Failed",
                  "Unable to complete purchase. Please try again.",
                );
              }
            } catch (error) {
              console.error("Purchase error:", error);
              Alert.alert(
                "Error",
                "Something went wrong. Please try again later.",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleRestorePurchases = async () => {
    if (!revenueCatReady) {
      Alert.alert(
        "Not Ready",
        "Payment system is initializing. Please try again in a moment.",
      );
      return;
    }

    setLoading(true);
    try {
      const result = await restorePurchases(setPermanentPremium);

      if (result.success && result.hasPremium) {
        await loadPremiumStatus();
        Alert.alert("Success!", "Your premium purchase has been restored! 🎉");
      } else {
        Alert.alert(
          "No Purchases Found",
          "We couldn't find any previous purchases to restore.",
        );
      }
    } catch (error) {
      console.error("Restore error:", error);
      Alert.alert("Error", "Unable to restore purchases. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWatchRewardedAd = () => {
    // TODO: Implement AdMob rewarded video ad
    // For now, simulate the reward for testing
    Alert.alert(
      "🎁 Watch Ad for 24h Premium",
      "Watch a short video to unlock premium features for 24 hours!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Watch",
          onPress: async () => {
            // TEMPORARY: Simulate ad reward for testing
            // Replace this with actual AdMob rewarded ad implementation
            try {
              await setTemporaryPremium(24);
              await loadPremiumStatus();
              Alert.alert(
                "Premium Unlocked! 🎉",
                "You now have premium features for 24 hours. Enjoy!",
              );
            } catch (error) {
              console.error("Error setting temporary premium:", error);
              Alert.alert(
                "Error",
                "Failed to unlock premium. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const handleRateApp = () => {
    // TODO: Replace with actual app store link
    Alert.alert(
      "Rate HabitPunch",
      "Thank you for your support! This will open the App Store.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Rate",
          onPress: () => {
            // Linking.openURL('itms-apps://itunes.apple.com/app/id...'); // iOS
            Alert.alert(
              "Feature Coming Soon",
              "App Store link will be added after publishing.",
            );
          },
        },
      ],
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "🔥 Check out HabitPunch! Build better habits the fun way with punch cards. Download now!",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleAbout = () => {
    Alert.alert(
      "About HabitPunch",
      "Version 1.0.0\n\nBuild habits the fun way with satisfying punch cards!\n\nMade with ❤️ on Anything",
      [{ text: "OK" }],
    );
  };

  const getExpiryText = () => {
    if (!premiumExpiry) return "";
    const hoursLeft = Math.ceil(
      (premiumExpiry - Date.now()) / (1000 * 60 * 60),
    );
    if (hoursLeft <= 0) return "Expired";
    return `${hoursLeft} hours remaining`;
  };

  const SettingItem = ({ icon: Icon, title, subtitle, onPress, accent }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: accent ? accent + "20" : colors.surfaceVariant,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Icon size={22} color={accent || colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Montserrat_600SemiBold",
            fontSize: 16,
            color: colors.primary,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
              fontSize: 12,
              color: colors.secondary,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <ChevronRight size={20} color={colors.secondary} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat_600SemiBold",
            fontSize: 28,
            color: colors.primary,
          }}
        >
          Settings
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Section */}
        {!premium ? (
          <View style={{ marginBottom: 24 }}>
            <TouchableOpacity
              onPress={handleUpgradeToPremium}
              disabled={loading}
              style={{
                backgroundColor: colors.yellow,
                borderRadius: 20,
                padding: 24,
                marginBottom: 12,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <View style={{ alignItems: "center", paddingVertical: 20 }}>
                  <ActivityIndicator
                    size="large"
                    color={isDark ? "#000000" : "#FFFFFF"}
                  />
                  <Text
                    style={{
                      fontFamily: "Montserrat_600SemiBold",
                      fontSize: 14,
                      color: isDark ? "#000000" : "#FFFFFF",
                      marginTop: 12,
                    }}
                  >
                    Processing...
                  </Text>
                </View>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Crown size={28} color={isDark ? "#000000" : "#FFFFFF"} />
                    <Text
                      style={{
                        fontFamily: "Montserrat_600SemiBold",
                        fontSize: 20,
                        color: isDark ? "#000000" : "#FFFFFF",
                        marginLeft: 12,
                      }}
                    >
                      Upgrade to Premium
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Montserrat_500Medium",
                      fontSize: 14,
                      color: isDark ? "#000000" : "#FFFFFF",
                      lineHeight: 20,
                      marginBottom: 16,
                    }}
                  >
                    • Remove all ads{"\n"}• Unlock 10 premium themes{"\n"}•
                    Custom punch sounds{"\n"}• Priority support
                  </Text>
                  <View
                    style={{
                      backgroundColor: isDark ? "#FFFFFF" : "#000000",
                      borderRadius: 12,
                      padding: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat_600SemiBold",
                        fontSize: 16,
                        color: isDark ? "#000000" : "#FFFFFF",
                      }}
                    >
                      One-time: {premiumPrice}
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleWatchRewardedAd}
              disabled={loading}
              style={{
                backgroundColor: colors.purple,
                borderRadius: 16,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                }}
              >
                🎁 Watch Ad for Free Premium (24h)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRestorePurchases}
              disabled={loading}
              style={{
                backgroundColor: colors.surfaceVariant,
                borderRadius: 12,
                padding: 12,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RefreshCw size={16} color={colors.secondary} />
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    fontSize: 12,
                    color: colors.secondary,
                    marginLeft: 6,
                  }}
                >
                  Restore Purchases
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: premiumPermanent
                ? colors.greenLight
                : colors.blueLight,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              alignItems: "center",
            }}
          >
            <Crown
              size={32}
              color={premiumPermanent ? colors.green : colors.blue}
            />
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginTop: 12,
              }}
            >
              {premiumPermanent ? "Premium Active 🎉" : "24h Premium Active 🎁"}
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
                fontSize: 12,
                color: colors.secondary,
                marginTop: 4,
              }}
            >
              {premiumPermanent
                ? "Thank you for your support!"
                : getExpiryText()}
            </Text>
            {!premiumPermanent && (
              <TouchableOpacity
                onPress={handleUpgradeToPremium}
                disabled={loading}
                style={{
                  backgroundColor: colors.yellow,
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  marginTop: 12,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 13,
                    color: isDark ? "#000000" : "#FFFFFF",
                  }}
                >
                  Upgrade to Permanent ({premiumPrice})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* General Settings */}
        <Text
          style={{
            fontFamily: "Montserrat_600SemiBold",
            fontSize: 14,
            color: colors.secondary,
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          GENERAL
        </Text>

        <SettingItem
          icon={Star}
          title="Rate HabitPunch"
          subtitle="Share your feedback on the App Store"
          onPress={handleRateApp}
          accent={colors.yellow}
        />

        <SettingItem
          icon={Share2}
          title="Share with Friends"
          subtitle="Help others build better habits"
          onPress={handleShareApp}
          accent={colors.blue}
        />

        <SettingItem
          icon={Info}
          title="About"
          subtitle="Version 1.0.0"
          onPress={handleAbout}
          accent={colors.purple}
        />

        {/* Footer */}
        <Text
          style={{
            fontFamily: "Montserrat_500Medium",
            fontSize: 12,
            color: colors.secondary,
            textAlign: "center",
            marginTop: 32,
            lineHeight: 18,
          }}
        >
          Made with ❤️ on Anything{"\n"}© 2026 HabitPunch
        </Text>
      </ScrollView>
    </View>
  );
}
