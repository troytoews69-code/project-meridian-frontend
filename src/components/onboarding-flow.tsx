import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';

const ONBOARDING_KEY = 'onboarding_v1_complete';

const STAGES = [
  { id: 'perimenopause', label: 'Perimenopause', desc: 'Irregular periods, early symptoms beginning', emoji: '🌱' },
  { id: 'menopause', label: 'Menopause', desc: '12 months without a period', emoji: '🌸' },
  { id: 'postmenopause', label: 'Post-menopause', desc: 'More than a year since last period', emoji: '🌺' },
  { id: 'unsure', label: 'Not sure yet', desc: "I'm still figuring it out", emoji: '🤔' },
];

const TOP_SYMPTOMS = [
  { id: 'hotFlashes', label: 'Hot flashes', emoji: '🌡️' },
  { id: 'nightSweats', label: 'Night sweats', emoji: '💦' },
  { id: 'brainFog', label: 'Brain fog', emoji: '🧠' },
  { id: 'sleepProblems', label: 'Sleep problems', emoji: '😴' },
  { id: 'moodChanges', label: 'Mood changes', emoji: '😔' },
  { id: 'fatigue', label: 'Fatigue', emoji: '⚡' },
  { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { id: 'jointPain', label: 'Joint pain', emoji: '🦴' },
  { id: 'weightGain', label: 'Weight changes', emoji: '⚖️' },
  { id: 'lowLibido', label: 'Low libido', emoji: '💔' },
];

type Props = {
  onComplete: () => void;
};

export default function OnboardingFlow({ onComplete }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [step, setStep] = useState(0);
  const [stage, setStage] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const TOTAL_STEPS = 3;

  function toggleSymptom(id: string) {
    setSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function finish() {
    setIsSaving(true);
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    } catch {
      // continue even if storage write fails
    } finally {
      setIsSaving(false);
      onComplete();
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Progress dots */}
        <View style={styles.progressRow}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                { backgroundColor: i <= step ? colors.primary : colors.backgroundSelected },
              ]}
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ── Step 0: Welcome ── */}
          {step === 0 ? (
            <View style={styles.stepContent}>
              <View style={[styles.heroCircle, { backgroundColor: colors.primary + '22' }]}>
                <Text style={styles.heroEmoji}>🌸</Text>
              </View>

              <Text style={[styles.title, { color: colors.text }]}>
                Welcome to{'\n'}Women Over 40 Health
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Your private daily wellness companion — built specifically for women navigating perimenopause and menopause.
              </Text>

              <View style={styles.featureList}>
                {([
                  { icon: 'clipboard-outline' as const, text: 'Daily symptom check-ins in under 2 minutes' },
                  { icon: 'bar-chart-outline' as const, text: 'Trend charts to spot what\'s improving' },
                  { icon: 'document-text-outline' as const, text: 'Doctor-ready reports you can share' },
                  { icon: 'book-outline' as const, text: 'Evidence-based guides on every symptom' },
                  { icon: 'lock-closed-outline' as const, text: 'Your data is private — it never gets sold' },
                ] as const).map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <View style={[styles.featureIconBg, { backgroundColor: colors.primary + '20' }]}>
                      <Ionicons name={f.icon} size={18} color={colors.primary} />
                    </View>
                    <Text style={[styles.featureText, { color: colors.text }]}>{f.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* ── Step 1: Menopause Stage ── */}
          {step === 1 ? (
            <View style={styles.stepContent}>
              <Text style={[styles.title, { color: colors.text }]}>
                Where are you{'\n'}in your journey?
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                This personalizes your content and insights. You can change it any time in your profile.
              </Text>

              <View style={styles.stageList}>
                {STAGES.map((s) => {
                  const selected = stage === s.id;
                  return (
                    <Pressable key={s.id} onPress={() => setStage(s.id)}>
                      <View
                        style={[
                          styles.stageCard,
                          {
                            backgroundColor: selected ? colors.primary + '18' : colors.backgroundElement,
                            borderColor: selected ? colors.primary : 'transparent',
                            borderWidth: 2,
                          },
                        ]}>
                        <Text style={styles.stageEmoji}>{s.emoji}</Text>
                        <View style={styles.stageTextBlock}>
                          <Text style={[styles.stageName, { color: colors.text }]}>{s.label}</Text>
                          <Text style={[styles.stageDesc, { color: colors.textSecondary }]}>{s.desc}</Text>
                        </View>
                        {selected ? (
                          <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                        ) : (
                          <View style={[styles.emptyCircle, { borderColor: colors.backgroundSelected }]} />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {/* ── Step 2: Top Symptoms ── */}
          {step === 2 ? (
            <View style={styles.stepContent}>
              <Text style={[styles.title, { color: colors.text }]}>
                What are your{'\n'}main symptoms?
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Select all that apply. Your daily check-ins will track these. You can update them anytime.
              </Text>

              <View style={styles.symptomsGrid}>
                {TOP_SYMPTOMS.map((s) => {
                  const selected = symptoms.includes(s.id);
                  return (
                    <Pressable key={s.id} onPress={() => toggleSymptom(s.id)} style={styles.symptomItem}>
                      <View
                        style={[
                          styles.symptomChip,
                          {
                            backgroundColor: selected ? colors.primary + '18' : colors.backgroundElement,
                            borderColor: selected ? colors.primary : 'transparent',
                            borderWidth: 2,
                          },
                        ]}>
                        <Text style={styles.symptomEmoji}>{s.emoji}</Text>
                        <Text style={[styles.symptomLabel, { color: colors.text }]}>{s.label}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.skipHint, { color: colors.textSecondary }]}>
                Not sure yet? That's fine — tap "Get Started" and you can always add more later.
              </Text>
            </View>
          ) : null}
        </ScrollView>

        {/* Navigation buttons */}
        <View style={[styles.navRow, { backgroundColor: colors.background, borderTopColor: colors.backgroundSelected }]}>
          {step > 0 ? (
            <Pressable
              onPress={() => setStep((s) => s - 1)}
              style={[styles.backBtn, { borderColor: colors.backgroundSelected }]}>
              <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>← Back</Text>
            </Pressable>
          ) : (
            <View style={styles.backBtn} />
          )}

          {step < TOTAL_STEPS - 1 ? (
            <Pressable
              onPress={() => setStep((s) => s + 1)}
              style={[styles.nextBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.nextBtnText}>Continue →</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={finish}
              disabled={isSaving}
              style={[styles.nextBtn, { backgroundColor: colors.primary, opacity: isSaving ? 0.7 : 1 }]}>
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.nextBtnText}>Get Started 🎉</Text>
              )}
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  progressDot: {
    width: 36,
    height: 6,
    borderRadius: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  stepContent: {
    flex: 1,
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  heroCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  heroEmoji: { fontSize: 44 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  featureList: { gap: Spacing.two, marginTop: Spacing.two },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1, fontSize: 15, fontWeight: '500', lineHeight: 22 },
  stageList: { gap: Spacing.two },
  stageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  stageEmoji: { fontSize: 26 },
  stageTextBlock: { flex: 1 },
  stageName: { fontSize: 16, fontWeight: '600' },
  stageDesc: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  emptyCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  symptomItem: { width: '47%' },
  symptomChip: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two + 4,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: Spacing.one,
  },
  symptomEmoji: { fontSize: 26 },
  symptomLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center', lineHeight: 18 },
  skipHint: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: Spacing.one },
  navRow: {
    flexDirection: 'row',
    padding: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
    borderTopWidth: 1,
  },
  backBtn: {
    flex: 1,
    borderRadius: Spacing.three,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  backBtnText: { fontSize: 15, fontWeight: '600' },
  nextBtn: {
    flex: 2,
    borderRadius: Spacing.three,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
