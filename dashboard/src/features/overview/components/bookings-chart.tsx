import { BarChart } from '@mantine/charts';
import { Group, SegmentedControl, Text, VisuallyHidden } from '@mantine/core';
import { useState } from 'react';

import { componentSizeKeys, componentSizes, fontWeights, textSizes, themeColorNames } from '../../../shared/constants';
import { formatDate, formatDayMonth, formatMoney, formatMoneyCompact } from '../../../shared/lib/format';

import styles from './bookings-chart.module.css';

interface BookingsChartProps {
  daily: { date: string; bookings: number; revenueCents: number }[];
}

type Metric = 'bookings' | 'revenueCents';

const METRICS: { value: Metric; label: string }[] = [
  { value: 'bookings', label: 'Bookings' },
  { value: 'revenueCents', label: 'Revenue' },
];

const formatCount = (value: number) => value.toLocaleString();

/** One metric at a time on labelled axes, so each bar reads as "this many on this day". */
export function BookingsChart({ daily }: BookingsChartProps) {
  const [metric, setMetric] = useState<Metric>('bookings');
  const isRevenue = metric === 'revenueCents';
  const format = isRevenue ? formatMoney : formatCount;
  const metricLabel = isRevenue ? 'Simulated revenue' : 'Bookings';
  const total = daily.reduce((sum, day) => sum + day[metric], 0);
  const average = daily.length ? Math.round(total / daily.length) : 0;
  const busiest = daily.reduce<BookingsChartProps['daily'][number] | undefined>(
    (best, day) => (!best || day[metric] > best[metric] ? day : best),
    undefined,
  );
  const summary = `${metricLabel} over the last ${daily.length} days: ${format(total)} in total, ${format(average)} per day on average.`;
  // Dates are API (UTC) date keys, so today's key is the UTC calendar date.
  const todayKey = new Date().toISOString().slice(0, 10);
  const data = daily.map((day) => ({ ...day, day: day.date === todayKey ? 'Today' : formatDayMonth(day.date) }));

  return (
    <>
      <Group justify="space-between" align="flex-end" className={styles.chartSummary}>
        <div>
          <Text size={textSizes.xs} c={themeColorNames.dimmed}>
            {metricLabel} · last {daily.length} days
          </Text>
          <Text className={styles.chartTotal}>{format(total)}</Text>
          <Text size={textSizes.xs} c={themeColorNames.dimmed}>
            {format(average)} per day on average
            {busiest && busiest[metric] > 0 ? ` · busiest ${formatDayMonth(busiest.date)} (${format(busiest[metric])})` : ''}
          </Text>
        </div>
        <SegmentedControl
          size={componentSizeKeys.xs}
          data={METRICS}
          value={metric}
          onChange={(value) => setMetric(value as Metric)}
          aria-label="Chart metric"
        />
      </Group>
      <BarChart
        h={componentSizes.chartHeight}
        data={data}
        dataKey="day"
        series={[{ name: metric, label: metricLabel, color: themeColorNames.rail }]}
        valueFormatter={format}
        yAxisProps={{
          tickFormatter: isRevenue ? formatMoneyCompact : formatCount,
          allowDecimals: false,
          width: componentSizes.chartAxisWidth,
        }}
        tickLine="none"
        maxBarWidth={componentSizes.chartMaxBarWidth}
        withBarValueLabel={!isRevenue}
        valueLabelProps={{ fontWeight: fontWeights.bold }}
        role="img"
        aria-label={summary}
      />
      <VisuallyHidden>
        <table>
          <caption>{summary}</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Bookings</th>
              <th>Simulated revenue</th>
            </tr>
          </thead>
          <tbody>
            {daily.map((day) => (
              <tr key={day.date}>
                <td>{formatDate(day.date)}</td>
                <td>{day.bookings}</td>
                <td>{formatMoney(day.revenueCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </VisuallyHidden>
    </>
  );
}
