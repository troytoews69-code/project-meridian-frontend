import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthRequired } from '@/components/auth-required';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { api, DailyCheckin, PeriodFlow } from '@/services/api';

const PERIOD_OPTIONS: { value: PeriodFlow; label: string; emoji: string }[] = [
  { value: 'none', label: 'None', emoji: '—' },
  { value: 'spotting', label: 'Spotting', emoji: '🔴' },
  { value: 'light', label: 'Light', emoji: '🩸' },
  { value: 'medium', label: 'Medium', emoji: '🩸🩸' },
  { value: 'heavy', label: 'Heavy', emoji: '🩸🩸🩸' },
];

// Simple in-memory draft store (survives re-renders, cleared on submit)
type DraftData = {
  scores: Record<ScoreField, number>;
  activityMinutes: string;
  hydrationCups: string;
  notes: string;
  selectedSymptoms: string[];
};
const draftStore = new Map<string, DraftData>();

type ScoreField = 'mood' | 'sleepQuality' | 'energyLevel' | 'symptomSeverity';

const initialScores: Record<ScoreField, number> = {
  mood: 5,
  sleepQuality: 5,
  energyLevel: 5,
  symptomSeverity: 5,
};

const SYMPTOMS = [
  'Hot flashes',
  'Night sweats',
  'Brain fog',
  'Joint pain',
  'Headache',
  'Fatigue',
  'Anxiety',
  'Mood swings',
  'Bloating',
  'Heart palpitations',
  'Dry skin',
  'Insomnia',
  'Low libido',
  'Vaginal dryness',
  'Weight gain',
];

const DRAFT_KEY = 'checkin_draft';

