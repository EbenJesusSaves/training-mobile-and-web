import { JourneyDetailView } from '../../features/journeys/components/journey-detail-view';

export function Component() {
  // LIVE 07.7 — Read journeyId from the URL and pass it to the detail view.
  const journeyId = 'prototype';
  return <JourneyDetailView journeyId={journeyId} />;
}
