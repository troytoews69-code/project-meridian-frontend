import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthRequired } from '@/components/auth-required';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { api, TrendSummary } from '@/services/api';

// ─── Insight bullet generator ────────────────────────────────────────────────
function generateInsights(summary: TrendSummary): string[] {
  const insights: string[] = [];
  const o = summary.overall;

  if ((o.totalCheckins ?? 0) === 0) return insights;

  if (typeof o.avgMood === 'number') {
    if (o.avgMood >= 7) insights.push(`Your mood has been strong — averaging ${o.avgMood.toFixed(1)}/10. Keep it up.`);
    else if (o.avgMood <= 4) insights.push(`Mood has been low at ${o.avgMood.toFixed(1)}/10. Consider noting patterns around sleep or activity.`);
    else insights.push(`Mood is steady at ${o.avgMood.toFixed(1)}/10.`);
  }

  if (typeof o.avgSleepQuality === 'number') {
    if (o.avgSleepQuality >= 7) insights.push(`Sleep quality is solid — averaging ${o.avgSleepQuality.toFixed(1)}/10.`);
    else if (o.avgSleepQuality <= 4) insights.push(`Sleep quality is low at ${o.avgSleepQuality.toFixed(1)}/10. This can affect mood and energy — worth discussing with your doctor.`);
    else insights.push(`Sleep quality is moderate at ${o.avgSleepQuality.toFixed(1)}/10.`);
  }

  if (typeof o.avgEnergyLevel === 'number') {
    if (o.avgEnergyLevel >= 7) insights.push(`Energy is high at ${o.avgEnergyLevel.toFixed(1)}/10.`);
    else if (o.avgEnergyLevel <= 4) insights.push(`Energy has been low at ${o.avgEnergyLevel.toFixed(1)}/10. Hydration and activity levels may help.`);
  }

  if (typeof o.avgSymptomSeverity === 'number' && o.avgSymptomSeverity >= 6) {
    insights.push(`Symptom severity is elevated at ${o.avgSymptomSeverity.toFixed(1)}/10. Bring this data to your next appointment.`);
  }

  if (typeof o.avgHydrationCups === 'number' && o.avgHydrationCups < 6) {
    insights.push(`Average hydration is ${o.avgHydrationCups.toFixed(1)} cups/day — below the recommended 8. Small increases can improve energy and mood.`);
  }

  if (typeof o.avgActivityMinutes === 'number') {
    if (o.avgActivityMinutes >= 30) insights.push(`Activity is consistent at ${o.avgActivityMinutes.toFixed(0)} min/day on average.`);
    else if (o.avgActivityMinutes < 15) insights.push(`Activity is low at ${o.avgActivityMinutes.toFixed(0)} min/day. Even short walks can help symptoms.`);
  }

  return insights;
}

