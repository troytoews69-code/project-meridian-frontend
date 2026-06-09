import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getDailyEncouragement, getDayPeriod, getDayPeriodLabel } from '@/constants/encouragement';
import { useAuth } from '@/context/auth-context';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { api, DailyCheckin, ProfileResponse } from '@/services/api';

type AuthMode = 'login' | 'register';

const METRIC_CONFIG = [
  { key: 'mood' as const, label: 'Mood', icon: 'happy-outline' as const, color: '#C97B84' },
  { key: 'sleepQuality' as const, label: 'Sleep', icon: 'moon-outline' as const, color: '#9B7FA8' },
  { key: 'energyLevel' as const, label: 'Energy', icon: 'flash-outline' as const, color: '#6BAE8E' },
  { key: 'symptomSeverity' as const, label: 'Symptoms', icon: 'pulse-outline' as const, color: '#E07B6A' },
];

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
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
  const [encouragementStatus, setEncouragementStatus] = useState<string | null>(null);
  const [isSavingEncouragement, setIsSavingEncouragement] = useState(false);

  const reminderTime = profile?.preferences?.reminderTime ?? '20:00';
  const displayName = profile?.user?.name ?? user?.name;
  const initials = displayName
    ? displayName.trim().split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  const dayPeriod = useMemo(() => getDayPeriod(new Date()), []);
  const encouragementTitle = useMemo(() => `${getDayPeriodLabel(dayPeriod)} Encouragement`, [dayPeriod]);
  const encouragementMessage = useMemo(
    () => getDailyEncouragement({ name: displayName, period: dayPeriod }),
    [displayName, dayPeriod]
  );

  useEffect(() => {
    async function loadDashboard() {
      if (!token || !isAuthenticated) return;
      setDashboardLoading(true);
      try {
        const [profileResponse, checkins] = await Promise.all([
          api.getProfile(token),
          api.getCheckins(token),
        ]);
        setProfile(profileResponse);
        setLatestCheckin(checkins[0] ?? null);
      } catch {
        // silent fail
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
    try {
      await Share.share({ title: encouragementTitle, message: encouragementMessage });
    } catch {
      // ignore
    }
  }

  async function handleSaveEncouragement() {
    if (!isAuthenticated || !token) {
      setEncouragementStatus('Sign in to save this message.');
      return;
    }
    setIsSavingEncouragement(true);
    try {
      await api.createNote(token, {
        title: `Daily Encouragement ${new Date().toISOString().slice(0, 10)}`,
        content: encouragementMessage,
        tags: ['encouragement'],
      });
      setEncouragementStatus('Saved to Notes.');
    } catch {
      setEncouragementStatus('Could not save right now.');
    } finally {
      setIsSavingEncouragement(false);
    }
  }

  if (isLoading) {
    return (
      <ThemedView style={[styles.root, styles.loadingCenter]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.root}>
      {/* ── Colored header ── */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            {isAuthenticated ? (
              <>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.headerTextCol}>
                  <Text style={styles.headerGreeting}>
                    {getDayPeriodLabel(dayPeriod)}, {displayName ?? 'there'} 👋
                  </Text>
                  <Text style={styles.headerSub}>Next reminder at {reminderTime}</Text>
                </View>
              </>
            ) : (
              <View style={styles.headerTextCol}>
                <Text style={styles.headerTitle}>Women Over 40 Health 🌸</Text>
                <Text style={styles.headerSub}>Your private wellness companion</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>

      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          {/* ── Dashboard (authenticated) ── */}
          {isAuthenticated ? (
            <>
              <View style={styles.actionRow}>
                <Pressable style={styles.actionCard} onPress={() => router.push('/checkin')}>
                  <ThemedView type="backgroundElement" style={styles.actionCardInner}>
                    <View style={[styles.actionIconBg, { backgroundColor: colors.primary + '22' }]}>
                      <Ionicons name="clipboard" size={26} color={colors.primary} />
                    </View>
                    <ThemedText type="smallBold" style={styles.actionLabel}>Check-In</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.actionSub}>
                      Log today
                    </ThemedText>
                  </ThemedView>
                </Pressable>

                <Pressable style={styles.actionCard} onPress={() => router.push('/trends')}>
                  <ThemedView type="backgroundElement" style={styles.actionCardInner}>
                    <View style={[styles.actionIconBg, { backgroundColor: '#9B7FA8' + '22' }]}>
                      <Ionicons name="bar-chart" size={26} color="#9B7FA8" />
                    </View>
                    <ThemedText type="smallBold" style={styles.actionLabel}>Trends</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.actionSub}>
                      See patterns
                    </ThemedText>
                  </ThemedView>
                </Pressable>

                <Pressable style={styles.actionCard} onPress={() => router.push('/profile')}>
                  <ThemedView type="backgroundElement" style={styles.actionCardInner}>
                    <View style={[styles.actionIconBg, { backgroundColor: '#6BAE8E' + '22' }]}>
                      <Ionicons name="person" size={26} color="#6BAE8E" />
                    </View>
                    <ThemedText type="smallBold" style={styles.actionLabel}>Profile</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.actionSub}>
                      Settings
                    </ThemedText>
                  </ThemedView>
                </Pressable>
              </View>

              {dashboardLoading ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: Spacing.two }} />
              ) : latestCheckin ? (
                <>
                  <ThemedText type="smallBold" style={styles.sectionLabel}>Latest Check-In</ThemedText>
                  <View style={styles.metricsGrid}>
                    {METRIC_CONFIG.map((m) => {
                      const value = latestCheckin[m.key] as number;
                      return (
                        <Pressable
                          key={m.key}
                          style={styles.metricCard}
                          onPress={() =>
                            router.push({ pathname: '/checkin-detail', params: { id: latestCheckin._id } })
                          }>
                          <ThemedView type="backgroundElement" style={styles.metricCardInner}>
                            <View style={[styles.metricIconBg, { backgroundColor: m.color + '22' }]}>
                              <Ionicons name={m.icon} size={20} color={m.color} />
                            </View>
                            <Text style={[styles.metricValue, { color: m.color }]}>
                              {value}/10
                            </Text>
                            <ThemedText type="small" themeColor="textSecondary">{m.label}</ThemedText>
                            <View style={styles.metricBar}>
                              <View
                                style={[
                                  styles.metricBarFill,
                                  { width: `${(value / 10) * 100}%` as any, backgroundColor: m.color },
                                ]}
                              />
                            </View>
                          </ThemedView>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Pressable
                    onPress={() =>
                      router.push({ pathname: '/checkin-detail', params: { id: latestCheckin._id } })
                    }>
                    <ThemedView type="backgroundElement" style={styles.viewDetailBtn}>
                      <ThemedText type="small" themeColor="textSecondary">
                        View full check-in detail →
                      </ThemedText>
                    </ThemedView>
                  </Pressable>
                </>
              ) : (
                <ThemedView type="backgroundElement" style={styles.emptyCard}>
                  <Ionicons name="clipboard-outline" size={36} color={colors.primary} />
                  <ThemedText type="smallBold" style={{ textAlign: 'center' }}>
                    No check-ins yet
                  </ThemedText>
                  <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }}>
                    Start your first daily check-in to see your wellness dashboard.
                  </ThemedText>
                  <Pressable onPress={() => router.push('/checkin')}>
                    <View style={[styles.primaryBtn, { backgroundColor: colors.primary }]}>
                      <Text style={styles.primaryBtnText}>Start Check-In →</Text>
                    </View>
                  </Pressable>
                </ThemedView>
              )}
            </>
          ) : null}

          {/* ── Auth form (not authenticated) ── */}
          {!isAuthenticated ? (
            <ThemedView type="backgroundElement" style={styles.authCard}>
              <ThemedText type="smallBold" style={styles.authHeading}>
                {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
              </ThemedText>

              <View style={styles.modeRow}>
                <Pressable style={{ flex: 1 }} onPress={() => setMode('login')}>
                  <View
                    style={[
                      styles.modePill,
                      { backgroundColor: mode === 'login' ? colors.primary : colors.background },
                    ]}>
                    <Text
                      style={[
                        styles.modePillText,
                        { color: mode === 'login' ? '#fff' : colors.textSecondary },
                      ]}>
                      Sign In
                    </Text>
                  </View>
                </Pressable>
                <Pressable style={{ flex: 1 }} onPress={() => setMode('register')}>
                  <View
                    style={[
                      styles.modePill,
                      { backgroundColor: mode === 'register' ? colors.primary : colors.background },
                    ]}>
                    <Text
                      style={[
                        styles.modePillText,
                        { color: mode === 'register' ? '#fff' : colors.textSecondary },
                      ]}>
                      Register
                    </Text>
                  </View>
                </Pressable>
              </View>

              {mode === 'register' ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
                  autoCapitalize="words"
                />
              ) : null}

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
                secureTextEntry
              />

              {authError ? (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={16} color="#E07B6A" />
                  <ThemedText type="small" style={{ color: '#E07B6A', flex: 1 }}>
                    {authError}
                  </ThemedText>
                </View>
              ) : null}

              <Pressable onPress={handleAuthSubmit} disabled={authSubmitting}>
                <View
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: colors.primary, opacity: authSubmitting ? 0.7 : 1 },
                  ]}>
                  {authSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>
                      {mode === 'register' ? 'Create My Account' : 'Sign In'}
                    </Text>
                  )}
                </View>
              </Pressable>
            </ThemedView>
          ) : null}

          {/* ── Daily Encouragement ── */}
          <ThemedView type="backgroundElement" style={styles.encouragementCard}>
            <View style={styles.encouragementHeader}>
              <Ionicons name="sparkles" size={16} color={colors.primary} />
              <ThemedText type="smallBold" style={{ color: colors.primary, marginLeft: Spacing.one }}>
                {encouragementTitle}
              </ThemedText>
            </View>
            <ThemedText themeColor="textSecondary" style={styles.encouragementText}>
              {encouragementMessage}
            </ThemedText>
            <View style={styles.encouragementActions}>
              <Pressable
                onPress={() => void handleSaveEncouragement()}
                disabled={isSavingEncouragement}>
                <ThemedView type="backgroundSelected" style={styles.encBtn}>
                  <ThemedText type="small">
                    {isSavingEncouragement ? 'Saving…' : '💾  Save'}
                  </ThemedText>
                </ThemedView>
              </Pressable>
              <Pressable onPress={() => void handleShareEncouragement()}>
                <ThemedView type="background" style={styles.encBtn}>
                  <ThemedText type="small">↗  Share</ThemedText>
                </ThemedView>
              </Pressable>
            </View>
            {encouragementStatus ? (
              <ThemedText type="small" themeColor="textSecondary">
                {encouragementStatus}
              </ThemedText>
            ) : null}
          </ThemedView>

          {isAuthenticated ? (
            <Pressable onPress={() => void logout()} style={styles.signOutBtn}>
              <ThemedText type="small" themeColor="textSecondary">Sign Out</ThemedText>
            </Pressable>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loadingCenter: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
    paddingTop: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerTextCol: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerGreeting: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.82)', fontSize: 12, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: Spacing.two },
  actionCard: { flex: 1 },
  actionCardInner: {
    borderRadius: Spacing.three,
    padding: Spacing.two + 4,
    alignItems: 'center',
    gap: Spacing.one,
  },
  actionIconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  actionLabel: { fontSize: 12, textAlign: 'center' },
  actionSub: { fontSize: 11, textAlign: 'center' },
  sectionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.55,
    marginBottom: -Spacing.one,
  },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  metricCard: { width: '47.5%' },
  metricCardInner: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.one },
  metricIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  metricValue: { fontSize: 22, fontWeight: '700' },
  metricBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    marginTop: Spacing.one,
  },
  metricBarFill: { height: 4, borderRadius: 2 },
  viewDetailBtn: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
  emptyCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  authCard: { borderRadius: Spacing.four, padding: Spacing.four, gap: Spacing.three },
  authHeading: { textAlign: 'center' },
  modeRow: { flexDirection: 'row', gap: Spacing.two },
  modePill: { borderRadius: Spacing.three, paddingVertical: Spacing.two + 2, alignItems: 'center' },
  modePillText: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1.5,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  primaryBtn: {
    borderRadius: Spacing.three,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  encouragementCard: { borderRadius: Spacing.four, padding: Spacing.four, gap: Spacing.two },
  encouragementHeader: { flexDirection: 'row', alignItems: 'center' },
  encouragementText: { lineHeight: 22 },
  encouragementActions: { flexDirection: 'row', gap: Spacing.two },
  encBtn: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  signOutBtn: { alignItems: 'center', paddingVertical: Spacing.two },
});

