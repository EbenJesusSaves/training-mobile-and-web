import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';
import { EmptyState, ErrorState } from '@/components/ui/feedback/state-views';
import { TextField } from '@/components/ui/inputs/text-field';
import { Skeleton } from '@/components/ui/loaders/skeleton';

import { useApiQuery } from '@/hooks/use-api-query';

import { travelApi } from '@/api/travel-api';
import { pluralize } from '@/libs/format';

import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { placeholderKeys, ui } from '@/constants/ui';

import type { Station } from '@/api/types';

export default function StationsScreen() {
  const { colors } = useTheme();
  const [term, setTerm] = useState('');
  const stations = useApiQuery('stations', () => travelApi.stations(), { refetchOnFocus: true });
  const filtered = useMemo(() => {
    const query = term.trim().toLowerCase();
    return (stations.data ?? []).filter(
      (station) => !query || `${station.name} ${station.city} ${station.code}`.toLowerCase().includes(query),
    );
  }, [stations.data, term]);

  const open = (station: Station) => router.push({ pathname: '/stations/[id]', params: { id: station.id } });

  return (
    <Screen scroll={false} bleed>
      <FlatList
        data={filtered}
        keyExtractor={(station) => station.id}
        contentContainerStyle={styles.list}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        refreshing={stations.isRefreshing}
        onRefresh={stations.refetch}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="display" accessibilityRole="header">
              Stations
            </AppText>
            <TextField
              label="Search stations"
              hideLabel
              icon="search"
              placeholder="Search by station or city"
              value={term}
              onChangeText={setTerm}
              autoCorrect={false}
            />
          </View>
        }
        ListEmptyComponent={
          stations.isLoading ? (
            <View style={styles.skeletons}>
              {placeholderKeys(ui.skeletonCount.rows).map((key) => (
                <Skeleton key={key} height={sizes.rowMinHeight} radius={radii.xl} />
              ))}
            </View>
          ) : stations.error ? (
            <ErrorState error={stations.error} onRetry={stations.refetch} />
          ) : (
            <EmptyState icon="search" title="No matching stations" message="Try another name or city." />
          )
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.city}`}
            accessibilityHint="Shows departures and destinations"
            onPress={() => open(item)}
            style={[styles.row, { backgroundColor: colors.surfaceRaised }]}
          >
            <View style={[styles.code, { backgroundColor: colors.surface }]}>
              <AppText variant="labelStrong">{item.code}</AppText>
            </View>
            <View style={styles.text}>
              <AppText variant="bodyStrong">{item.name}</AppText>
              <AppText variant="label" tone="muted">
                {item.city} · {pluralize(item.routeCount ?? 0, 'destination')}
              </AppText>
            </View>
            <Icon name="forward" size={iconSizes.md} color={colors.inkMuted} />
          </Pressable>
        )}
      />
    </Screen>
  );
}

const ListSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  list: { paddingHorizontal: layout.screenGutter, paddingBottom: layout.screenBottomPadding },
  header: { gap: layout.blockGap, paddingTop: spacing.md, marginBottom: spacing.xl },
  separator: { height: spacing.sm },
  skeletons: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.md,
    minHeight: sizes.rowMinHeight,
  },
  code: {
    width: sizes.stationCodeWidth,
    height: sizes.stationCodeHeight,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: spacing.xxxs },
});
