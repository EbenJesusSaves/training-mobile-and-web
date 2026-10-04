import { describe, expect, it } from 'vitest';

import { railDomain } from '../../shared/constants';
import { getCompartmentSeatOrder } from './utils';

const firstCompartment = [
  railDomain.firstSeatNumber,
  railDomain.firstSeatNumber + railDomain.seatRows,
  railDomain.firstSeatNumber + railDomain.firstSeatNumber,
  railDomain.firstSeatNumber + railDomain.seatRows + railDomain.firstSeatNumber,
  railDomain.seatRows,
  railDomain.seatsPerCompartment,
];

const secondCompartment = firstCompartment.map((seatNumber) => seatNumber + railDomain.seatsPerCompartment);

describe('getCompartmentSeatOrder', () => {
  it('returns mobile/API column-major seats in render order', () => {
    expect(getCompartmentSeatOrder(0)).toEqual(firstCompartment);
    expect(getCompartmentSeatOrder(railDomain.firstSeatNumber)).toEqual(secondCompartment);
  });
});
