import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  HABITS: "@habitpunch_habits",
  ONBOARDING_COMPLETE: "@habitpunch_onboarding",
  PREMIUM_STATUS: "@habitpunch_premium",
  PREMIUM_EXPIRY: "@habitpunch_premium_expiry",
  PREMIUM_PERMANENT: "@habitpunch_premium_permanent",
};

// Get all habits
export const getHabits = async () => {
  try {
    const habitsJson = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
    return habitsJson ? JSON.parse(habitsJson) : [];
  } catch (error) {
    console.error("Error loading habits:", error);
    return [];
  }
};

// Save habits
export const saveHabits = async (habits) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (error) {
    console.error("Error saving habits:", error);
  }
};

// Add new habit
export const addHabit = async (habit) => {
  try {
    const habits = await getHabits();
    const newHabit = {
      id: Date.now().toString(),
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      punches: [], // Array of date strings
      reminderEnabled: habit.reminderEnabled || false,
      reminderTime: habit.reminderTime || "09:00",
      createdAt: new Date().toISOString(),
    };
    habits.push(newHabit);
    await saveHabits(habits);
    return newHabit;
  } catch (error) {
    console.error("Error adding habit:", error);
    return null;
  }
};

// Update habit
export const updateHabit = async (habitId, updates) => {
  try {
    const habits = await getHabits();
    const index = habits.findIndex((h) => h.id === habitId);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates };
      await saveHabits(habits);
      return habits[index];
    }
    return null;
  } catch (error) {
    console.error("Error updating habit:", error);
    return null;
  }
};

// Delete habit
export const deleteHabit = async (habitId) => {
  try {
    const habits = await getHabits();
    const filtered = habits.filter((h) => h.id !== habitId);
    await saveHabits(filtered);
  } catch (error) {
    console.error("Error deleting habit:", error);
  }
};

// Punch a hole for today
export const punchHabit = async (habitId, date = new Date().toDateString()) => {
  try {
    const habits = await getHabits();
    const habit = habits.find((h) => h.id === habitId);
    if (habit && !habit.punches.includes(date)) {
      habit.punches.push(date);

      // If card is complete (30 punches), create a new card automatically
      if (habit.punches.length === 30) {
        habit.punches = []; // Reset for new card
        habit.completedCards = (habit.completedCards || 0) + 1;
      }

      await saveHabits(habits);
      return habit;
    }
    return null;
  } catch (error) {
    console.error("Error punching habit:", error);
    return null;
  }
};

// Reset habit card
export const resetHabit = async (habitId) => {
  try {
    const habits = await getHabits();
    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      habit.punches = [];
      await saveHabits(habits);
      return habit;
    }
    return null;
  } catch (error) {
    console.error("Error resetting habit:", error);
    return null;
  }
};

// Calculate global streak
export const calculateStreak = async () => {
  try {
    const habits = await getHabits();
    if (habits.length === 0) return { current: 0, longest: 0 };

    const allDates = new Set();
    habits.forEach((habit) => {
      habit.punches.forEach((date) => allDates.add(date));
    });

    const sortedDates = Array.from(allDates).sort(
      (a, b) => new Date(a) - new Date(b),
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const date = sortedDates[i];
      if (i === sortedDates.length - 1) {
        if (date === today || date === yesterday) {
          currentStreak = 1;
          tempStreak = 1;
        }
      } else {
        const prevDate = new Date(sortedDates[i + 1]);
        const currDate = new Date(date);
        const diffTime = Math.abs(prevDate - currDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          if (currentStreak > 0) currentStreak++;
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return { current: currentStreak, longest: longestStreak };
  } catch (error) {
    console.error("Error calculating streak:", error);
    return { current: 0, longest: 0 };
  }
};

// Onboarding
export const isOnboardingComplete = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === "true";
  } catch (error) {
    return false;
  }
};

export const setOnboardingComplete = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, "true");
  } catch (error) {
    console.error("Error setting onboarding:", error);
  }
};

// Premium status with permanent and temporary support
export const isPremium = async () => {
  try {
    // Check permanent premium first
    const permanentValue = await AsyncStorage.getItem(
      STORAGE_KEYS.PREMIUM_PERMANENT,
    );
    if (permanentValue === "true") {
      return true;
    }

    // Check temporary premium (from rewarded ads)
    const tempValue = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS);
    const expiryValue = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_EXPIRY);

    if (tempValue === "true" && expiryValue) {
      const expiryTime = parseInt(expiryValue, 10);
      const now = Date.now();

      if (now < expiryTime) {
        return true;
      } else {
        // Expired, clean up
        await AsyncStorage.removeItem(STORAGE_KEYS.PREMIUM_STATUS);
        await AsyncStorage.removeItem(STORAGE_KEYS.PREMIUM_EXPIRY);
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking premium:", error);
    return false;
  }
};

export const setPremium = async (status) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PREMIUM_STATUS,
      status ? "true" : "false",
    );
  } catch (error) {
    console.error("Error setting premium:", error);
  }
};

// Set permanent premium (from IAP)
export const setPermanentPremium = async (status) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PREMIUM_PERMANENT,
      status ? "true" : "false",
    );
  } catch (error) {
    console.error("Error setting permanent premium:", error);
  }
};

// Set temporary premium with expiry (from rewarded ads)
export const setTemporaryPremium = async (hours = 24) => {
  try {
    const expiryTime = Date.now() + hours * 60 * 60 * 1000;
    await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, "true");
    await AsyncStorage.setItem(
      STORAGE_KEYS.PREMIUM_EXPIRY,
      expiryTime.toString(),
    );
  } catch (error) {
    console.error("Error setting temporary premium:", error);
  }
};

// Get premium expiry time
export const getPremiumExpiry = async () => {
  try {
    const permanentValue = await AsyncStorage.getItem(
      STORAGE_KEYS.PREMIUM_PERMANENT,
    );
    if (permanentValue === "true") {
      return null; // Permanent, no expiry
    }

    const expiryValue = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_EXPIRY);
    if (expiryValue) {
      return parseInt(expiryValue, 10);
    }
    return null;
  } catch (error) {
    console.error("Error getting premium expiry:", error);
    return null;
  }
};

// Check if premium is permanent
export const isPermanentPremium = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_PERMANENT);
    return value === "true";
  } catch (error) {
    console.error("Error checking permanent premium:", error);
    return false;
  }
};

// Clear all app data (for testing/screenshots)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.HABITS,
      STORAGE_KEYS.ONBOARDING_COMPLETE,
      STORAGE_KEYS.PREMIUM_STATUS,
      STORAGE_KEYS.PREMIUM_EXPIRY,
      STORAGE_KEYS.PREMIUM_PERMANENT,
      "hasSeenOnboarding", // AnythingMenu key
    ]);
    console.log("✅ All app data cleared successfully");
    return true;
  } catch (error) {
    console.error("❌ Error clearing app data:", error);
    return false;
  }
};
