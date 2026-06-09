import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import AppTabs from '@/components/app-tabs';
import OnboardingFlow from '@/components/onboarding-flow';
import { AuthProvider } from '@/context/auth-context';

export const ONBOARDING_KEY = 'onboarding_v1_complete';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [checked, setChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(ONBOARDING_KEY)
      .then((val) => {
        setNeedsOnboarding(!val);
        setChecked(true);
      })
      .catch(() => {
        setNeedsOnboarding(false);
        setChecked(true);
      });
  }, []);

  if (!checked) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {needsOnboarding ? (
        <OnboardingFlow onComplete={() => setNeedsOnboarding(false)} />
      ) : (
        <AuthProvider>
          <AppTabs />
        </AuthProvider>
      )}
    </ThemeProvider>
  );
}

