import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  Share,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { useAppTheme } from "../utils/theme";
import { getColorByName } from "../utils/habitTheme";

export default function PunchCard({
  habit,
  onPunch,
  onEdit,
  onReset,
  onDelete,
}) {
  const { colors, isDark } = useAppTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevProgress, setPrevProgress] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const punchAnims = useRef(
    Array(30)
      .fill(0)
      .map(() => new Animated.Value(1)),
  ).current;

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  const habitColor = getColorByName(habit.color);
  const punchedDates = habit.punches || [];
  const progress = punchedDates.length;
  const isComplete = progress === 30;

  // Check if card was just completed
  useEffect(() => {
    if (progress === 30 && prevProgress < 30 && prevProgress > 0) {
      setShowCelebration(true);
      Animated.parallel([
        Animated.spring(celebrationScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(celebrationOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(celebrationScale, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(celebrationOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => setShowCelebration(false));
      }, 3000);
    }
    setPrevProgress(progress);
  }, [progress]);

  if (!fontsLoaded) {
    return null;
  }

  // Create a 5x6 grid (30 circles)
  const renderPunchGrid = () => {
    const rows = [];
    for (let row = 0; row < 5; row++) {
      const rowCircles = [];
      for (let col = 0; col < 6; col++) {
        const index = row * 6 + col;
        const isPunched = index < punchedDates.length;
        const isToday = index === punchedDates.length && !isComplete;

        rowCircles.push(
          <Animated.View
            key={index}
            style={{
              transform: [{ scale: punchAnims[index] }],
            }}
          >
            <TouchableOpacity
              onPress={() => handlePunchTap(index)}
              disabled={isPunched || index > punchedDates.length}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: isPunched ? habitColor.value : colors.borderLight,
                backgroundColor: isPunched ? habitColor.value : "transparent",
                justifyContent: "center",
                alignItems: "center",
                margin: 4,
                ...(isToday && {
                  shadowColor: habitColor.value,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  elevation: 8,
                }),
              }}
            >
              {isPunched && <Text style={{ fontSize: 20 }}>{habit.icon}</Text>}
            </TouchableOpacity>
          </Animated.View>,
        );
      }
      rows.push(
        <View
          key={row}
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {rowCircles}
        </View>,
      );
    }
    return rows;
  };

  const handlePunchTap = async (index) => {
    if (index === punchedDates.length) {
      // Animate punch
      Animated.sequence([
        Animated.timing(punchAnims[index], {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(punchAnims[index], {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(punchAnims[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Call parent punch handler
      if (onPunch) {
        onPunch(habit.id);
      }
    }
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMenu(true);
  };

  const handleShare = async () => {
    setShowMenu(false);
    try {
      const playStoreUrl = "https://play.google.com/store/apps/details?id=com.habitpunch.app";
      await Share.share({
        message: `🎉 I've completed ${progress}/30 days of "${habit.name}" on HabitPunch! ${habit.icon}\n\nJoin me in building better habits!\n\nGet HabitPunch: ${playStoreUrl}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleReset = () => {
    setShowMenu(false);
    Alert.alert(
      "Reset Card?",
      `Are you sure you want to reset "${habit.name}"? This will clear all punches.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => onReset && onReset(habit.id),
        },
      ],
    );
  };

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) onEdit(habit);
  };

  const handleDelete = () => {
    setShowMenu(false);
    Alert.alert(
      "Delete Habit?",
      `Are you sure you want to delete "${habit.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete && onDelete(habit.id),
        },
      ],
    );
  };

  return (
    <>
      <TouchableOpacity
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.9}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 20,
          marginBottom: 16,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
          borderWidth: isComplete ? 2 : 0,
          borderColor: isComplete ? habitColor.value : "transparent",
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: habitColor.light,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 18,
                color: colors.primary,
              }}
            >
              {habit.name}
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
                fontSize: 12,
                color: colors.secondary,
                marginTop: 2,
              }}
            >
              {isComplete ? "🎉 Card Complete!" : `Day ${progress}/30`}
            </Text>
          </View>
        </View>

        {/* Punch Grid */}
        <View style={{ marginBottom: 12 }}>{renderPunchGrid()}</View>

        {/* Progress Bar */}
        <View
          style={{
            height: 6,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${(progress / 30) * 100}%`,
              backgroundColor: habitColor.value,
              borderRadius: 3,
            }}
          />
        </View>

        {isComplete && (
          <Text
            style={{
              fontFamily: "Montserrat_600SemiBold",
              fontSize: 14,
              color: habitColor.value,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            🎉 Amazing! Keep going with a new card!
          </Text>
        )}

        {/* Celebration Overlay */}
        {showCelebration && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              opacity: celebrationOpacity,
              transform: [{ scale: celebrationScale }],
            }}
          >
            <View
              style={{
                backgroundColor: habitColor.value,
                borderRadius: 100,
                width: 100,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 50 }}>🎉</Text>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Context Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 8,
              width: "80%",
              maxWidth: 300,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.borderLight,
              }}
              onPress={handleShare}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                📤 Share Progress
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.borderLight,
              }}
              onPress={handleEdit}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                ✏️ Edit Habit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.borderLight,
              }}
              onPress={handleReset}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 16,
                  color: colors.orange,
                  textAlign: "center",
                }}
              >
                🔄 Reset Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.borderLight,
              }}
              onPress={handleDelete}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 16,
                  color: "#E74C3C",
                  textAlign: "center",
                }}
              >
                🗑️ Delete Habit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: 16 }}
              onPress={() => setShowMenu(false)}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                  fontSize: 16,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
