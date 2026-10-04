import { calculatePrice } from './pricing.js';

describe('calculatePrice', () => {
  const outbound = { direction: 'OUTBOUND' as const, travelClass: 'FIRST' as const, unitFareCents: 17_500, label: 'Outbound' };
  const inbound = { direction: 'RETURN' as const, travelClass: 'SECOND' as const, unitFareCents: 11_500, label: 'Return' };

  it('multiplies each segment fare by the number of passengers', () => {
    const price = calculatePrice(2, [outbound], []);
    expect(price.fareTotalCents).toBe(35_000);
    expect(price.totalCents).toBe(35_000);
    expect(price.lines).toEqual([expect.objectContaining({ kind: 'FARE', quantity: 2, totalCents: 35_000 })]);
  });

  it('adds round-trip legs and extras', () => {
    const price = calculatePrice(1, [outbound, inbound], [{ code: 'EXTRA_LUGGAGE', name: 'Extra Luggage', unitPriceCents: 3_500, quantity: 1 }]);
    expect(price.fareTotalCents).toBe(29_000);
    expect(price.addOnTotalCents).toBe(3_500);
    expect(price.totalCents).toBe(32_500);
  });

  it('ignores extras with a zero quantity', () => {
    const price = calculatePrice(1, [outbound], [{ code: 'MEAL', name: 'Meal', unitPriceCents: 4_500, quantity: 0 }]);
    expect(price.lines).toHaveLength(1);
    expect(price.addOnTotalCents).toBe(0);
  });

  it('rejects an invalid passenger count', () => {
    expect(() => calculatePrice(0, [outbound], [])).toThrow();
  });
});
