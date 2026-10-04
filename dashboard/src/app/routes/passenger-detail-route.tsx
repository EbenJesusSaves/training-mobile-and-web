import { useParams } from 'react-router';

import { PassengerDetailView } from '../../features/passengers/components/passenger-detail-view';

export function Component() {
  const { passengerId } = useParams();
  return passengerId ? <PassengerDetailView passengerId={passengerId} /> : null;
}
