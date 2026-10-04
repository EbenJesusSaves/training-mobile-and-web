import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/ui/feedback/state-views';

export default function UpdatesScreen() {
  return (
    <Screen>
      <HeaderBar title="Trip updates" />
      {/* LIVE 18.2 — Render cancelled and delayed trips from the update hook. */}
      <EmptyState icon="check" title="Updates not wired yet" message="Trip changes will appear here after the live build." />
    </Screen>
  );
}
