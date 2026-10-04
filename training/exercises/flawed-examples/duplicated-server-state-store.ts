// DELIBERATELY FLAWED – teaching example, not used by the apps.
// Problem: server journey data is copied into a client store and can go stale.

type Journey = { id: string; availableSeats: number; departureAt: string };

const store = {
  journeys: [] as Journey[],
  setJourneys(next: Journey[]) {
    this.journeys = next;
  },
  markSeatTaken(journeyId: string) {
    this.journeys = this.journeys.map((journey) =>
      journey.id === journeyId ? { ...journey, availableSeats: journey.availableSeats - 1 } : journey,
    );
  },
};

export async function loadJourneys(api: { searchJourneys(): Promise<Journey[]> }) {
  store.setJourneys(await api.searchJourneys());
  return store.journeys;
}
