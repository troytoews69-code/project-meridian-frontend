import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';

type Article = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  summary: string;
  content: string;
};

const ARTICLES: Article[] = [
  {
    id: 'hot-flashes',
    title: 'Hot Flashes & Night Sweats',
    icon: 'thermometer-outline',
    color: '#E07B6A',
    summary: 'What causes them and evidence-based ways to manage them',
    content: `Hot flashes are sudden rushes of heat affecting the face, neck, and chest — often followed by sweating, then chills. Night sweats are on the same continuum. They affect up to 80% of women during perimenopause and menopause.

**What causes them?**
It's not always purely low estrogen. Dr. Christiane Northrup, M.D. (author of The Wisdom of Menopause) notes that low progesterone with normal estrogen, high FSH, surges of LH, elevated cortisol, and low beta-endorphin levels can all trigger hot flashes — making tracking your personal pattern essential.

**Dr. Northrup's 10 triggers to watch:**
1. Spicy food — a common aggravator for many women
2. Hot drinks — warm beverages can push you over the threshold
3. Caffeine — try eliminating for one week to test your sensitivity
4. Alcohol — especially red wine; triggers an epinephrine release
5. Sugar — refined carbs and sugar spikes are linked to flashes and palpitations
6. Stress — triggers a hormonal chain reaction intensifying flash frequency
7. Hot weather and saunas — raise body temperature past the trigger point
8. Tobacco — consistently associated with more frequent, more severe flashes
9. Synthetic or tight clothing — traps body heat
10. Unexpressed anger or emotion — bottled feelings amplify symptoms; journaling helps uncover patterns

**What actually works:**
**Track your triggers** — keeping a symptom diary (this app!) may be all you need to significantly reduce flashes.
**Paced breathing** — slow, deep breathing (6 breaths/minute) during a flash measurably reduces severity.
**Stress reduction** — Harvard research found relaxation-based techniques helped cool hot flashes in 90% of women without hormonal therapy.
**Natural progesterone cream** — 2% bioidentical progesterone (1/4 tsp/day on skin) has shown benefit for many women; entirely different from synthetic progestins.
**Herbal support** — black cohosh, dong quai, chasteberry, and motherwort have evidence for some women.
**Exercise** — 150 minutes of aerobic activity per week reduces flash frequency and severity.
**Cognitive Behavioural Therapy (CBT)** — clinically proven; as effective as some medications.
**Bioidentical Estrogen HRT** — the most effective medical treatment (up to 90% reduction); Dr. Northrup recommends individualized doses with bioidentical estrogen.

**When to see your doctor:**
If hot flashes are disrupting your sleep, work, or quality of life, treatment exists. You don't have to just "live with it."`,
  },
  {
    id: 'sleep',
    title: 'Sleep & Rest',
    icon: 'moon-outline',
    color: '#9B7FA8',
    summary: 'Why sleep changes in menopause and how to protect it',
    content: `Up to 60% of women report significant sleep disruption during perimenopause and menopause. Poor sleep affects mood, memory, weight, and cardiovascular health — making it one of the highest-impact symptoms to address.

**Why sleep changes:**
Declining progesterone (a natural sleep-promoting hormone) · Night sweats interrupting deep sleep · Elevated cortisol levels · Circadian rhythm shifts · Increased sleep apnea risk after menopause

**What the evidence supports:**
**Consistent sleep schedule** — same bedtime and wake time every day, including weekends. This is the single highest-impact sleep intervention.
**Cool bedroom** — 65–68°F (18–20°C) with moisture-wicking bedding.
**Magnesium glycinate** — 300–400mg before bed; good evidence for improving sleep quality.
**Limit alcohol** — it helps you fall asleep but significantly fragments sleep quality.
**CBT for Insomnia (CBT-I)** — first-line treatment for chronic insomnia; more effective than sleep medication long-term.
**Reduce blue light** — avoid screens 60–90 minutes before bed.

**HRT and sleep:**
Progesterone specifically has strong evidence for improving sleep quality in perimenopausal women. If sleep disruption is severe, this is worth discussing with your doctor.`,
  },
  {
    id: 'brain-fog',
    title: 'Brain Fog & Memory',
    icon: 'bulb-outline',
    color: '#6BAE8E',
    summary: 'The hormone-brain connection and practical strategies',
    content: `"Brain fog" — difficulty concentrating, word-finding struggles, and memory lapses — is reported by up to 62% of women during perimenopause. This is real, measurable, and for most women, temporary.

**The science:**
Estrogen receptors are found throughout the prefrontal cortex (decision-making) and hippocampus (memory). As estrogen fluctuates and declines, neurotransmitters — serotonin, dopamine, acetylcholine — are affected.

**Key research finding:**
Studies show verbal memory and processing speed dip during perimenopause but typically improve after menopause stabilizes. This is not early dementia.

**What helps most:**
**Aerobic exercise** — the most powerful brain-protective intervention. 150 min/week increases BDNF (brain growth factor), improving memory and cognition.
**Protect sleep** — the brain consolidates memories during sleep. Every hour of sleep lost is a direct hit to next-day cognition.
**Stress management** — chronic stress physically shrinks the hippocampus. Mindfulness and yoga have real evidence here.
**Cognitive engagement** — learning new skills, reading, puzzles maintain neural pathways.
**Mediterranean diet** — consistently linked to slower cognitive decline.

**HRT timing:**
Studies suggest starting HRT early in perimenopause may offer long-term brain protection. The "critical window hypothesis" suggests timing matters.`,
  },
  {
    id: 'heart-health',
    title: 'Heart Health',
    icon: 'heart-outline',
    color: '#C97B84',
    summary: "Estrogen's protective role and what to monitor",
    content: `Cardiovascular disease is the #1 cause of death in women over 50. Before menopause, estrogen provides significant cardiac protection. After menopause, risk rises sharply — making heart health one of the most important focuses of this life stage.

**How estrogen protects the heart:**
Keeps LDL (bad cholesterol) lower · Raises HDL (good cholesterol) · Keeps blood vessels flexible · Has anti-inflammatory effects · Supports healthy blood pressure

**What typically changes:**
LDL rises 10–15% · HDL may decrease · Triglycerides increase · Blood pressure rises · Abdominal fat (the most cardiovascular-risky type) increases

**What to ask your doctor to check:**
Blood pressure (every 1–2 years) · Full cholesterol panel · Blood sugar/HbA1c · Waist circumference

**Heart-protective lifestyle:**
**Exercise** — 150 min/week cardio + 2x strength training per week. The single most powerful intervention.
**Diet** — Mediterranean pattern: olive oil, fish, vegetables, legumes, nuts, whole grains.
**Quit smoking** — the highest-impact single change you can make for heart health.
**Limit alcohol** — max 1 drink/day for women.
**Manage stress** — chronic stress is a genuine cardiac risk factor, not just a feeling.

**Discuss with your doctor:**
Statin therapy, blood pressure medications, and HRT timing all have cardiac implications worth a dedicated conversation.`,
  },
  {
    id: 'hrt',
    title: 'HRT Basics',
    icon: 'medical-outline',
    color: '#5B9BD5',
    summary: 'Types, benefits, risks, and how to talk to your doctor',
    content: `Hormone Replacement Therapy (HRT) is the most effective treatment for menopausal symptoms. Modern body-identical HRT is far safer than the synthetic formulations studied in the 1990s WHI trial that caused widespread — and now widely recognized as exaggerated — fear.

**Bioidentical vs. Synthetic — a critical distinction:**
This is a point Dr. Christiane Northrup, M.D. has championed for decades: bioidentical hormones are chemically identical to those your body naturally produces. Synthetic progestins (in most conventional HRT and birth control pills) are different molecules with a less favorable side-effect profile. The two are not the same and should not be treated as equivalent.

**Types of HRT:**
**Estrogen-only** — for women who have had a hysterectomy.
**Combined (estrogen + progestogen)** — for women with a uterus; progesterone protects the uterine lining.
**Body-identical / Bioidentical HRT** — micronized progesterone (Utrogestan/Prometrium) and 17-beta estradiol; considered the safest profile by most menopause specialists today.
**Delivery methods** — transdermal (patches, gels, sprays) carry significantly lower blood clot and stroke risk than oral tablets.

**Natural progesterone cream (no prescription needed):**
2% bioidentical progesterone cream, 1/4 tsp on skin once or twice daily, at least 3 weeks per month (or daily if periods have stopped). Dr. Northrup recommends this as a starting point for many women with hot flashes, sleep, and mood concerns.

**What HRT helps:**
Hot flashes and night sweats (most effective treatment) · Sleep quality · Mood and anxiety · Vaginal dryness · Bone density · Long-term heart and brain protection when started early in the transition

**Understanding the risks in context:**
**Breast cancer** — modest increase with combined HRT; significantly lower with transdermal body-identical options. Smoking, alcohol, and obesity each individually pose greater risk than body-identical HRT.
**Blood clots** — risk is mainly with oral estrogen tablets. Transdermal estrogen has no meaningful increase in clot risk.
**Stroke** — minimal risk increase; transdermal has much lower risk than oral.

**Key facts that changed:**
The old "5-year limit" has been revised. Many women benefit from longer-term use. Benefits outweigh risks for most healthy women under 60 who start within 10 years of menopause onset.

**How to approach your doctor:**
Bring your symptom history (this app helps!), ask specifically about body-identical options and transdermal delivery. If your doctor is not familiar with modern menopause care, request a referral to a menopause specialist.`,
  },
  {
    id: 'nutrition',
    title: 'Nutrition & Weight',
    icon: 'nutrition-outline',
    color: '#E8A44A',
    summary: 'Why metabolism changes and how to work with your body',
    content: `Weight gain during menopause — particularly around the abdomen — is common and is driven by hormonal changes, not just calories. Understanding why it happens helps you work with your body rather than fighting it.

**Why weight changes:**
Declining estrogen shifts fat storage from hips/thighs to abdomen · Muscle mass decreases 3–8% per decade (accelerates without resistance exercise) · Metabolic rate slows · Poor sleep increases ghrelin (hunger) and decreases leptin (satiety) · Elevated cortisol promotes abdominal fat storage

**Protein — increase it:**
Aim for 1.2–1.6g per kg of body weight daily. Protein preserves muscle, increases satiety, and supports metabolism. Good sources: eggs, fish, chicken, Greek yogurt, legumes, tofu.

**Calcium and Vitamin D — critical:**
1200mg calcium daily (food first — dairy, leafy greens, sardines, fortified foods). 1000–2000 IU Vitamin D3 daily; most women are deficient. Bone loss accelerates sharply in the first 5–7 years post-menopause.

**Phytoestrogens:**
Found in soy, flaxseed, chickpeas. Weak estrogen-like effect; evidence for mild symptom reduction in some women. Aim for whole food sources.

**What to reduce:**
Ultra-processed foods · Added sugar · Alcohol (affects sleep, triggers hot flashes, and is linked to breast cancer risk) · Refined carbohydrates

**Mediterranean pattern:**
The most evidence-supported dietary approach for menopausal health. Olive oil, vegetables, fish, whole grains, nuts, legumes. Not a fad — decades of research back it.`,
  },
  {
    id: 'exercise',
    title: 'Movement & Exercise',
    icon: 'walk-outline',
    color: '#6BAE8E',
    summary: 'The most powerful symptom management tool available',
    content: `Exercise improves virtually every menopausal symptom. It protects bone density, supports cardiovascular health, boosts mood, and helps maintain healthy weight. It is the single most evidence-backed, side-effect-free intervention available.

**What exercise does for menopause:**
Reduces hot flash frequency and severity · Improves sleep quality · Reduces depression and anxiety symptoms · Preserves bone density · Maintains muscle mass and metabolic rate · Reduces cardiovascular risk · Improves cognition and memory

**Resistance/Strength training — most important:**
2–3 sessions per week. Prevents and reverses muscle loss · Maintains bone density (loading bones stimulates growth) · Improves insulin sensitivity · Raises resting metabolic rate. Even 20-minute sessions with moderate weights are highly effective.

**Aerobic/Cardio:**
150 minutes/week of moderate intensity OR 75 minutes vigorous. Walking, cycling, swimming, dancing — all count. Cardiovascular protection, mood, weight management.

**Yoga and Pilates:**
Strong evidence for reducing hot flash severity · Improves balance (critical as fracture risk rises with age) · Reduces stress and cortisol · Improves pelvic floor function (reduces leakage)

**Getting started:**
Start where you are. Even 10-minute walks are beneficial. The key is consistency over intensity. Three 10-minute walks equal one 30-minute walk for most health outcomes.

**Important:**
Stop and see a doctor if you experience chest pain, severe shortness of breath, or dizziness during exercise.`,
  },
  {
    id: 'mood',
    title: 'Mood & Anxiety',
    icon: 'happy-outline',
    color: '#C97B84',
    summary: 'The hormone-mood connection and what genuinely helps',
    content: `Mood changes — irritability, anxiety, low mood, tearfulness, sudden rage — are among the most distressing and least talked-about menopause symptoms. They are driven by real hormonal changes, not personal weakness or "going crazy."

**The hormone-mood connection:**
Estrogen modulates serotonin, dopamine, and GABA — the key neurotransmitters for mood stability. Declining progesterone (which has natural calming/anxiolytic effects via GABA receptors) directly increases anxiety. Disturbed sleep from night sweats compounds everything.

**The mind-body dimension:**
Dr. Christiane Northrup describes menopause as a profound opportunity for reinvention — a time when the body demands attention to unresolved emotional patterns. Women with a history of suppressed emotions often experience more intense symptoms. This is not weakness; it is the body communicating. Journaling, therapy, and authentic emotional expression can measurably reduce symptom severity alongside physical treatments.

**Express, don't suppress:**
Bottled-up anger and unexpressed emotions are consistently linked to worse hot flashes and mood symptoms. Identifying and releasing feelings — through journaling, trusted relationships, or therapy — has real physiological benefit.

**Exercise — the most powerful intervention:**
Raises serotonin, BDNF, and endorphins. A 30-minute walk has measurable mood benefits within hours. Clinically as effective as antidepressants for mild-to-moderate depression, with zero side effects.

**Mindfulness and CBT:**
Mindfulness-Based Stress Reduction (MBSR) has strong evidence for menopausal anxiety. CBT specifically for menopause is effective and widely available. Even 10 minutes of daily mindfulness practice changes stress hormone patterns.

**Social connection:**
Isolation makes mood symptoms significantly worse. Menopause support groups — in-person or online — provide community and the powerful experience of not being alone in this transition.

**Nutrition for mood:**
Magnesium (dark chocolate, nuts, leafy greens) supports mood and sleep. Omega-3 fatty acids (fatty fish, walnuts, flaxseed) reduce depression risk. Blood sugar stability matters — reduce refined carbs, increase protein.

**When to seek help:**
If low mood or anxiety is significantly impacting your daily life, relationships, or work, speak to your doctor. Bioidentical progesterone in particular can be transformative for hormone-driven mood and anxiety. You don't have to manage this alone.`,
  },
  {
    id: 'bone-health',
    title: 'Bone Health & Osteoporosis',
    icon: 'body-outline',
    color: '#8BC4E0',
    summary: 'Protecting your bones through the transition and beyond',
    content: `Women can lose up to 20% of bone density in the 5–7 years following menopause. Osteoporosis (brittle bone disease) affects 1 in 3 women over 50. It's largely preventable — but requires action now, not later.

**Why bones change:**
Estrogen directly stimulates bone-forming cells (osteoblasts) and suppresses bone-breaking cells (osteoclasts). When estrogen falls, bone breakdown outpaces bone formation.

**Risk factors to know:**
Early menopause (before 45) · Family history of fractures · Low body weight · Smoking · Heavy alcohol use · Corticosteroid use · Low calcium and vitamin D intake · Sedentary lifestyle

**The three pillars of bone protection:**

**1. Load-bearing exercise:**
Resistance training and impact activities (walking, jogging, dancing) stress bones and signal them to grow denser. Swimming and cycling, while excellent for other reasons, don't load bones.

**2. Calcium and Vitamin D:**
1200mg calcium daily (spread through the day — absorption is limited per dose). 1000–2000 IU Vitamin D3 daily. These work together — vitamin D is required for calcium absorption.

**3. Reduce bone-destroying habits:**
Smoking accelerates bone loss significantly. Alcohol impairs calcium absorption and increases fall risk. High caffeine intake (>4 cups/day) modestly increases calcium excretion.

**HRT and bones:**
HRT is highly effective at preventing bone loss and fractures. Even low-dose HRT protects bones. This benefit continues during treatment but bone loss resumes after stopping.

**Ask your doctor about:**
A DEXA scan (bone density test) — recommended for all women at menopause, especially with risk factors. Bisphosphonate medications if bone density is already low.`,
  },
];

