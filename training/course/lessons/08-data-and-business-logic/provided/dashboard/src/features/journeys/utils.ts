import { railDomain } from '../../shared/constants';

export function getCompartmentSeatOrder(_compartmentIndex: number) {
  // LIVE 08.5 — Return compartment seat numbers in row-by-row display order.
  return Array.from({ length: railDomain.seatsPerCompartment }, (_, index) => index + railDomain.firstSeatNumber);
}
