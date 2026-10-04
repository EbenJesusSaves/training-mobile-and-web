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

export function seatPositions(_compartments: number): SeatPosition[] {
  // LIVE 08.1 — Derive seat positions from car compartments.
  return [];
}

export const seatKey = (carNumber: number, seatNumber: number) => `${carNumber}-${seatNumber}`;
