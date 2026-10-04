// Course version (lesson 05) — removed before routing in lesson 07.
import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';

import { spacingKeys, themeColorNames } from '../shared/constants';

export function CoursePlayground() {
  return (
    <Stack p={spacingKeys.xl} gap={spacingKeys.lg}>
      <div>
        <Text c={themeColorNames.dimmed} tt="uppercase" fw={700}>
          RailPass design system
        </Text>
        <Title>Dashboard tokens</Title>
      </div>
      <Group>
        <Badge color="rail">Rail</Badge>
        <Badge color="mint">Mint</Badge>
        <Badge color="amber">Amber</Badge>
      </Group>
      <Card withBorder shadow="sm">
        <Text>Trace each colour from CSS variables into Mantine components.</Text>
      </Card>
    </Stack>
  );
}
