/**
 * Every car uses compartments of six seats: two facing columns of three.
 * Compartment k (0-based) holds seats 6k+1…6k+6: the left column top→bottom (6k+1, 6k+2, 6k+3)
 * and the right column top→bottom (6k+4, 6k+5, 6k+6). The backend uses the same numbering.
 */
export const SEATS_PER_COMPARTMENT = 6;

export interface SeatPosition {
  seatNumber: number;
  compartment: number;
  column: 0 | 1;
  row: 0 | 1 | 2;
}

export function seatPositions(compartments: number): SeatPosition[] {
  const seats: SeatPosition[] = [];
  for (let compartment = 0; compartment < compartments; compartment += 1) {
    for (let index = 0; index < SEATS_PER_COMPARTMENT; index += 1) {
      seats.push({
        seatNumber: compartment * SEATS_PER_COMPARTMENT + index + 1,
        compartment,
        column: index < 3 ? 0 : 1,
        row: (index % 3) as 0 | 1 | 2,
      });
    }
  }
  return seats;
}

export const seatKey = (carNumber: number, seatNumber: number) => `${carNumber}-${seatNumber}`;
