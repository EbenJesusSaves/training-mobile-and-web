import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';

import { appConfig } from '@/config/app-config';
import { buildDateChips, type DateChip, type DateKey, todayKey } from '@/libs/dates';

import { borderWidths } from '@/constants/borders';
import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { ui } from '@/constants/ui';

interface DateStripProps {
  value: DateKey;
  onChange: (date: DateKey) => void;
  /** First selectable date (e.g. the outbound date when choosing a return). */
  minDate?: DateKey;
}

const ITEM_SPAN = sizes.dateChipWidth + spacing.sm;

/** Horizontal date chips; the selected day is a filled ink (or red, in dark mode) chip. */
export function DateStrip({ value, onChange, minDate }: DateStripProps) {
  const start = minDate ?? todayKey();
  const chips = useMemo(() => buildDateChips(start, appConfig.searchDays), [start]);
  const listRef = useRef<FlatList<DateChip>>(null);
  const selectedIndex = Math.max(
    chips.findIndex((chip) => chip.key === value),
    0,
  );
  const firstVisible = Math.max(selectedIndex - ui.dateStripLeadingChips, 0);

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: firstVisible * ITEM_SPAN, animated: true });
  }, [firstVisible]);

  const renderItem = useCallback(
    ({ item }: { item: DateChip }) => <DateChipView chip={item} selected={item.key === value} onPress={onChange} />,
    [onChange, value],
  );

  return (
    <FlatList
      ref={listRef}
      horizontal
      data={chips}
      keyExtractor={(chip) => chip.key}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={Separator}
      getItemLayout={(_, index) => ({ length: ITEM_SPAN, offset: ITEM_SPAN * index, index })}
      initialScrollIndex={firstVisible}
      accessibilityRole="list"
      accessibilityLabel="Travel date"
    />
  );
}

const Separator = () => <View style={styles.separator} />;

const DateChipView = memo(function DateChipView({
  chip,
  selected,
  onPress,
}: {
  chip: DateChip;
  selected: boolean;
  onPress: (key: DateKey) => void;
}) {
  const { colors, scheme } = useTheme();
  const selectedBackground = scheme === 'dark' ? colors.accent : colors.inverse;
  const selectedTone = scheme === 'dark' ? 'onAccent' : 'onInverse';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${chip.weekday} ${chip.day} ${chip.month}`}
      accessibilityState={{ selected }}
      onPress={() => onPress(chip.key)}
      style={[
        styles.chip,
        { backgroundColor: selected ? selectedBackground : colors.surfaceRaised, borderColor: selected ? selectedBackground : colors.line },
      ]}
    >
      <AppText variant="caption" tone={selected ? selectedTone : 'muted'}>
        {chip.month}
      </AppText>
      <AppText variant="dateDay" tone={selected ? selectedTone : 'ink'}>
        {chip.day}
      </AppText>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  list: { paddingHorizontal: layout.screenGutter },
  separator: { width: spacing.sm },
  chip: {
    width: sizes.dateChipWidth,
    height: sizes.dateChipHeight,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borderWidths.hairline,
    gap: spacing.xxxs,
  },
});
