import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { IconButton } from '@/components/ui/buttons/icon-button';

import { layout } from '@/constants/layout';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { ReactNode } from 'react';

interface HeaderBarProps {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  onInverse?: boolean;
}

/** Back button + centred title, as in the "Choose a Seat" and "Upcoming Trips" references. */
export function HeaderBar({ title, onBack, right, onInverse = false }: HeaderBarProps) {
  const goBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  return (
    <View style={styles.row}>
      <IconButton icon="back" label="Go back" onPress={goBack} tone={onInverse ? 'onInverse' : 'light'} />
      <AppText
        variant="subheading"
        tone={onInverse ? 'onInverse' : 'ink'}
        accessibilityRole="header"
        numberOfLines={1}
        style={styles.title}
      >
        {title}
      </AppText>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: layout.headerTopPadding,
    paddingBottom: layout.headerBottomPadding,
  },
  title: { flex: 1, textAlign: 'center', marginHorizontal: spacing.sm },
  side: { width: sizes.iconButton, alignItems: 'flex-end' },
});
