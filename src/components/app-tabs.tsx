import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from 'expo-router/ui';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

const homeIcon = require('@/assets/images/tabIcons/home.png');
const exploreIcon = require('@/assets/images/tabIcons/explore.png');

const TABS: { name: string; href: string; label: string; icon: ImageSourcePropType }[] = [
  { name: 'index', href: '/', label: 'Home', icon: homeIcon },
  { name: 'checkin', href: '/checkin', label: 'Check-In', icon: homeIcon },
  { name: 'trends', href: '/trends', label: 'Trends', icon: exploreIcon },
  { name: 'notes', href: '/notes', label: 'Notes', icon: homeIcon },
  { name: 'reminders', href: '/reminders', label: 'Reminders', icon: exploreIcon },
];

function TabButton({
  isFocused,
  icon,
  label,
  ...props
}: TabTriggerSlotProps & { icon: ImageSourcePropType; label: string }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Pressable {...props} style={styles.tabItem}>
      <Image
        source={icon}
        style={[styles.icon, { tintColor: isFocused ? colors.text : colors.textSecondary }]}
      />
      <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export default function AppTabs() {
  return (
    <Tabs style={styles.container}>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <ThemedView type="backgroundElement" style={styles.tabBar}>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href as any} asChild>
              <TabButton icon={tab.icon} label={tab.label} />
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
    paddingBottom: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(61,43,31,0.12),'
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  icon: {
    width: 22,
    height: 22,
  },
});
