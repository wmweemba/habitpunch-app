import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { X, Clock, Crown } from "lucide-react-native";
import { useAppTheme } from "../utils/theme";
import { HABIT_COLORS, HABIT_ICONS, PREMIUM_COLORS } from "../utils/habitTheme";

export default function AddHabitSheet({
  visible,
  onClose,
  onSave,
  editHabit,
  isPremium,
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("💪");
  const [selectedColor, setSelectedColor] = useState("Orange");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    if (editHabit) {
      setName(editHabit.name || "");
      setSelectedIcon(editHabit.icon || "💪");
      setSelectedColor(editHabit.color || "Orange");
      setReminderEnabled(editHabit.reminderEnabled || false);
      setReminderTime(editHabit.reminderTime || "09:00");
    } else {
      // Reset form for new habit
      setName("");
      setSelectedIcon("💪");
      setSelectedColor("Orange");
      setReminderEnabled(false);
      setReminderTime("09:00");
    }
  }, [editHabit, visible]);

  if (!fontsLoaded) {
    return null;
  }

  const allColors = isPremium
    ? [...HABIT_COLORS, ...PREMIUM_COLORS]
    : HABIT_COLORS;

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a habit name");
      return;
    }

    onSave({
      ...(editHabit || {}),
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
      reminderEnabled,
      reminderTime,
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
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
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              {editHabit ? "Edit Habit" : "New Habit"}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Habit Name */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 14,
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Habit Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Drink Water"
              placeholderTextColor={colors.placeholder}
              maxLength={30}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                fontFamily: "Montserrat_500Medium",
                fontSize: 16,
                color: colors.primary,
                borderWidth: 1,
                borderColor: colors.borderLight,
              }}
            />
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
                fontSize: 12,
                color: colors.secondary,
                marginTop: 4,
                textAlign: "right",
              }}
            >
              {name.length}/30
            </Text>
          </View>

          {/* Icon Picker */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 14,
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Choose Icon
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {HABIT_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor:
                      selectedIcon === icon ? colors.primary : colors.surface,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor:
                      selectedIcon === icon
                        ? colors.primary
                        : colors.borderLight,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Picker */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                }}
              >
                Choose Color
              </Text>
              {!isPremium && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Crown size={14} color={colors.yellow} />
                  <Text
                    style={{
                      fontFamily: "Montserrat_500Medium",
                      fontSize: 11,
                      color: colors.secondary,
                      marginLeft: 4,
                    }}
                  >
                    +10 premium colors
                  </Text>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {allColors.map((color) => {
                const isPremiumColor = PREMIUM_COLORS.some(
                  (c) => c.name === color.name,
                );
                const isLocked = isPremiumColor && !isPremium;

                return (
                  <TouchableOpacity
                    key={color.name}
                    onPress={() => {
                      if (!isLocked) {
                        setSelectedColor(color.name);
                      }
                    }}
                    disabled={isLocked}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 16,
                      backgroundColor: color.value,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: selectedColor === color.name ? 3 : 0,
                      borderColor: isDark ? "#FFFFFF" : "#000000",
                      opacity: isLocked ? 0.4 : 1,
                    }}
                  >
                    {selectedColor === color.name ? (
                      <Text style={{ fontSize: 24 }}>✓</Text>
                    ) : isLocked ? (
                      <Crown size={20} color={isDark ? "#FFFFFF" : "#000000"} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
            {!isPremium && (
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                  fontSize: 11,
                  color: colors.secondary,
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Unlock premium colors and sounds with Premium ✨
              </Text>
            )}
          </View>

          {/* Daily Reminder */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: reminderEnabled ? 16 : 0,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Clock size={20} color={colors.primary} />
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 14,
                    color: colors.primary,
                    marginLeft: 8,
                  }}
                >
                  Daily Reminder
                </Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{
                  false: colors.borderLight,
                  true: colors.green,
                }}
                thumbColor={colors.surface}
              />
            </View>

            {reminderEnabled && (
              <View>
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    fontSize: 12,
                    color: colors.secondary,
                    marginBottom: 8,
                  }}
                >
                  Reminder Time
                </Text>
                <TextInput
                  value={reminderTime}
                  onChangeText={setReminderTime}
                  placeholder="09:00"
                  placeholderTextColor={colors.placeholder}
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: 12,
                    padding: 12,
                    fontFamily: "Montserrat_500Medium",
                    fontSize: 16,
                    color: colors.primary,
                    borderWidth: 1,
                    borderColor: colors.borderLight,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    fontSize: 10,
                    color: colors.secondary,
                    marginTop: 4,
                  }}
                >
                  Format: HH:MM (24-hour)
                </Text>
              </View>
            )}
          </View>

          {/* Info */}
          <View
            style={{
              backgroundColor: colors.blueLight,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
                fontSize: 12,
                color: colors.primary,
                lineHeight: 18,
              }}
            >
              💡 Your punch card will have 30 days. When you complete all 30
              days, a new card will automatically start!
          </Text>
        </View>
        </ScrollView>

        {/* Save Button */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
            paddingBottom: insets.bottom + 20,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.borderLight,
          }}
        >
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              padding: 16,
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
              {editHabit ? "Save Changes" : "Create Habit"}
            </Text>
          </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
);
}

