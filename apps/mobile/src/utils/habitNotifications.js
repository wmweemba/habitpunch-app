import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
};

// Schedule daily notification for a habit
export const scheduleHabitReminder = async (habitId, habitName, time) => {
  try {
    // First ensure we have permission
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn("Notification permissions not granted");
      return false;
    }

    // Cancel existing notification for this habit
    await cancelHabitReminder(habitId);

    // Parse time (format: "HH:MM")
    const [hours, minutes] = time.split(":").map(Number);

    console.log(`📅 Scheduling reminder for "${habitName}" at ${hours}:${minutes}`);

    // Schedule new notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Time to Punch!",
        body: `Time to punch your ${habitName} card! Keep the streak going.`,
        data: { habitId },
        sound: true,
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
      identifier: `habit_${habitId}`,
    });

    console.log(`✅ Notification scheduled with ID: ${notificationId}`);
    return true;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return false;
  }
};

// Cancel habit reminder
export const cancelHabitReminder = async (habitId) => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const habitNotification = scheduled.find(
      (n) => n.identifier === `habit_${habitId}`,
    );

    if (habitNotification) {
      await Notifications.cancelScheduledNotificationAsync(
        habitNotification.identifier,
      );
    }
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
};

// Cancel all notifications
export const cancelAllReminders = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error canceling all notifications:", error);
  }
};
