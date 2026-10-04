// DELIBERATELY FLAWED – teaching example, not used by the apps.
// Problem: trusts a client-calculated total instead of sending selections for server pricing.

type Seat = { fareCents: number };

export function buildUnsafeBookingRequest(seats: Seat[], addOnCents: number) {
  const totalCents = seats.reduce((sum, seat) => sum + seat.fareCents, 0) + addOnCents;
  return {
    tripType: 'ONE_WAY',
    seats,
    totalCents,
  };
}
