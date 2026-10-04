import { useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen>
      <HeaderBar title="Station" />
      {/* LIVE 17.1 — Complete station detail with the add-a-feature playbook. */}
      <AppText tone="secondary">Station detail for {id ?? 'unknown'} arrives here.</AppText>
    </Screen>
  );
}
