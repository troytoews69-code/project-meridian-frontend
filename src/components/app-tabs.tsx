import { Ionicons } from '@expo/vector-icons';
import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from 'expo-router/ui';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

type TabConfig = {
  name: string;
  href: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

const TABS: TabConfig[] = [
  { name: 'index', href: '/', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'checkin', href: '/checkin', label: 'Check-In', icon: 'clipboard-outline', activeIcon: 'clipboard' },
  { name: 'trends', href: '/trends', label: 'Trends', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  { name: 'learn', href: '/learn', label: 'Learn', icon: 'book-outline', activeIcon: 'book' },
  { name: 'notes', href: '/notes', label: 'Notes', icon: 'document-text-outline', activeIcon: 'document-text' },
  { name: 'reminders', href: '/reminders', label: 'Reminders', icon: 'notifications-outline', activeIcon: 'notifications' },
];

function TabButton({
  isFocused,
  icon,
  activeIcon,
  label,
  ...props
}: TabTriggerSlotProps & { icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap; label: string }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const color = isFocused ? colors.primary : colors.textSecondary;

  return (
    <Pressable {...props} style={styles.tabItem}>
      <Ionicons name={isFocused ? activeIcon : icon} size={22} color={color} />
      <ThemedText
        type="small"
        style={[styles.tabLabel, { color, fontSize: 10, fontWeight: isFocused ? '700' : '500' }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.container}>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <ThemedView type="backgroundElement" style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, Spacing.two) }]}>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href as any} asChild>
              <TabButton icon={tab.icon} activeIcon={tab.activeIcon} label={tab.label} />
            </TabTrigger>
          ))}
        </ThemedView>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(61,43,31,0.12)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tabLabel: {
    lineHeight: 14,
  },
});

