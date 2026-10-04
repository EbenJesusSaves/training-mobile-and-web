// DELIBERATELY FLAWED – teaching example, not used by the apps.
// Problem: fetches a seat map once, never refetches on focus, never polls, never reconciles selected seats.

import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

type SeatMap = { takenSeats: number[] };

export function StaleSeatMap({ journeyId, api }: { journeyId: string; api: { seatMap(id: string): Promise<SeatMap> } }) {
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);

  useEffect(() => {
    void api.seatMap(journeyId).then(setSeatMap);
  }, []);

  return <View>{seatMap?.takenSeats.map((seat) => <Text key={seat}>Seat {seat} taken</Text>)}</View>;
}
