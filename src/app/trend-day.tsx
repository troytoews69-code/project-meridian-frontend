import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthRequired } from '@/components/auth-required';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function TrendDayScreen() {
  const params = useLocalSearchParams<{
    day?: string;
    mood?: string;
    sleep?: string;
    energy?: string;
    symptoms?: string;
  }>();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthRequired title="Trend Day Detail" />;
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">Trend Day Detail</ThemedText>

            {params.day ? (
              <ThemedView type="background" style={styles.detailCard}>
                <ThemedText type="smallBold">Date: {params.day}</ThemedText>
                <ThemedText>Mood avg: {params.mood ?? '-'}</ThemedText>
                <ThemedText>Sleep avg: {params.sleep ?? '-'}</ThemedText>
                <ThemedText>Energy avg: {params.energy ?? '-'}</ThemedText>
                <ThemedText>Symptoms avg: {params.symptoms ?? '-'}</ThemedText>
              </ThemedView>
            ) : (
              <ThemedText themeColor="textSecondary">
                No trend day selected. Open this screen by tapping a day in Trends.
              </ThemedText>
            )}
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
});
