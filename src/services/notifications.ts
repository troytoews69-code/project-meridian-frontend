import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { Reminder } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DAY_MAP: Record<string, number> = {
  sun: 1, mon: 2, tue: 3, wed: 4, thu: 5, fri: 6, sat: 7,
};

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleReminderNotification(reminder: Reminder): Promise<void> {
  if (Platform.OS === 'web') return;

  const [hourStr, minuteStr] = reminder.time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return;

  // Cancel existing notifications for this reminder first
  await cancelReminderNotification(reminder._id);

  if (!reminder.isEnabled) return;

  for (const day of reminder.daysOfWeek) {
    const weekday = DAY_MAP[day];
    if (!weekday) continue;

    await Notifications.scheduleNotificationAsync({
      identifier: `${reminder._id}-${day}`,
      content: {
        title: reminder.title,
        body: reminder.message || 'Time for your wellness check-in.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour,
        minute,
      },
    });
  }
}

export async function cancelReminderNotification(reminderId: string): Promise<void> {
  if (Platform.OS === 'web') return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.identifier.startsWith(`${reminderId}-`)) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}
