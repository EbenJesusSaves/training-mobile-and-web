// Course version (lesson 07) — becomes the full RailPass version in lesson 10.
import { EmptyState } from '../../../shared/ui/empty-state';
import { PageHeader } from '../../../shared/ui/page-header';

export function JourneyDetailView({ journeyId }: { journeyId: string }) {
  return (
    <>
      <PageHeader title={`Journey ${journeyId}`} description="The route param is visible before detail queries arrive." />
      <EmptyState
        title="Real data arrives in lesson 10"
        description="This route is wired now; id is visible in the URL so navigation can grow before the API layer lands."
      />
    </>
  );
}
