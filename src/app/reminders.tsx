import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Switch, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthRequired } from '@/components/auth-required';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { api, Reminder } from '@/services/api';
import {
  cancelReminderNotification,
  requestNotificationPermission,
  scheduleReminderNotification,
} from '@/services/notifications';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export default function RemindersScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { isAuthenticated, token } = useAuth();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('Daily Check-In');
  const [time, setTime] = useState('20:00');
  const [message, setMessage] = useState('Time for your evening wellness check-in.');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([...DAYS]);
  const loadRequestIdRef = useRef(0);
  const isLoadingRemindersRef = useRef(false);

  // Request notification permission on mount
  useEffect(() => {
    void requestNotificationPermission();
  }, []);

  useEffect(() => {
    async function loadReminders() {
      if (!token || !isAuthenticated || isLoadingRemindersRef.current) {
        return;
      }

      const requestId = ++loadRequestIdRef.current;
      isLoadingRemindersRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.getReminders(token);
        if (requestId === loadRequestIdRef.current) {
          setReminders(response);
        }
      } catch (loadError) {
        if (requestId === loadRequestIdRef.current) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load reminders');
        }
      } finally {
        if (requestId === loadRequestIdRef.current) {
          setIsLoading(false);
        }
        isLoadingRemindersRef.current = false;
      }
    }

    void loadReminders();
  }, [token, isAuthenticated]);

  const authToken = token ?? '';

  async function handleCreateReminder() {
    if (!title.trim() || !time.trim()) {
      setError('Title and time are required. Use HH:MM.');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const created = await api.createReminder(authToken, {
        title: title.trim(),
        time: time.trim(),
        message: message.trim(),
        daysOfWeek,
      });
      setReminders((current) => [...current, created]);
      // Schedule the notification
      void scheduleReminderNotification(created);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to create reminder');
    } finally {
      setIsSaving(false);
    }
  }

  const toggleReminder = useCallback(async (reminder: Reminder, isEnabled: boolean) => {
    setError(null);

    try {
      const updated = await api.updateReminder(authToken, reminder._id, {
        isEnabled,
      });
      setReminders((current) =>
        current.map((item) => (item._id === reminder._id ? updated : item))
      );
      // Reschedule or cancel notification based on new state
      void scheduleReminderNotification(updated);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Failed to update reminder');
    }
  }, [authToken]);

  const handleDeleteReminder = useCallback(async (id: string) => {
    setError(null);

    try {
      await api.deleteReminder(authToken, id);
      setReminders((current) => current.filter((item) => item._id !== id));
      // Cancel scheduled notification
      void cancelReminderNotification(id);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete reminder');
    }
  }, [authToken]);

  function toggleDay(day: string) {
    setDaysOfWeek((current) => {
      if (current.includes(day)) {
        if (current.length === 1) {
          return current;
        }
        return current.filter((item) => item !== day);
      }
      return [...current, day];
    });
  }

  const renderReminder = useCallback(
    ({ item }: { item: Reminder }) => (
      <ReminderRow
        reminder={item}
        onToggle={toggleReminder}
        onDelete={handleDeleteReminder}
      />
    ),
    [handleDeleteReminder, toggleReminder]
  );

  if (!isAuthenticated || !token) {
    return <AuthRequired title="Reminders" />;
  }

  return (
    <ThemedView style={styles.root}>
      <View style={[styles.screenHeader, { backgroundColor: '#E07B6A' }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.screenHeaderContent}>
            <Ionicons name="notifications" size={22} color="#fff" />
            <Text style={styles.screenHeaderTitle}>Reminders</Text>
          </View>
          <Text style={styles.screenHeaderSub}>Schedule daily check-in reminders</Text>
        </SafeAreaView>
      </View>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <FlatList
          data={reminders}
          keyExtractor={(item) => item._id}
          renderItem={renderReminder}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">Reminders</ThemedText>
            <ThemedText themeColor="textSecondary">
              Schedule reminders so daily check-ins stay consistent.
            </ThemedText>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Reminder title"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
            />

            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
            />

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Optional message"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
            />

            <ThemedText type="smallBold">Days of week</ThemedText>
            <View style={styles.daysRow}>
              {DAYS.map((day) => (
                <Pressable key={day} onPress={() => toggleDay(day)}>
                  <ThemedView
                    type={daysOfWeek.includes(day) ? 'backgroundSelected' : 'background'}
                    style={styles.dayPill}>
                    <ThemedText type="code">{day.toUpperCase()}</ThemedText>
                  </ThemedView>
                </Pressable>
              ))}
            </View>

            <Pressable onPress={handleCreateReminder} disabled={isSaving}>
              <ThemedView type="backgroundSelected" style={styles.button}>
                {isSaving ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <ThemedText type="smallBold">Add Reminder</ThemedText>
                )}
              </ThemedView>
            </Pressable>

            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <ThemedText>Loading reminders...</ThemedText>
              </View>
            ) : null}

            {error ? <ThemedText themeColor="textSecondary">{error}</ThemedText> : null}
            </ThemedView>
          }
          ListEmptyComponent={
            !isLoading ? (
              <ThemedView type="background" style={styles.emptyCard}>
                <ThemedText themeColor="textSecondary">No reminders yet. Add one above.</ThemedText>
              </ThemedView>
            ) : null
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const ReminderRow = React.memo(function ReminderRow({
  reminder,
  onToggle,
  onDelete,
}: {
  reminder: Reminder;
  onToggle: (reminder: Reminder, isEnabled: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <ThemedView type="background" style={styles.reminderCard}>
      <ThemedText type="smallBold">{reminder.title}</ThemedText>
      <ThemedText>{reminder.time}</ThemedText>
      {reminder.message ? <ThemedText>{reminder.message}</ThemedText> : null}
      <ThemedText type="small">Days: {reminder.daysOfWeek.join(', ')}</ThemedText>
      <View style={styles.switchRow}>
        <ThemedText type="smallBold">Enabled</ThemedText>
        <Switch value={reminder.isEnabled} onValueChange={(value) => void onToggle(reminder, value)} />
      </View>
      <Pressable onPress={() => void onDelete(reminder._id)}>
        <ThemedView style={styles.deleteButton}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Delete
          </ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  screenHeader: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  screenHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  screenHeaderTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  screenHeaderSub: { color: 'rgba(255,255,255,0.82)', fontSize: 12, marginTop: 4, paddingBottom: 2 },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  listContent: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  button: {
    borderRadius: Spacing.three,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  reminderCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  emptyCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  dayPill: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  switchRow: {
    marginTop: Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
});
