import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthRequired } from '@/components/auth-required';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { api, DailyCheckin } from '@/services/api';

export default function CheckinDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { isAuthenticated, token } = useAuth();

  const [checkin, setCheckin] = useState<DailyCheckin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!token || !isAuthenticated || !id) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.getCheckinById(token, id);
        setCheckin(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load check-in detail');
      } finally {
        setIsLoading(false);
      }
    }

    void loadDetail();
  }, [token, isAuthenticated, id]);

  if (!isAuthenticated || !token) {
    return <AuthRequired title="Check-In Detail" />;
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">Check-In Detail</ThemedText>

            {!id ? <ThemedText themeColor="textSecondary">Missing check-in ID.</ThemedText> : null}

            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <ThemedText>Loading detail...</ThemedText>
              </View>
            ) : null}

            {error ? <ThemedText themeColor="textSecondary">{error}</ThemedText> : null}

            {checkin ? (
              <ThemedView type="background" style={styles.detailCard}>
                <ThemedText type="smallBold">Date: {new Date(checkin.checkinDate).toDateString()}</ThemedText>
                <ThemedText>Mood: {checkin.mood}/10</ThemedText>
                <ThemedText>Sleep: {checkin.sleepQuality}/10</ThemedText>
                <ThemedText>Energy: {checkin.energyLevel}/10</ThemedText>
                <ThemedText>Symptoms: {checkin.symptomSeverity}/10</ThemedText>
                <ThemedText>Activity: {checkin.activityMinutes} min</ThemedText>
                <ThemedText>Hydration: {checkin.hydrationCups} cups</ThemedText>
                <ThemedText>Notes: {checkin.notes || 'No notes'}</ThemedText>
              </ThemedView>
            ) : null}
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
  detailCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
