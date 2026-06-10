import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthRequired } from '@/components/auth-required';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { api, ProfileResponse } from '@/services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { isAuthenticated, token } = useAuth();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
        setProfile(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [token, isAuthenticated]);

  if (!isAuthenticated || !token) {
    return <AuthRequired title="Profile" />;
  }

  return (
    <ThemedView style={styles.root}>
      <View style={[styles.screenHeader, { backgroundColor: '#6BAE8E' }]}>
        <View>
          <View style={styles.profileHeaderContent}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {profile?.user?.name
                  ? profile.user.name.trim().split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
                  : '?'}
              </Text>
            </View>
            <View style={styles.profileHeaderTextCol}>
              <Text style={styles.screenHeaderTitle}>{profile?.user?.name ?? 'Profile'}</Text>
              <Text style={styles.screenHeaderSub}>{profile?.user?.email ?? ''}</Text>
            </View>
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="person-circle-outline" size={20} color="#6BAE8E" />
              <ThemedText type="smallBold" style={{ color: '#6BAE8E' }}>Account Details</ThemedText>
            </View>

            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <ThemedText>Loading profile...</ThemedText>
              </View>
            ) : null}

            {error ? <ThemedText themeColor="textSecondary">{error}</ThemedText> : null}

            {profile ? (
              <ThemedView type="background" style={styles.detailCard}>
                <ThemedText type="smallBold">Name: {profile.user.name}</ThemedText>
                <ThemedText>Email: {profile.user.email}</ThemedText>
                <ThemedText>Menopause stage: {profile.user.menopauseStage || 'Not set'}</ThemedText>
                <ThemedText>Reminder time: {profile.preferences?.reminderTime || '20:00'}</ThemedText>
                <ThemedText>
                  Notifications: {profile.preferences?.notificationsEnabled ? 'Enabled' : 'Disabled'}
                </ThemedText>
                <ThemedText>Units: {profile.preferences?.units || 'metric'}</ThemedText>
              </ThemedView>
            ) : null}

            <Pressable onPress={() => router.push('/profile-edit')}>
              <ThemedView type="backgroundSelected" style={styles.button}>
                <ThemedText type="smallBold">Edit Profile and Preferences</ThemedText>
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
  screenHeader: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  profileHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  profileHeaderTextCol: { flex: 1 },
  screenHeaderTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  screenHeaderSub: { color: 'rgba(255,255,255,0.82)', fontSize: 12, marginTop: 2 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
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
  detailCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
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

