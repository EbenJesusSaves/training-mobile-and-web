import { addDays, buildDateChips } from '@/libs/dates';
import { seatPositions } from '@/libs/seat-layout';

describe('dates', () => {
  it('adds days across month boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
  });

  it('builds date chips for the strip', () => {
    const chips = buildDateChips('2026-10-03', 3);
    expect(chips.map((chip) => `${chip.day} ${chip.month}`)).toEqual(['3 Oct', '4 Oct', '5 Oct']);
  });
});

describe('seat layout', () => {
  it('numbers seats per compartment: left column then right column', () => {
    const seats = seatPositions(2);
    expect(seats).toHaveLength(12);
    expect(seats[1]).toEqual({ seatNumber: 2, compartment: 0, column: 0, row: 1 });
    expect(seats[5]).toEqual({ seatNumber: 6, compartment: 0, column: 1, row: 2 });
    // LIVE 08.2 — Pin the first seat of the second compartment: seat 7 starts again at column 0, row 0.
    throw new Error('Write this assertion (task 08.2).');
  });
});
