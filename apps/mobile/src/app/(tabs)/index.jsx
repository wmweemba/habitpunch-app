import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { Plus, Settings } from "lucide-react-native";
import { useAppTheme } from "../../utils/theme";
import {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  punchHabit,
  resetHabit,
  calculateStreak,
  isPremium,
} from "../../utils/habitStorage";
import {
  scheduleHabitReminder,
  cancelHabitReminder,
} from "../../utils/habitNotifications";
import PunchCard from "../../components/PunchCard";
import AddHabitSheet from "../../components/AddHabitSheet";
import EmptyStateCard from "../../components/EmptyStateCard";
import { getBannerAdUnitId } from "../../utils/admob";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const [habits, setHabits] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [premium, setIsPremium] = useState(false);
  const fabScale = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedHabits = await getHabits();
    setHabits(loadedHabits);
    const streakData = await calculateStreak();
    setStreak(streakData);

    // Check premium status
    const premiumStatus = await isPremium();
    setIsPremium(premiumStatus);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSaveHabit = async (habitData) => {
    if (editingHabit) {
      // Update existing habit
      await updateHabit(editingHabit.id, habitData);

      // Update reminder
      if (habitData.reminderEnabled) {
        await scheduleHabitReminder(
          editingHabit.id,
          habitData.name,
          habitData.reminderTime,
        );
      } else {
        await cancelHabitReminder(editingHabit.id);
      }
    } else {
      // Add new habit
      const newHabit = await addHabit(habitData);

      // Schedule reminder if enabled
      if (newHabit && habitData.reminderEnabled) {
        await scheduleHabitReminder(
          newHabit.id,
          habitData.name,
          habitData.reminderTime,
        );
      }
    }

    setShowAddSheet(false);
    setEditingHabit(null);
    await loadData();
  };

  const handlePunch = async (habitId) => {
    await punchHabit(habitId);
    await loadData();
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowAddSheet(true);
  };

  const handleReset = async (habitId) => {
    await resetHabit(habitId);
    await loadData();
  };

  const handleDelete = async (habitId) => {
    await deleteHabit(habitId);
    await cancelHabitReminder(habitId);
    await loadData();
  };

  const handleAddPress = () => {
    // Animate FAB
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setEditingHabit(null);
    setShowAddSheet(true);
  };

  if (!fontsLoaded) {
    return null;
  }

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Montserrat_700Bold",
                fontSize: 24,
                color: colors.primary,
              }}
            >
              HabitPunch
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
                fontSize: 12,
                color: colors.secondary,
                marginTop: 2,
              }}
            >
              {dateString}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.surfaceVariant,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Settings size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Streak Display */}
        {habits.length > 0 && streak.current > 0 && (
          <View
            style={{
              marginTop: 16,
              backgroundColor: colors.orangeLight,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 32, marginRight: 12 }}>🔥</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Montserrat_700Bold",
                  fontSize: 20,
                  color: colors.orange,
                }}
              >
                {streak.current}-day streak!
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                  fontSize: 12,
                  color: colors.secondary,
                  marginTop: 2,
                }}
              >
                Best: {streak.longest} days
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Habits List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + (premium ? 100 : 160),
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.orange}
          />
        }
      >
        {habits.length === 0 ? (
          <EmptyStateCard onAddHabit={handleAddPress} />
        ) : (
          habits.map((habit) => (
            <PunchCard
              key={habit.id}
              habit={habit}
              onPunch={handlePunch}
              onEdit={handleEdit}
              onReset={handleReset}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollView>

      {/* Banner Ad - Only show if not premium */}
      {!premium && habits.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: insets.bottom + 80,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.borderLight,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          {/* TEST BANNER AD PLACEHOLDER */}
          {/* TODO: Replace with actual AdMob BannerAd component */}
          <View
            style={{
              height: 50,
              width: "90%",
              backgroundColor: colors.surfaceVariant,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.borderLight,
              borderStyle: "dashed",
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
                fontSize: 10,
                color: colors.secondary,
              }}
            >
              🧪 Test Banner Ad ({getBannerAdUnitId().slice(-6)})
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
                fontSize: 8,
                color: colors.secondary,
                marginTop: 2,
              }}
            >
              Ad will load here in production
            </Text>
          </View>
        </View>
      )}

      {/* Floating Add Button */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: insets.bottom + 24,
          right: 20,
          transform: [{ scale: fabScale }],
        }}
      >
        <TouchableOpacity
          onPress={handleAddPress}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.orange,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Plus size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Add/Edit Habit Sheet */}
      <AddHabitSheet
        visible={showAddSheet}
        editHabit={editingHabit}
        onClose={() => {
          setShowAddSheet(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        isPremium={premium}
      />
    </View>
  );
}
