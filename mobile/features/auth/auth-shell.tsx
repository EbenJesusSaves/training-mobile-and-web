import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';
import { IconButton } from '@/components/ui/buttons/icon-button';
import { type SceneVariant, TravelScene } from '@/features/auth/travel-scene';

import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { spacing } from '@/constants/spacing';

import type { ReactNode } from 'react';

interface AuthShellProps {
  scene: SceneVariant;
  sceneHeight: number;
  title: string;
  /** Second line of the title, shown in the accent colour as in the reference. */
  highlight: string;
  showBack?: boolean;
  children: ReactNode;
}

/** Illustration on top, rounded form sheet below: the shared layout of every auth screen. */
export function AuthShell({ scene, sceneHeight, title, highlight, showBack = false, children }: AuthShellProps) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { backgroundColor: colors.surfaceRaised }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + layout.sectionGap }}
        >
          <View>
            <TravelScene variant={scene} height={sceneHeight + insets.top} />
            {showBack ? (
              <View style={[styles.back, { top: insets.top + spacing.sm }]}>
                <IconButton icon="back" label="Go back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
              </View>
            ) : null}
          </View>
          <View style={[styles.sheet, { backgroundColor: colors.surfaceRaised }]}>
            <View style={styles.titleBlock}>
              <AppText variant="title" align="center" accessibilityRole="header">
                {title}
                {'\n'}
                <AppText variant="title" tone="accent">
                  {highlight}
                </AppText>
              </AppText>
            </View>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { position: 'absolute', left: layout.screenGutter },
  sheet: {
    marginTop: -layout.sheetOverlap,
    borderTopLeftRadius: radii.xxxl,
    borderTopRightRadius: radii.xxxl,
    paddingHorizontal: layout.screenGutter,
    paddingTop: layout.sectionGap,
    gap: layout.blockGap,
  },
  titleBlock: { marginBottom: spacing.xs },
});
