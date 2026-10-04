import { railDomain } from '../../shared/constants';

export function getCompartmentSeatOrder(compartmentIndex: number) {
  const firstSeat = compartmentIndex * railDomain.seatsPerCompartment + railDomain.firstSeatNumber;
  return Array.from({ length: railDomain.seatRows }, (_, rowIndex) =>
    Array.from({ length: railDomain.seatColumns }, (_, columnIndex) => firstSeat + columnIndex * railDomain.seatRows + rowIndex),
  ).flat();
}