// ─── Simple bar chart ─────────────────────────────────────────────────────────
function MiniBar({ value, max = 10, color }: { value?: number; max?: number; color: string }) {
  const pct = typeof value === 'number' ? Math.min(value / max, 1) : 0;
  return (
    <View style={barStyles.track}>
      <View style={[barStyles.fill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.08)', overflow: 'hidden', flex: 1 },
  fill: { height: 6, borderRadius: 3 },
});

const METRIC_COLORS = { mood: '#C97B84', sleep: '#9B7FA8', energy: '#6BAE8E', symptoms: '#E07B6A' };

export default function TrendsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
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
  const insights = useMemo(() => (summary ? generateInsights(summary) : []), [summary]);

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

  async function handleShareSummary() {
    if (!summary) return;
    const o = summary.overall;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const reportLines = [
      '═══════════════════════════════════',
      '  PERSONAL HEALTH SUMMARY REPORT',
      `  Generated: ${today}`,
      '═══════════════════════════════════',
      '',
      `PERIOD: ${summary.range.from} → ${summary.range.to} (${days} days)`,
      `TOTAL CHECK-INS: ${o.totalCheckins}`,
      '',
      '─── AVERAGE SCORES (out of 10) ───',
      `  Mood:               ${formatAvg(o.avgMood)}/10`,
      `  Sleep Quality:      ${formatAvg(o.avgSleepQuality)}/10`,
      `  Energy Level:       ${formatAvg(o.avgEnergyLevel)}/10`,
      `  Symptom Severity:   ${formatAvg(o.avgSymptomSeverity)}/10`,
      '',
      '─── LIFESTYLE METRICS ───',
      `  Avg Hydration:      ${formatAvg(o.avgHydrationCups)} cups/day`,
      `  Avg Activity:       ${formatAvg(o.avgActivityMinutes)} min/day`,
      '',
    ];
    if (insights.length > 0) {
      reportLines.push('─── INSIGHTS & PATTERNS ───');
      insights.forEach((insight) => reportLines.push(`  • ${insight}`));
      reportLines.push('');
    }
    if (summary.daily.length > 0) {
      reportLines.push('─── DAILY BREAKDOWN ───');
      summary.daily.slice(-14).reverse().forEach((day) => {
        reportLines.push(
          `  ${day._id}  Mood:${formatAvg(day.avgMood)}  Sleep:${formatAvg(day.avgSleepQuality)}  Energy:${formatAvg(day.avgEnergyLevel)}  Symptoms:${formatAvg(day.avgSymptomSeverity)}`
        );
      });
      reportLines.push('');
    }
    reportLines.push('─────────────────────────────────────');
    reportLines.push('  Generated by Women Over 40 Health App');
    reportLines.push('  Please share with your healthcare provider.');
    reportLines.push('═══════════════════════════════════');

    await Share.share({
      title: `Health Summary — ${days}-Day Report`,
      message: reportLines.join('\n'),
    });
  }

  if (!isAuthenticated || !token) {
    return <AuthRequired title="Trends" />;
  }

  return (
    <ThemedView style={styles.root}>
      <View style={[styles.screenHeader, { backgroundColor: '#9B7FA8' }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.screenHeaderContent}>
            <Ionicons name="bar-chart" size={22} color="#fff" />
            <Text style={styles.screenHeaderTitle}>Trends</Text>
          </View>
          <Text style={styles.screenHeaderSub}>Review your patterns over time</Text>
        </SafeAreaView>
      </View>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView type="backgroundElement" style={styles.card}>

            <View style={styles.toggleRow}>
              <Pressable style={styles.grow} onPress={() => setDays(7)}>
                <ThemedView type={days === 7 ? 'backgroundSelected' : 'background'} style={styles.toggleButton}>
                  <ThemedText type="smallBold">7 Days</ThemedText>
                </ThemedView>
              </Pressable>
              <Pressable style={styles.grow} onPress={() => setDays(30)}>
                <ThemedView type={days === 30 ? 'backgroundSelected' : 'background'} style={styles.toggleButton}>
                  <ThemedText type="smallBold">30 Days</ThemedText>
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
                {/* ── Overall metric bars ── */}
                <ThemedView type="background" style={styles.overallCard}>
                  <ThemedText type="smallBold">Overall — {summary.overall.totalCheckins} check-ins</ThemedText>

                  {([
                    { label: 'Mood', value: summary.overall.avgMood, color: METRIC_COLORS.mood },
                    { label: 'Sleep', value: summary.overall.avgSleepQuality, color: METRIC_COLORS.sleep },
                    { label: 'Energy', value: summary.overall.avgEnergyLevel, color: METRIC_COLORS.energy },
                    { label: 'Symptoms', value: summary.overall.avgSymptomSeverity, color: METRIC_COLORS.symptoms },
                  ] as const).map(({ label, value, color }) => (
                    <View key={label} style={styles.metricRow}>
                      <ThemedText type="small" style={styles.metricLabel}>{label}</ThemedText>
                      <MiniBar value={value} color={color} />
                      <ThemedText type="small" style={styles.metricValue}>{formatAvg(value)}</ThemedText>
                    </View>
                  ))}
                </ThemedView>

                {/* ── Insight bullets ── */}
                {insights.length > 0 ? (
                  <ThemedView type="background" style={styles.insightsCard}>
                    <ThemedText type="smallBold">Insights</ThemedText>
                    {insights.map((insight, i) => (
                      <View key={i} style={styles.insightRow}>
                        <ThemedText type="small" themeColor="textSecondary">•</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary" style={styles.insightText}>{insight}</ThemedText>
                      </View>
                    ))}
                  </ThemedView>
                ) : null}

                {/* ── Daily bar chart ── */}
                {summary.daily.length === 0 ? (
                  <ThemedText themeColor="textSecondary">
                    No trend data yet. Complete a check-in to start building your trend history.
                  </ThemedText>
                ) : (
                  <ThemedView style={styles.dailyList}>
                    <ThemedText type="smallBold">Daily View</ThemedText>
                    {latestDays.map((day) => (
                      <TrendDayRow key={day._id} day={day} onPress={openTrendDay} />
                    ))}
                  </ThemedView>
                )}

                {/* ── Share button ── */}
                <Pressable onPress={() => void handleShareSummary()}>
                  <View style={[styles.doctorReportBtn, { backgroundColor: '#9B7FA8' }]}>
                    <Ionicons name="document-text-outline" size={18} color="#fff" />
                    <Text style={styles.doctorReportBtnText}>Generate Doctor Report</Text>
                  </View>
                </Pressable>
              </>
            ) : null}

            {!isLoading && !error && !summary ? (
              <ThemedText themeColor="textSecondary">
                No data yet. Complete your first check-in to see trends.
              </ThemedText>
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
        <ThemedText type="smallBold" style={styles.dayLabel}>{day._id}</ThemedText>
        <View style={styles.dayBars}>
          <View style={styles.barRow}>
            <ThemedText type="small" style={styles.barLabel}>M</ThemedText>
            <MiniBar value={day.avgMood} color={METRIC_COLORS.mood} />
            <ThemedText type="small" style={styles.barValue}>{formatAvg(day.avgMood)}</ThemedText>
          </View>
          <View style={styles.barRow}>
            <ThemedText type="small" style={styles.barLabel}>S</ThemedText>
            <MiniBar value={day.avgSleepQuality} color={METRIC_COLORS.sleep} />
            <ThemedText type="small" style={styles.barValue}>{formatAvg(day.avgSleepQuality)}</ThemedText>
          </View>
          <View style={styles.barRow}>
            <ThemedText type="small" style={styles.barLabel}>E</ThemedText>
            <MiniBar value={day.avgEnergyLevel} color={METRIC_COLORS.energy} />
            <ThemedText type="small" style={styles.barValue}>{formatAvg(day.avgEnergyLevel)}</ThemedText>
          </View>
        </View>
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
  doctorReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    borderRadius: Spacing.three,
    paddingVertical: 14,
  },
  doctorReportBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  scrollContent: { paddingTop: Spacing.three, paddingBottom: Spacing.four },
  card: { borderRadius: Spacing.four, padding: Spacing.four, gap: Spacing.three },
  toggleRow: { flexDirection: 'row', gap: Spacing.two },
  grow: { flex: 1 },
  toggleButton: { borderRadius: Spacing.three, paddingVertical: Spacing.two, alignItems: 'center' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  overallCard: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.two },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  metricLabel: { width: 64 },
  metricValue: { width: 28, textAlign: 'right' },
  insightsCard: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.two },
  insightRow: { flexDirection: 'row', gap: Spacing.one },
  insightText: { flex: 1 },
  dailyList: { gap: Spacing.two },
  dayRow: { borderRadius: Spacing.three, padding: Spacing.two, gap: Spacing.one },
  dayLabel: { marginBottom: Spacing.one },
  dayBars: { gap: Spacing.one },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  barLabel: { width: 14 },
  barValue: { width: 28, textAlign: 'right' },
  shareButton: { borderRadius: Spacing.three, paddingVertical: Spacing.two, alignItems: 'center' },
});
