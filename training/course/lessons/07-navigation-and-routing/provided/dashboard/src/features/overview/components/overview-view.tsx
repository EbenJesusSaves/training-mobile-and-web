// Course version (lesson 07) — becomes the full RailPass version in lesson 10.
import { EmptyState } from '../../../shared/ui/empty-state';
import { PageHeader } from '../../../shared/ui/page-header';

export function OverviewView() {
  return (
    <>
      <PageHeader title="Operations overview" description="High-level network numbers arrive after the query layer." />
      <EmptyState
        title="Real data arrives in lesson 10"
        description="This route is wired now so navigation can grow before the API layer lands."
      />
    </>
  );
}
