import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { SortOptions } from '@/features/booking/filter-sheet';

import { useBookingDraftStore } from '@/store/booking-draft-store';

import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';

import type { JourneySort } from '@/api/types';

/** Presented as a native form sheet (see `app/(app)/_layout.tsx`), so it sizes itself to this content. */
export default function SortJourneysSheet() {
  const insets = useSafeAreaInsets();
  const sort = useBookingDraftStore((state) => state.sort);

  const choose = (next: JourneySort) => {
    useBookingDraftStore.getState().setSort(next);
    router.back();
  };

  return (
    <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}>
      <AppText variant="heading" accessibilityRole="header">
        Sort journeys
      </AppText>
      <SortOptions sort={sort} onChange={choose} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: layout.screenGutter, paddingTop: spacing.xxl, gap: spacing.lg },
});
