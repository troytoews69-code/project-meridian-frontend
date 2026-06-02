import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthRequired } from '@/components/auth-required';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { api, TrendSummary } from '@/services/api';

export default function TrendsScreen() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [days, setDays] = useState<7 | 30>(7);
  const [summary, setSummary] = useState<TrendSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadRequestIdRef = useRef(0);
  const isLoadingTrendsRef = useRef(false);

  useEffect(() => {
    async function loadTrends() {
      if (!token || !isAuthenticated || isLoadingTrendsRef.current) {
        return;
      }

      const requestId = ++loadRequestIdRef.current;
      isLoadingTrendsRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.getTrendSummary(token, days);
        if (requestId === loadRequestIdRef.current) {
          setSummary(response);
        }
      } catch (requestError) {
        if (requestId === loadRequestIdRef.current) {
          setError(requestError instanceof Error ? requestError.message : 'Failed to load trends');
        }
      } finally {
        if (requestId === loadRequestIdRef.current) {
          setIsLoading(false);
        }
        isLoadingTrendsRef.current = false;
      }
    }

    void loadTrends();
  }, [token, isAuthenticated, days]);

  const latestDays = useMemo(() => summary?.daily.slice(-7).reverse() ?? [], [summary]);
  const openTrendDay = useCallback(
    (day: TrendSummary['daily'][number]) => {
      router.push({
        pathname: '/trend-day',
        params: {
          day: day._id,
          mood: formatAvg(day.avgMood),
          sleep: formatAvg(day.avgSleepQuality),
          energy: formatAvg(day.avgEnergyLevel),
          symptoms: formatAvg(day.avgSymptomSeverity),
        },
      });
    },
    [router]
  );

  if (!isAuthenticated || !token) {
    return <AuthRequired title="Trends" />;
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">Trends</ThemedText>
            <ThemedText themeColor="textSecondary">
              Review your progress over {days} days and identify patterns.
            </ThemedText>

            <View style={styles.toggleRow}>
              <Pressable style={styles.grow} onPress={() => setDays(7)}>
                <ThemedView type={days === 7 ? 'backgroundSelected' : 'background'} style={styles.toggleButton}>
                  <ThemedText type="smallBold">Week</ThemedText>
                </ThemedView>
              </Pressable>
              <Pressable style={styles.grow} onPress={() => setDays(30)}>
                <ThemedView
                  type={days === 30 ? 'backgroundSelected' : 'background'}
                  style={styles.toggleButton}>
                  <ThemedText type="smallBold">Month</ThemedText>
                </ThemedView>
              </Pressable>
            </View>

            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <ThemedText>Loading trends...</ThemedText>
              </View>
            ) : null}

            {error ? <ThemedText themeColor="textSecondary">{error}</ThemedText> : null}

            {!isLoading && !error && summary ? (
              <>
                <ThemedView type="background" style={styles.overallCard}>
                  <ThemedText type="smallBold">Overall Summary</ThemedText>
                  <ThemedText>Total check-ins: {summary.overall.totalCheckins ?? 0}</ThemedText>
                  <ThemedText>Mood avg: {formatAvg(summary.overall.avgMood)}</ThemedText>
                  <ThemedText>Sleep avg: {formatAvg(summary.overall.avgSleepQuality)}</ThemedText>
                  <ThemedText>Energy avg: {formatAvg(summary.overall.avgEnergyLevel)}</ThemedText>
                  <ThemedText>Symptoms avg: {formatAvg(summary.overall.avgSymptomSeverity)}</ThemedText>
                </ThemedView>

                {summary.daily.length === 0 ? (
                  <ThemedText themeColor="textSecondary">
                    No trend data yet. Complete a check-in to start building your trend history.
                  </ThemedText>
                ) : (
                  <ThemedView style={styles.dailyList}>
                    <ThemedText type="smallBold">Recent Days</ThemedText>
                    {latestDays.map((day) => (
                      <TrendDayRow key={day._id} day={day} onPress={openTrendDay} />
                    ))}
                  </ThemedView>
                )}
              </>
            ) : null}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const TrendDayRow = React.memo(function TrendDayRow({
  day,
  onPress,
}: {
  day: TrendSummary['daily'][number];
  onPress: (day: TrendSummary['daily'][number]) => void;
}) {
  return (
    <Pressable onPress={() => onPress(day)}>
      <ThemedView type="background" style={styles.dayRow}>
        <ThemedText type="smallBold">{day._id}</ThemedText>
        <ThemedText>Mood {formatAvg(day.avgMood)}</ThemedText>
        <ThemedText>Sleep {formatAvg(day.avgSleepQuality)}</ThemedText>
        <ThemedText>Energy {formatAvg(day.avgEnergyLevel)}</ThemedText>
      </ThemedView>
    </Pressable>
  );
});

function formatAvg(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '-';
  }

  return value.toFixed(1);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  grow: {
    flex: 1,
  },
  toggleButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  overallCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  dailyList: {
    gap: Spacing.two,
  },
  dayRow: {
    borderRadius: Spacing.three,
    padding: Spacing.two,
    gap: Spacing.one,
  },
});
