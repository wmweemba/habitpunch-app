import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { router } from "expo-router";
import { useAppTheme } from "../utils/theme";
import { setOnboardingComplete } from "../utils/habitStorage";
import { requestNotificationPermissions } from "../utils/habitNotifications";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleGetStarted = async () => {
    // Request notification permissions
    await requestNotificationPermissions();

    // Mark onboarding as complete
    await setOnboardingComplete();

    // Navigate to home
    router.replace("/(tabs)");
  };

  const handleNext = () => {
    if (currentPage < 2) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentPage + 1),
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  const renderPunchCardDemo = () => {
    const circles = [];
    for (let i = 0; i < 30; i++) {
      const isPunched = i < 15;
      circles.push(
        <View
          key={i}
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: isPunched ? colors.orange : colors.borderLight,
            backgroundColor: isPunched ? colors.orange : "transparent",
            margin: 3,
          }}
        />,
      );
    }
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          width: width * 0.7,
          justifyContent: "center",
          marginVertical: 40,
        }}
      >
        {circles}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Skip Button */}
      <TouchableOpacity
        onPress={handleGetStarted}
        style={{
          position: "absolute",
          top: insets.top + 16,
          right: 20,
          zIndex: 10,
          padding: 8,
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat_600SemiBold",
            fontSize: 14,
            color: colors.secondary,
          }}
        >
          Skip
        </Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {/* Page 1 */}
        <View
          style={{
            width,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <Text style={{ fontSize: 80, marginBottom: 40 }}>👊</Text>
          <Text
            style={{
              fontFamily: "Montserrat_700Bold",
              fontSize: 32,
              color: colors.primary,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Welcome to{"\n"}HabitPunch!
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
              fontSize: 16,
              color: colors.secondary,
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            Build habits the fun way — punch your card every day and watch your
            progress grow!
          </Text>
        </View>

        {/* Page 2 */}
        <View
          style={{
            width,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <Text style={{ fontSize: 60, marginBottom: 20 }}>🎯</Text>
          <Text
            style={{
              fontFamily: "Montserrat_700Bold",
              fontSize: 28,
              color: colors.primary,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Punch Your Way{"\n"}to Success
          </Text>
          {renderPunchCardDemo()}
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
              fontSize: 16,
              color: colors.secondary,
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            Each card has 30 days. Tap to punch a hole and track your progress
            visually!
          </Text>
        </View>

        {/* Page 3 */}
        <View
          style={{
            width,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <Text style={{ fontSize: 60, marginBottom: 20 }}>🔥</Text>
          <Text
            style={{
              fontFamily: "Montserrat_700Bold",
              fontSize: 28,
              color: colors.primary,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Build Streaks &{"\n"}Share Progress
          </Text>
          <View
            style={{
              backgroundColor: colors.orangeLight,
              borderRadius: 20,
              padding: 24,
              marginVertical: 40,
              width: "80%",
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat_700Bold",
                fontSize: 40,
                color: colors.orange,
                textAlign: "center",
              }}
            >
              🔥 7
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 16,
                color: colors.primary,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Day Streak!
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
              fontSize: 16,
              color: colors.secondary,
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            Track your streaks, get daily reminders, and share your wins with
            friends!
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View
        style={{
          paddingHorizontal: 40,
          paddingBottom: insets.bottom + 32,
          paddingTop: 20,
        }}
      >
        {/* Page Indicators */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={{
                width: currentPage === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentPage === index ? colors.primary : colors.borderLight,
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 16,
            padding: 18,
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
            {currentPage === 2 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