export default function LearnScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  function renderContent(content: string) {
    return content.split('\n\n').map((para, i) => {
      if (para.startsWith('**') && para.endsWith('**') && !para.slice(2).includes('**')) {
        return (
          <ThemedText key={i} type="smallBold" style={styles.articleHeading}>
            {para.replace(/\*\*/g, '')}
          </ThemedText>
        );
      }
      const parts = para.split(/(\*\*.*?\*\*)/g);
      return (
        <ThemedText key={i} themeColor="textSecondary" style={styles.articlePara}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <Text key={j} style={{ fontWeight: '700', color: colors.text }}>
                {part.slice(2, -2)}
              </Text>
            ) : (
              part
            )
          )}
        </ThemedText>
      );
    });
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Colored header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.headerTitle}>Learn</ThemedText>
          <ThemedText style={styles.headerSub}>
            Evidence-based guides for women over 40
          </ThemedText>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Recommended reading card */}
          <ThemedView type="backgroundElement" style={[styles.card, { padding: Spacing.three, flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' }]}>
            <View style={[styles.iconBg, { backgroundColor: '#C97B8422' }]}>
              <Ionicons name="library-outline" size={22} color="#C97B84" />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <ThemedText type="smallBold">Recommended Reading</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                <Text style={{ fontWeight: '700' }}>"The Wisdom of Menopause"</Text>
                {' '}by Christiane Northrup, M.D. — the landmark guide on hormones, mind-body health, and midlife transformation. Also:{' '}
                <Text style={{ fontWeight: '700' }}>"Women's Bodies, Women's Wisdom"</Text>
                {' '}by the same author.
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                drnorthrup.com · Ask your doctor about a menopause specialist referral
              </ThemedText>
            </View>
          </ThemedView>

          {ARTICLES.map((article) => {
            const isOpen = expanded === article.id;
            return (
              <ThemedView key={article.id} type="backgroundElement" style={styles.card}>
                <Pressable onPress={() => toggle(article.id)} style={styles.cardHeader}>
                  <View style={[styles.iconBg, { backgroundColor: article.color + '22' }]}>
                    <Ionicons name={article.icon} size={22} color={article.color} />
                  </View>
                  <View style={styles.cardHeaderText}>
                    <ThemedText type="smallBold" style={styles.cardTitle}>{article.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{article.summary}</ThemedText>
                  </View>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>

                {isOpen ? (
                  <View style={styles.articleBody}>
                    <View style={[styles.accentBar, { backgroundColor: article.color }]} />
                    {renderContent(article.content)}
                  </View>
                ) : null}
              </ThemedView>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  iconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  cardHeaderText: { flex: 1 },
  cardTitle: { marginBottom: 2 },
  articleBody: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  accentBar: {
    height: 3,
    borderRadius: 2,
    marginBottom: Spacing.one,
    opacity: 0.7,
  },
  articleHeading: {
    marginTop: Spacing.two,
    fontSize: 14,
  },
  articlePara: {
    fontSize: 14,
    lineHeight: 22,
  },
});
