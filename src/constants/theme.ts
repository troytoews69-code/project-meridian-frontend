/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Warm off-white background — not harsh white
    background: '#FDF8F5',
    // Soft rose-tinted card surfaces
    backgroundElement: '#F5EDE8',
    // Warm mauve for selected/active states
    backgroundSelected: '#E8D5CC',
    // Deep warm brown — readable but not cold black
    text: '#3D2B1F',
    // Muted warm taupe for secondary text
    textSecondary: '#8C6E63',
    // Primary action color — soft rose
    primary: '#C97B84',
  },
  dark: {
    // Deep warm charcoal — not pure black
    background: '#1E1512',
    // Warm dark card surfaces
    backgroundElement: '#2D1F1A',
    // Warm dark selected state
    backgroundSelected: '#3D2B22',
    // Warm cream white — not harsh
    text: '#F5EDE8',
    // Muted warm secondary
    textSecondary: '#A08075',
    // Softer primary in dark mode
    primary: '#D4909A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
