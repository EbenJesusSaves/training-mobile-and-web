import { useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';
import { EmptyState, ErrorState } from '@/components/ui/feedback/state-views';
import { TextField } from '@/components/ui/inputs/text-field';
import { Skeleton } from '@/components/ui/loaders/skeleton';
import { CityCard } from '@/features/booking/city-card';

import { useApiQuery } from '@/hooks/use-api-query';

import { travelApi } from '@/api/travel-api';
import { useBookingDraftStore } from '@/store/booking-draft-store';

import { layout } from '@/constants/layout';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { placeholderKeys, ui } from '@/constants/ui';

import type { Station } from '@/api/types';

const GRID_GAP = spacing.md;

export default function StationPickerScreen() {
  const { field } = useLocalSearchParams<{ field: 'origin' | 'destination' }>();
  const { width } = useWindowDimensions();
  const [term, setTerm] = useState('');
  const current = useBookingDraftStore((state) => (field === 'destination' ? state.destination : state.origin));
  const other = useBookingDraftStore((state) => (field === 'destination' ? state.origin : state.destination));
  const stations = useApiQuery('stations', () => travelApi.stations());
  // Fixed widths stop a lone card in the last row from stretching across both columns.
  const cardWidth = (width - layout.screenGutter * 2 - GRID_GAP * (ui.cityGridColumns - 1)) / ui.cityGridColumns;

  // The list is short, so filtering locally gives instant results without a request per keystroke.
  const filtered = useMemo(() => {
    const query = term.trim().toLowerCase();
    return (stations.data ?? []).filter(
      (station) => !query || [station.name, station.city, station.code].some((value) => value.toLowerCase().includes(query)),
    );
  }, [stations.data, term]);

  const choose = (station: Station) => {
    useBookingDraftStore.getState().setStation(field === 'destination' ? 'destination' : 'origin', station);
    router.back();
  };

  return (
    <Screen scroll={false}>
      <HeaderBar title={field === 'destination' ? 'Where to?' : 'Departing from'} />
      <TextField
        label="Search stations"
        hideLabel
        icon="search"
        placeholder="Search by station or city"
        value={term}
        onChangeText={setTerm}
        autoCorrect={false}
        returnKeyType="search"
      />
      {stations.isLoading ? (
        <View style={[styles.list, styles.grid]}>
          {placeholderKeys(ui.skeletonCount.rows).map((key) => (
            <Skeleton key={key} width={cardWidth} height={sizes.skeletonCityCard} radius={layout.cardRadius} />
          ))}
        </View>
      ) : stations.error && !stations.data ? (
        <ErrorState error={stations.error} onRetry={stations.refetch} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(station) => station.id}
          numColumns={ui.cityGridColumns}
          columnWrapperStyle={styles.row}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState icon="search" title="No matching stations" message="Try a city name, such as Kumasi or Takoradi." />
          }
          renderItem={({ item }) => (
            <CityCard
              station={item}
              width={cardWidth}
              selected={item.id === current?.id}
              isOtherEnd={item.id === other?.id}
              onPress={() => choose(item)}
            />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: GRID_GAP, paddingTop: spacing.lg, paddingBottom: layout.screenBottomPadding },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  row: { gap: GRID_GAP },
});
