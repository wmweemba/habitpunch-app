import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { useAppTheme } from "../utils/theme";

export default function EmptyStateCard({ onAddHabit }) {
  const { colors, isDark } = useAppTheme();

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
      }}
    >
      {/* Illustration */}
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: colors.orangeLight,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Text style={{ fontSize: 60 }}>👊</Text>
      </View>

      {/* Empty State Text */}
      <Text
        style={{
          fontFamily: "Montserrat_600SemiBold",
          fontSize: 22,
          color: colors.primary,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        No Habits Yet!
      </Text>

      <Text
        style={{
          fontFamily: "Montserrat_500Medium",
          fontSize: 14,
          color: colors.secondary,
          textAlign: "center",
          lineHeight: 20,
          marginBottom: 32,
          paddingHorizontal: 40,
        }}
      >
        Add your first habit to start punching! Build better habits one day at a
        time.
      </Text>

      {/* Add Habit Button */}
      <TouchableOpacity
        onPress={onAddHabit}
        style={{
          backgroundColor: colors.orange,
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 32,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat_600SemiBold",
            fontSize: 16,
            color: "#FFFFFF",
          }}
        >
          + Add Your First Habit
        </Text>
      </TouchableOpacity>
    </View>
  );
}
