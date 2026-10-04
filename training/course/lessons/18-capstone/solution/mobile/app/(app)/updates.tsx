import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';
import { EmptyState, ErrorState } from '@/components/ui/feedback/state-views';
import { Skeleton } from '@/components/ui/loaders/skeleton';

import { useTripUpdates } from '@/hooks/use-trip-updates';

import { formatDateTime } from '@/libs/format';

import { borderWidths } from '@/constants/borders';
import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

export default function UpdatesScreen() {
  const { colors } = useTheme();
  const { updates, isLoading, error, refetch, isRefreshing, data } = useTripUpdates();

  return (
    <Screen refreshing={isRefreshing} onRefresh={refetch}>
      <HeaderBar title="Trip updates" />
      {isLoading ? (
        <Skeleton height={sizes.skeletonListItem} radius={layout.cardRadius} />
      ) : error && !data ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : updates.length === 0 ? (
        <EmptyState
          icon="check"
          title="You’re all caught up"
          message="Delays and cancellations for your upcoming trips will appear here."
        />
      ) : (
        <View style={styles.list}>
          {updates.map((update) => {
            const cancelled = update.kind === 'CANCELLED';
            return (
              <Pressable
                key={update.id}
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/tickets/[id]', params: { id: update.booking.id } })}
                style={[styles.item, { backgroundColor: colors.surfaceRaised, borderColor: cancelled ? colors.danger : colors.warning }]}
              >
                <View style={[styles.icon, { backgroundColor: cancelled ? colors.dangerSoft : colors.warningSoft }]}>
                  <Icon name={cancelled ? 'ban' : 'clock'} size={iconSizes.lg} color={cancelled ? colors.danger : colors.warning} />
                </View>
                <View style={styles.text}>
                  <AppText variant="bodyStrong">
                    {cancelled ? 'Train cancelled' : `Delayed by ${update.journey.delayMinutes} min`} · {update.journey.trainNumber}
                  </AppText>
                  <AppText variant="label" tone="secondary">
                    {update.journey.origin.city} → {update.journey.destination.city}, {formatDateTime(update.journey.departureAt)}
                  </AppText>
                  <AppText variant="caption" tone="muted">
                    {cancelled
                      ? 'Contact RailPass staff to rebook or arrange a refund.'
                      : 'Your seats are unchanged. Booking ' + update.booking.reference}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: layout.listGap },
  item: { flexDirection: 'row', gap: spacing.md, borderRadius: layout.cardRadius, padding: spacing.lg, borderWidth: borderWidths.hairline },
  icon: { width: sizes.optionIcon, height: sizes.optionIcon, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: spacing.xxxs },
});
