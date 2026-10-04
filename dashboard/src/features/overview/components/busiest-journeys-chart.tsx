import { Box, Text, useComputedColorScheme } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { ArcElement, Chart as ChartJS, type ChartData, type ChartOptions, RadialLinearScale, Tooltip } from 'chart.js';
import type { CSSProperties } from 'react';
import { PolarArea } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router';

import {
  componentSizes,
  darkColors,
  fontFamilies,
  fontWeights,
  lightColors,
  railGreen,
  railRed,
  textSizes,
  themeColorNames,
} from '../../../shared/constants';
import { formatDateTime, formatPercent } from '../../../shared/lib/format';
import type { JourneyDto } from '../../journeys/types';

import styles from './busiest-journeys-chart.module.css';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip);

// Palette indexes, busiest first: deep greens on light surfaces, bright reds on dark ones.
const SHADES = { light: [8, 7, 6, 5, 4], dark: [2, 3, 4, 5, 6] } as const;

type SwatchStyle = CSSProperties & { '--rp-swatch': string };

const routeName = (journey: JourneyDto) => `${journey.origin.city} → ${journey.destination.city}`;

export function BusiestJourneysChart({ journeys }: { journeys: JourneyDto[] }) {
  const navigate = useNavigate();
  const scheme = useComputedColorScheme('light');
  const reduceMotion = useReducedMotion();

  if (journeys.length === 0) {
    return (
      <Text size={textSizes.sm} c={themeColorNames.dimmed}>
        No upcoming journeys to rank yet.
      </Text>
    );
  }

  const colors = scheme === 'dark' ? darkColors : lightColors;
  const palette = scheme === 'dark' ? railRed : railGreen;
  const shades = SHADES[scheme];
  const fills = journeys.map((_, index) => palette[shades[index % shades.length]]);
  const font = { family: fontFamilies.primary, weight: Number(fontWeights.bold) };

  const data: ChartData<'polarArea'> = {
    labels: journeys.map(routeName),
    datasets: [
      {
        label: 'Occupancy',
        data: journeys.map((journey) => Math.round(journey.occupancy * 100)),
        backgroundColor: fills,
        borderColor: colors.surfaceRaised,
      },
    ],
  };

  const options: ChartOptions<'polarArea'> = {
    maintainAspectRatio: false,
    animation: reduceMotion ? false : undefined,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25, z: 1, callback: (value) => `${value}%`, color: colors.inkMuted, backdropColor: colors.surfaceRaised, font },
        grid: { color: colors.line },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: colors.inverse,
        titleFont: font,
        bodyFont: font,
        callbacks: {
          label: (item) => {
            const journey = journeys[item.dataIndex];
            return `${formatPercent(journey.occupancy)} full · ${formatDateTime(journey.departureAt)}`;
          },
        },
      },
    },
    onClick: (_event, elements) => {
      const journey = elements[0] && journeys[elements[0].index];
      if (journey) navigate(`/journeys/${journey.id}`);
    },
    onHover: (event, elements) => {
      const canvas = event.native?.target;
      if (canvas instanceof HTMLElement) canvas.style.cursor = elements.length ? 'pointer' : 'default';
    },
  };

  return (
    <>
      <Box h={componentSizes.chartHeight} pos="relative">
        <PolarArea
          data={data}
          options={options}
          role="img"
          aria-label={`Occupancy of the ${journeys.length} busiest journeys, from 0 to 100 percent. Each journey is listed below.`}
        />
      </Box>
      <ol className={styles.legend}>
        {journeys.map((journey, index) => (
          <li key={journey.id}>
            <Link className={styles.legendItem} to={`/journeys/${journey.id}`}>
              <span className={styles.swatch} style={{ '--rp-swatch': fills[index] } as SwatchStyle} aria-hidden="true" />
              <span className={styles.legendText}>
                <Text component="span" size={textSizes.sm} fw={fontWeights.bold}>
                  {routeName(journey)}
                </Text>
                <Text component="span" size={textSizes.xs} c={themeColorNames.dimmed}>
                  {journey.trainNumber} · {formatDateTime(journey.departureAt)}
                </Text>
              </span>
              <Text component="span" size={textSizes.sm} fw={fontWeights.extraBold}>
                {formatPercent(journey.occupancy)}
              </Text>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
