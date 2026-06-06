import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

const homeIcon = require('@/assets/images/tabIcons/home.png');
const exploreIcon = require('@/assets/images/tabIcons/explore.png');

const TABS = [
  { name: 'index', href: '/', label: 'Home', icon: homeIcon },
  { name: 'checkin', href: '/checkin', label: 'Check-In', icon: homeIcon },
  { name: 'trends', href: '/trends', label: 'Trends', icon: exploreIcon },
  { name: 'notes', href: '/notes', label: 'Notes', icon: homeIcon },
  { name: 'reminders', href: '/reminders', label: 'Reminders', icon: exploreIcon },
];

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <ThemedView type="backgroundElement" style={styles.tabBar}>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href as any} asChild>
              <Pressable style={styles.tabItem}>
                {({ pressed }: { pressed: boolean }) => (
                  <>
                    <Image
                      source={tab.icon}
                      style={[styles.icon, { tintColor: pressed ? colors.text : colors.textSecondary }]}
                    />
                    <ThemedText type="small" themeColor={pressed ? 'text' : 'textSecondary'}>
                      {tab.label}
                    </ThemedText>
                  </>
                )}
              </Pressable>
            </TabTrigger>
          ))}
        </ThemedView>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingBottom: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
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
