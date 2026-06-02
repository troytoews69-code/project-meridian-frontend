import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Share, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getDailyEncouragement, getDayPeriod, getDayPeriodLabel } from '@/constants/encouragement';
import { useAuth } from '@/context/auth-context';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api, DailyCheckin, ProfileResponse } from '@/services/api';

type AuthMode = 'login' | 'register';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isLoading, isAuthenticated, token, user, login, register, logout } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [latestCheckin, setLatestCheckin] = useState<DailyCheckin | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [encouragementStatus, setEncouragementStatus] = useState<string | null>(null);
  const [isSavingEncouragement, setIsSavingEncouragement] = useState(false);

  const reminderTime = profile?.preferences?.reminderTime ?? '20:00';
  const displayName = profile?.user?.name ?? user?.name;
  const dayPeriod = useMemo(() => getDayPeriod(new Date()), []);
  const encouragementTitle = useMemo(() => `${getDayPeriodLabel(dayPeriod)} Encouragement`, [dayPeriod]);
  const encouragementMessage = useMemo(
    () => getDailyEncouragement({ name: displayName, period: dayPeriod }),
    [displayName, dayPeriod]
  );

  const todaySummary = useMemo(() => {
    if (!latestCheckin) {
      return null;
    }

    return [
      { label: 'Mood', value: latestCheckin.mood },
      { label: 'Sleep', value: latestCheckin.sleepQuality },
      { label: 'Energy', value: latestCheckin.energyLevel },
      { label: 'Symptoms', value: latestCheckin.symptomSeverity },
    ];
  }, [latestCheckin]);

  useEffect(() => {
    async function loadDashboard() {
      if (!token || !isAuthenticated) {
        return;
      }

      setDashboardLoading(true);
      setDashboardError(null);

      try {
        const [profileResponse, checkins] = await Promise.all([
          api.getProfile(token),
          api.getCheckins(token),
        ]);

        setProfile(profileResponse);
        setLatestCheckin(checkins[0] ?? null);
      } catch (error) {
        setDashboardError(error instanceof Error ? error.message : 'Failed to load dashboard');
      } finally {
        setDashboardLoading(false);
      }
    }

    void loadDashboard();
  }, [token, isAuthenticated]);

  async function handleAuthSubmit() {
    setAuthError(null);
    setAuthSubmitting(true);

    try {
      if (mode === 'register') {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }

      setPassword('');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleShareEncouragement() {
    setEncouragementStatus(null);

    try {
      await Share.share({
        title: encouragementTitle,
        message: encouragementMessage,
      });
      setEncouragementStatus('Shared.');
    } catch {
      setEncouragementStatus('Could not share right now. Please try again.');
    }
  }

  async function handleSaveEncouragement() {
    if (!isAuthenticated || !token) {
      setEncouragementStatus('Sign in to save this message.');
      return;
    }

    setEncouragementStatus(null);
    setIsSavingEncouragement(true);

    try {
      const dateLabel = new Date().toISOString().slice(0, 10);
      await api.createNote(token, {
        title: `Daily Encouragement ${dateLabel}`,
        content: encouragementMessage,
        tags: ['encouragement'],
      });
      setEncouragementStatus('Saved to Notes.');
    } catch (error) {
      setEncouragementStatus(error instanceof Error ? error.message : 'Could not save message.');
    } finally {
      setIsSavingEncouragement(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle">Women Over 40 Health</ThemedText>
          <ThemedText themeColor="textSecondary">
            Private daily check-ins, trend visibility, and practical insights for appointments.
          </ThemedText>

          <ThemedView type="background" style={styles.encouragementCard}>
            <ThemedText type="smallBold">{encouragementTitle}</ThemedText>
            <ThemedText>{encouragementMessage}</ThemedText>

            <ThemedView style={styles.encouragementActionRow}>
              <Pressable onPress={() => void handleSaveEncouragement()} disabled={isSavingEncouragement}>
                <ThemedView type="backgroundSelected" style={styles.encouragementActionButton}>
                  <ThemedText type="smallBold">
                    {isSavingEncouragement ? 'Saving...' : 'Save Message'}
                  </ThemedText>
                </ThemedView>
              </Pressable>

              <Pressable onPress={() => void handleShareEncouragement()}>
                <ThemedView type="background" style={styles.encouragementActionButton}>
                  <ThemedText type="smallBold">Share Message</ThemedText>
                </ThemedView>
              </Pressable>
            </ThemedView>

            {encouragementStatus ? (
              <ThemedText type="small" themeColor="textSecondary">
                {encouragementStatus}
              </ThemedText>
            ) : null}
          </ThemedView>

          {isLoading ? (
            <ThemedView style={styles.loadingRow}>
              <ActivityIndicator color={theme.text} />
              <ThemedText>Loading your session...</ThemedText>
            </ThemedView>
          ) : null}

          {!isLoading && !isAuthenticated ? (
            <>
              <ThemedView style={styles.modeRow}>
                <Pressable onPress={() => setMode('login')}>
                  <ThemedView
                    type={mode === 'login' ? 'backgroundSelected' : 'background'}
                    style={styles.modePill}>
                    <ThemedText type="smallBold">Login</ThemedText>
                  </ThemedView>
                </Pressable>
                <Pressable onPress={() => setMode('register')}>
                  <ThemedView
                    type={mode === 'register' ? 'backgroundSelected' : 'background'}
                    style={styles.modePill}>
                    <ThemedText type="smallBold">Register</ThemedText>
                  </ThemedView>
                </Pressable>
              </ThemedView>

              {mode === 'register' ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Name"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
                  autoCapitalize="words"
                />
              ) : null}

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
                secureTextEntry
              />

              {authError ? <ThemedText themeColor="textSecondary">{authError}</ThemedText> : null}

              <Pressable onPress={handleAuthSubmit} disabled={authSubmitting}>
                <ThemedView type="backgroundSelected" style={styles.primaryButton}>
                  <ThemedText type="smallBold">
                    {authSubmitting
                      ? 'Submitting...'
                      : mode === 'register'
                        ? 'Create Account'
                        : 'Sign In'}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            </>
          ) : null}

          {!isLoading && isAuthenticated ? (
            <>
              <ThemedText type="title" style={styles.greeting}>
                Hi {user?.name ?? 'there'}
              </ThemedText>
              <ThemedText themeColor="textSecondary">Next check-in reminder: {reminderTime}</ThemedText>

              <ThemedView style={styles.actionRow}>
                <Pressable style={styles.grow} onPress={() => router.push('/checkin')}>
                  <ThemedView type="backgroundSelected" style={styles.actionButton}>
                    <ThemedText type="smallBold">Start Check-In</ThemedText>
                  </ThemedView>
                </Pressable>

                <Pressable style={styles.grow} onPress={() => router.push('/trends')}>
                  <ThemedView type="backgroundSelected" style={styles.actionButton}>
                    <ThemedText type="smallBold">View Trends</ThemedText>
                  </ThemedView>
                </Pressable>

                <Pressable style={styles.grow} onPress={() => router.push('/profile')}>
                  <ThemedView type="backgroundSelected" style={styles.actionButton}>
                    <ThemedText type="smallBold">Profile</ThemedText>
                  </ThemedView>
                </Pressable>
              </ThemedView>

              {dashboardLoading ? (
                <ThemedView style={styles.loadingRow}>
                  <ActivityIndicator color={theme.text} />
                  <ThemedText>Loading your dashboard...</ThemedText>
                </ThemedView>
              ) : null}

              {dashboardError ? <ThemedText themeColor="textSecondary">{dashboardError}</ThemedText> : null}

              {todaySummary ? (
                <ThemedView type="background" style={styles.summaryCard}>
                  <ThemedText type="smallBold">Latest Check-In</ThemedText>
                  {todaySummary.map((item) => (
                    <ThemedText key={item.label}>
                      {item.label}: {item.value}/10
                    </ThemedText>
                  ))}

                  <Pressable
                    onPress={() =>
                      latestCheckin
                        ? router.push({ pathname: '/checkin-detail', params: { id: latestCheckin._id } })
                        : undefined
                    }>
                    <ThemedView style={styles.linkButton}>
                      <ThemedText type="smallBold" themeColor="textSecondary">
                        Open detail
                      </ThemedText>
                    </ThemedView>
                  </Pressable>
                </ThemedView>
              ) : (
                <ThemedText themeColor="textSecondary">
                  No check-ins yet. Start your first check-in now.
                </ThemedText>
              )}

              <Pressable onPress={() => void logout()}>
                <ThemedView type="background" style={styles.secondaryButton}>
                  <ThemedText type="smallBold">Sign Out</ThemedText>
                </ThemedView>
              </Pressable>
            </>
          ) : null}
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    marginTop: Spacing.three,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  encouragementCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  encouragementActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  encouragementActionButton: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  greeting: {
    fontSize: 32,
    lineHeight: 38,
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  modePill: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  secondaryButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  actionButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  grow: {
    flex: 1,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  summaryCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  linkButton: {
    marginTop: Spacing.one,
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
});
