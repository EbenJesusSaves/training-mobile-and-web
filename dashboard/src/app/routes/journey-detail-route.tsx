import { useParams } from 'react-router';

import { JourneyDetailView } from '../../features/journeys/components/journey-detail-view';

export function Component() {
  const { journeyId } = useParams();
  return journeyId ? <JourneyDetailView journeyId={journeyId} /> : null;
}