export default function CheckinScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { isAuthenticated, token } = useAuth();

  const [scores, setScores] = useState(initialScores);
  const [activityMinutes, setActivityMinutes] = useState('0');
  const [hydrationCups, setHydrationCups] = useState('0');
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [periodFlow, setPeriodFlow] = useState<PeriodFlow>('none');
  const [hasDraft, setHasDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [history, setHistory] = useState<DailyCheckin[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadRequestIdRef = useRef(0);
  const isLoadingHistoryRef = useRef(false);

  // Load draft on mount
  useEffect(() => {
    try {
      // Use a module-level map for draft storage (works on both web and native)
      const draft = draftStore.get(DRAFT_KEY);
      if (draft) {
        setScores(draft.scores);
        setActivityMinutes(draft.activityMinutes);
        setHydrationCups(draft.hydrationCups);
        setNotes(draft.notes);
        setSelectedSymptoms(draft.selectedSymptoms ?? []);
        setHasDraft(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    async function loadHistory() {
      if (!token || !isAuthenticated || isLoadingHistoryRef.current) {
        return;
      }

      const requestId = ++loadRequestIdRef.current;
      isLoadingHistoryRef.current = true;
      setIsLoadingHistory(true);

      try {
        const checkins = await api.getCheckins(token);
        if (requestId === loadRequestIdRef.current) {
          setHistory(checkins);
        }
      } catch (error) {
        if (requestId === loadRequestIdRef.current) {
          setErrorMessage(error instanceof Error ? error.message : 'Failed to load history');
        }
      } finally {
        if (requestId === loadRequestIdRef.current) {
          setIsLoadingHistory(false);
        }
        isLoadingHistoryRef.current = false;
      }
    }

    void loadHistory();
  }, [token, isAuthenticated]);

  const authToken = token ?? '';

  function setScore(field: ScoreField, value: number) {
    setScores((current) => ({ ...current, [field]: value }));
  }

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((s) => s !== symptom)
        : [...current, symptom]
    );
  }

  function saveDraft() {
    draftStore.set(DRAFT_KEY, { scores, activityMinutes, hydrationCups, notes, selectedSymptoms });
    setHasDraft(true);
    setStatusMessage('Draft saved.');
    setTimeout(() => setStatusMessage(null), 2000);
  }

  function clearDraft() {
    draftStore.delete(DRAFT_KEY);
    setHasDraft(false);
    setScores(initialScores);
    setActivityMinutes('0');
    setHydrationCups('0');
    setNotes('');
    setSelectedSymptoms([]);
  }

  const recentHistory = useMemo(() => history.slice(0, 8), [history]);
  const openCheckinDetail = useCallback(
    (id: string) => {
      router.push({ pathname: '/checkin-detail', params: { id } });
    },
    [router]
  );

  if (!isAuthenticated || !token) {
    return <AuthRequired title="Daily Check-In" />;
  }

  async function submitCheckin() {
    setStatusMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    const symptomNote = selectedSymptoms.length > 0
      ? `Symptoms: ${selectedSymptoms.join(', ')}${notes ? '\n' + notes : ''}`
      : notes;

    try {
      await api.upsertCheckin(authToken, {
        mood: scores.mood,
        sleepQuality: scores.sleepQuality,
        energyLevel: scores.energyLevel,
        symptomSeverity: scores.symptomSeverity,
        activityMinutes: Number(activityMinutes) || 0,
        hydrationCups: Number(hydrationCups) || 0,
        notes: symptomNote,
        periodFlow,
      });

      draftStore.delete(DRAFT_KEY);
      setHasDraft(false);
      setStatusMessage('Check-in saved successfully.');

      const checkins = await api.getCheckins(authToken);
      setHistory(checkins);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save check-in');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.root}>
      <View style={[styles.screenHeader, { backgroundColor: colors.primary }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.screenHeaderContent}>
            <Ionicons name="clipboard" size={22} color="#fff" />
            <Text style={styles.screenHeaderTitle}>Daily Check-In</Text>
          </View>
          <Text style={styles.screenHeaderSub}>Capture today's wellness in under 2 minutes</Text>
        </SafeAreaView>
      </View>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView type="backgroundElement" style={styles.card}>

            {hasDraft ? (
              <ThemedView type="background" style={styles.draftBanner}>
                <ThemedText type="small" themeColor="textSecondary">Draft restored. Continue or clear it.</ThemedText>
                <Pressable onPress={clearDraft}>
                  <ThemedText type="small" themeColor="textSecondary">Clear draft</ThemedText>
                </Pressable>
              </ThemedView>
            ) : null}

            <ScorePicker
              label="Mood"
              value={scores.mood}
              onChange={(value) => setScore('mood', value)}
            />
            <ScorePicker
              label="Sleep Quality"
              value={scores.sleepQuality}
              onChange={(value) => setScore('sleepQuality', value)}
            />
            <ScorePicker
              label="Energy"
              value={scores.energyLevel}
              onChange={(value) => setScore('energyLevel', value)}
            />
            <ScorePicker
              label="Symptom Severity"
              value={scores.symptomSeverity}
              onChange={(value) => setScore('symptomSeverity', value)}
            />

            <ThemedText type="smallBold">Symptoms today (tap to select)</ThemedText>
            <View style={styles.symptomsGrid}>
              {SYMPTOMS.map((symptom) => (
                <Pressable key={symptom} onPress={() => toggleSymptom(symptom)}>
                  <ThemedView
                    type={selectedSymptoms.includes(symptom) ? 'backgroundSelected' : 'background'}
                    style={styles.symptomChip}>
                    <ThemedText type="small">{symptom}</ThemedText>
                  </ThemedView>
                </Pressable>
              ))}
            </View>

            <View style={styles.row}>
              <View style={styles.grow}>
                <ThemedText type="smallBold">Activity (min)</ThemedText>
                <TextInput
                  value={activityMinutes}
                  onChangeText={setActivityMinutes}
                  keyboardType="numeric"
                  style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
                />
              </View>
              <View style={styles.grow}>
                <ThemedText type="smallBold">Hydration (cups)</ThemedText>
                <TextInput
                  value={hydrationCups}
                  onChangeText={setHydrationCups}
                  keyboardType="numeric"
                  style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
                />
              </View>
            </View>

            <ThemedText type="smallBold">Period Flow</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Track your cycle alongside symptoms — helps identify patterns.
            </ThemedText>
            <View style={styles.periodRow}>
              {PERIOD_OPTIONS.map((opt) => (
                <Pressable key={opt.value} onPress={() => setPeriodFlow(opt.value)} style={styles.periodItem}>
                  <ThemedView
                    type={periodFlow === opt.value ? 'backgroundSelected' : 'background'}
                    style={[
                      styles.periodChip,
                      periodFlow === opt.value && { borderColor: colors.primary, borderWidth: 1.5 },
                    ]}>
                    <Text style={styles.periodEmoji}>{opt.emoji}</Text>
                    <ThemedText type="small" style={{ fontSize: 11 }}>{opt.label}</ThemedText>
                  </ThemedView>
                </Pressable>
              ))}
            </View>

            <ThemedText type="smallBold">Notes</ThemedText>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Optional notes for today"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, styles.notesInput, { color: colors.text, borderColor: colors.backgroundSelected }]}
            />

            {errorMessage ? <ThemedText themeColor="textSecondary">{errorMessage}</ThemedText> : null}
            {statusMessage ? <ThemedText>{statusMessage}</ThemedText> : null}

            <View style={styles.row}>
              <Pressable style={styles.grow} onPress={saveDraft} disabled={isSubmitting}>
                <ThemedView type="background" style={styles.submitButton}>
                  <ThemedText type="smallBold">Save Draft</ThemedText>
                </ThemedView>
              </Pressable>
              <Pressable style={styles.grow} onPress={submitCheckin} disabled={isSubmitting}>
                <ThemedView type="backgroundSelected" style={styles.submitButton}>
                  {isSubmitting ? (
                    <ActivityIndicator color={colors.text} />
                  ) : (
                    <ThemedText type="smallBold">Save Check-In</ThemedText>
                  )}
                </ThemedView>
              </Pressable>
            </View>

            <ThemedText type="smallBold">Recent Check-Ins</ThemedText>

            {isLoadingHistory ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <ThemedText>Loading history...</ThemedText>
              </View>
            ) : null}

            {!isLoadingHistory && history.length === 0 ? (
              <ThemedText themeColor="textSecondary">
                No previous entries yet. Save a check-in to build your history.
              </ThemedText>
            ) : null}

            {recentHistory.map((item) => (
              <HistoryRow key={item._id} item={item} onPress={openCheckinDetail} />
            ))}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const HistoryRow = React.memo(function HistoryRow({
  item,
  onPress,
}: {
  item: DailyCheckin;
  onPress: (id: string) => void;
}) {
  return (
    <Pressable onPress={() => onPress(item._id)}>
      <ThemedView type="background" style={styles.historyCard}>
        <ThemedText type="smallBold">{new Date(item.checkinDate).toDateString()}</ThemedText>
        <ThemedText>
          Mood {item.mood}/10 | Sleep {item.sleepQuality}/10 | Energy {item.energyLevel}/10
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
});

function ScorePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (nextValue: number) => void;
}) {
  return (
    <View style={styles.scoreSection}>
      <ThemedText type="smallBold">
        {label}: {value}/10
      </ThemedText>
      <View style={styles.scoreRow}>
        {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
          <Pressable key={`${label}-${score}`} onPress={() => onChange(score)}>
            <ThemedView
              type={score <= value ? 'backgroundSelected' : 'background'}
              style={styles.scoreChip}>
              <ThemedText type="code">{score}</ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </View>
    </View>
  );
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
  periodRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    flexWrap: 'wrap',
  },
  periodItem: { flex: 1, minWidth: 58 },
  periodChip: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  periodEmoji: { fontSize: 16 },
  scrollContent: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  scoreSection: {
    gap: Spacing.two,
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  scoreChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  symptomChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  draftBanner: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  grow: {
    flex: 1,
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  historyCard: {
    borderRadius: Spacing.three,
    padding: Spacing.two,
    gap: Spacing.one,
  },
});


