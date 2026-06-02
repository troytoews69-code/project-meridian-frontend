import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthRequired } from '@/components/auth-required';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/services/api';

export default function ProfileEditScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated, token } = useAuth();

  const [name, setName] = useState('');
  const [menopauseStage, setMenopauseStage] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [reminderTime, setReminderTime] = useState('20:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!token || !isAuthenticated) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.getProfile(token);
        setName(response.user.name || '');
        setMenopauseStage(response.user.menopauseStage || '');
        setDateOfBirth(response.user.dateOfBirth || '');
        setUnits(response.preferences?.units || 'metric');
        setReminderTime(response.preferences?.reminderTime || '20:00');
        setNotificationsEnabled(Boolean(response.preferences?.notificationsEnabled));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [token, isAuthenticated]);

  if (!isAuthenticated || !token) {
    return <AuthRequired title="Edit Profile" />;
  }

  const authToken = token;

  async function handleSave() {
    setError(null);

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(reminderTime.trim())) {
      setError('Reminder time must use HH:MM format.');
      return;
    }

    setIsSaving(true);

    try {
      await Promise.all([
        api.updateProfile(authToken, {
          name: name.trim(),
          menopauseStage: menopauseStage.trim() || undefined,
          dateOfBirth: dateOfBirth.trim() || undefined,
        }),
        api.updatePreferences(authToken, {
          units,
          reminderTime: reminderTime.trim(),
          notificationsEnabled,
        }),
      ]);

      router.push('/profile');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">Edit Profile</ThemedText>

            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <ThemedText>Loading...</ThemedText>
              </View>
            ) : null}

            {!isLoading && !name ? (
              <ThemedText themeColor="textSecondary">
                Profile values are empty. You can set them now and save.
              </ThemedText>
            ) : null}

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
            <TextInput
              value={menopauseStage}
              onChangeText={setMenopauseStage}
              placeholder="Menopause stage"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
            <TextInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="Date of birth (YYYY-MM-DD)"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
            <TextInput
              value={reminderTime}
              onChangeText={setReminderTime}
              placeholder="Reminder time (HH:MM)"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />

            <ThemedView style={styles.inlineRow}>
              <ThemedText type="smallBold">Units</ThemedText>
              <View style={styles.toggleRow}>
                <Pressable onPress={() => setUnits('metric')}>
                  <ThemedView type={units === 'metric' ? 'backgroundSelected' : 'background'} style={styles.pill}>
                    <ThemedText type="smallBold">Metric</ThemedText>
                  </ThemedView>
                </Pressable>
                <Pressable onPress={() => setUnits('imperial')}>
                  <ThemedView
                    type={units === 'imperial' ? 'backgroundSelected' : 'background'}
                    style={styles.pill}>
                    <ThemedText type="smallBold">Imperial</ThemedText>
                  </ThemedView>
                </Pressable>
              </View>
            </ThemedView>

            <ThemedView style={styles.inlineRow}>
              <ThemedText type="smallBold">Notifications</ThemedText>
              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            </ThemedView>

            {error ? <ThemedText themeColor="textSecondary">{error}</ThemedText> : null}

            <Pressable onPress={handleSave} disabled={isSaving}>
              <ThemedView type="backgroundSelected" style={styles.button}>
                {isSaving ? (
                  <ActivityIndicator color={theme.text} />
                ) : (
                  <ThemedText type="smallBold">Save Changes</ThemedText>
                )}
              </ThemedView>
            </Pressable>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  scrollContent: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
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
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  pill: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
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
});
