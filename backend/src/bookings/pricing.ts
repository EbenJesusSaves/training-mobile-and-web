import type { SegmentDirection, TravelClass } from '../generated/prisma/client.js';

export interface PricedSegment {
  direction: SegmentDirection;
  travelClass: TravelClass;
  unitFareCents: number;
  label: string;
}

export interface PricedAddOn {
  code: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

export interface PriceLine {
  kind: 'FARE' | 'ADD_ON';
  label: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
}

export interface PriceBreakdown {
  lines: PriceLine[];
  fareTotalCents: number;
  addOnTotalCents: number;
  totalCents: number;
}

/**
 * Pure pricing function: the only place totals are calculated. Clients never send prices;
 * they send selections, and the server prices them from the database.
 */
export function calculatePrice(passengerCount: number, segments: PricedSegment[], addOns: PricedAddOn[]): PriceBreakdown {
  if (!Number.isInteger(passengerCount) || passengerCount < 1) throw new Error('passengerCount must be a positive integer');

  const fareLines: PriceLine[] = segments.map((segment) => ({
    kind: 'FARE',
    label: segment.label,
    quantity: passengerCount,
    unitPriceCents: segment.unitFareCents,
    totalCents: segment.unitFareCents * passengerCount,
  }));
  const addOnLines: PriceLine[] = addOns
    .filter((addOn) => addOn.quantity > 0)
    .map((addOn) => ({
      kind: 'ADD_ON',
      label: addOn.name,
      quantity: addOn.quantity,
      unitPriceCents: addOn.unitPriceCents,
      totalCents: addOn.unitPriceCents * addOn.quantity,
    }));

  const fareTotalCents = fareLines.reduce((sum, line) => sum + line.totalCents, 0);
  const addOnTotalCents = addOnLines.reduce((sum, line) => sum + line.totalCents, 0);
  return { lines: [...fareLines, ...addOnLines], fareTotalCents, addOnTotalCents, totalCents: fareTotalCents + addOnTotalCents };
}
