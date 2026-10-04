// Course-only helper (lesson 07): a placeholder screen for routes that aren't built yet. Lesson 18 deletes mobile/prototype/.
import { StyleSheet, View } from 'react-native';
import { type Href, router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/buttons/button';

import { spacing } from '@/constants/spacing';

import type { ReactNode } from 'react';

interface PrototypeScreenProps {
  title: string;
  body?: string;
  /** Where "Continue" goes. Typed routes reject paths that don't exist. */
  href?: Href;
  /** Extra actions rendered above "Continue". */
  children?: ReactNode;
}

export function PrototypeScreen({
  title,
  body = 'Real data arrives as the course layers in state and networking.',
  href,
  children,
}: PrototypeScreenProps) {
  return (
    <Screen>
      <View style={styles.stack}>
        <AppText variant="label" tone="accent">
          Prototype route
        </AppText>
        <AppText variant="display">{title}</AppText>
        <AppText tone="secondary">{body}</AppText>
        {children}
        {href ? <Button title="Continue" onPress={() => router.push(href)} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ stack: { gap: spacing.lg } });
