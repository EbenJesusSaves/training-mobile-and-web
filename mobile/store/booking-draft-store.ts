import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { appConfig } from '@/config/app-config';
import { addDays, compareDateKeys, type DateKey, todayKey } from '@/libs/dates';
import { secureStorage } from '@/libs/secure-storage';

import type { BookingRequest, Direction, Journey, JourneySort, SeatRef, Station, TravelClass, TripType } from '@/api/types';

export interface SegmentDraft {
  journey: Journey;
  travelClass: TravelClass;
  seats: SeatRef[];
}

interface BookingDraftState {
  tripType: TripType;
  origin: Station | null;
  destination: Station | null;
  departDate: DateKey;
  returnDate: DateKey;
  sort: JourneySort;
  passengerCount: number;
  addOns: Record<string, number>;
  outbound: SegmentDraft | null;
  inbound: SegmentDraft | null;

  setTripType: (tripType: TripType) => void;
  setStation: (field: 'origin' | 'destination', station: Station) => void;
  swapStations: () => void;
  setDepartDate: (date: DateKey) => void;
  setReturnDate: (date: DateKey) => void;
  setSort: (sort: JourneySort) => void;
  chooseJourney: (direction: Direction, journey: Journey, travelClass: TravelClass) => void;
  setTravelClass: (direction: Direction, travelClass: TravelClass) => void;
  toggleSeat: (direction: Direction, seat: SeatRef) => void;
  removeSeats: (direction: Direction, seats: SeatRef[]) => void;
  setPassengerCount: (count: number) => void;
  setAddOnQuantity: (code: string, quantity: number) => void;
  startNewBooking: () => void;
}

const segmentKey = (direction: Direction) => (direction === 'OUTBOUND' ? 'outbound' : 'inbound');
const sameSeat = (a: SeatRef, b: SeatRef) => a.carNumber === b.carNumber && a.seatNumber === b.seatNumber;

/**
 * Client-side state for a booking in progress: what the passenger searched for and picked.
 * Prices shown from here are estimates; the API calculates the real total at checkout.
 */
export const useBookingDraftStore = create<BookingDraftState>()(
  persist(
    (set, get) => ({
      tripType: 'ONE_WAY',
      origin: null,
      destination: null,
      departDate: todayKey(),
      returnDate: addDays(todayKey(), appConfig.defaultReturnOffsetDays),
      sort: 'fastest',
      passengerCount: 1,
      addOns: {},
      outbound: null,
      inbound: null,

      setTripType: (tripType) => set({ tripType, inbound: null }),
      setStation: (field, station) =>
        set((state) => {
          const other = field === 'origin' ? state.destination : state.origin;
          // Picking the same station on both ends swaps them instead of creating an impossible search.
          if (other?.id === station.id) return { origin: state.destination, destination: state.origin, outbound: null, inbound: null };
          return { [field]: station, outbound: null, inbound: null };
        }),
      swapStations: () => set((state) => ({ origin: state.destination, destination: state.origin, outbound: null, inbound: null })),
      setDepartDate: (departDate) =>
        set((state) => ({
          departDate,
          returnDate: compareDateKeys(state.returnDate, departDate) < 0 ? departDate : state.returnDate,
          outbound: null,
          inbound: null,
        })),
      setReturnDate: (returnDate) => set({ returnDate, inbound: null }),
      setSort: (sort) => set({ sort }),

      chooseJourney: (direction, journey, travelClass) =>
        set((state) => {
          const current = state[segmentKey(direction)];
          const keepSeats = current?.journey.id === journey.id && current.travelClass === travelClass;
          return { [segmentKey(direction)]: { journey, travelClass, seats: keepSeats ? current.seats : [] } };
        }),
      setTravelClass: (direction, travelClass) =>
        set((state) => {
          const current = state[segmentKey(direction)];
          if (!current || current.travelClass === travelClass) return {};
          return { [segmentKey(direction)]: { ...current, travelClass, seats: [] } };
        }),
      toggleSeat: (direction, seat) =>
        set((state) => {
          const current = state[segmentKey(direction)];
          if (!current) return {};
          const isSelected = current.seats.some((item) => sameSeat(item, seat));
          let seats: SeatRef[];
          if (isSelected) seats = current.seats.filter((item) => !sameSeat(item, seat));
          // With all seats chosen, a new tap moves the earliest-picked seat (feels natural for one passenger).
          else if (current.seats.length >= state.passengerCount) seats = [...current.seats.slice(1), seat];
          else seats = [...current.seats, seat];
          return { [segmentKey(direction)]: { ...current, seats } };
        }),
      removeSeats: (direction, seats) =>
        set((state) => {
          const current = state[segmentKey(direction)];
          if (!current) return {};
          return {
            [segmentKey(direction)]: { ...current, seats: current.seats.filter((item) => !seats.some((seat) => sameSeat(seat, item))) },
          };
        }),
      setPassengerCount: (count) =>
        set((state) => {
          const passengerCount = Math.min(Math.max(count, 1), appConfig.maxPassengers);
          const trim = (segment: SegmentDraft | null) => (segment ? { ...segment, seats: segment.seats.slice(0, passengerCount) } : null);
          const addOns = Object.fromEntries(
            Object.entries(state.addOns).map(([code, quantity]) => [code, Math.min(quantity, passengerCount)]),
          );
          return { passengerCount, outbound: trim(state.outbound), inbound: trim(state.inbound), addOns };
        }),
      setAddOnQuantity: (code, quantity) =>
        set((state) => ({ addOns: { ...state.addOns, [code]: Math.min(Math.max(quantity, 0), get().passengerCount) } })),
      startNewBooking: () => set({ outbound: null, inbound: null, addOns: {}, passengerCount: 1 }),
    }),
    {
      // Only the last route is remembered between launches; selections are always fresh.
      name: 'railpass.last-search',
      storage: createJSONStorage(() => secureStorage),
      partialize: ({ origin, destination }) => ({ origin, destination }),
    },
  ),
);

/** Builds the API request from the draft (without passenger names, which checkout adds). */
export function buildBookingRequest(state: Pick<BookingDraftState, 'tripType' | 'outbound' | 'inbound' | 'addOns'>): BookingRequest | null {
  if (!state.outbound) return null;
  if (state.tripType === 'ROUND_TRIP' && !state.inbound) return null;
  const segments = [
    { direction: 'OUTBOUND' as const, draft: state.outbound },
    ...(state.tripType === 'ROUND_TRIP' && state.inbound ? [{ direction: 'RETURN' as const, draft: state.inbound }] : []),
  ];
  return {
    tripType: state.tripType,
    segments: segments.map(({ direction, draft }) => ({
      journeyId: draft.journey.id,
      travelClass: draft.travelClass,
      direction,
      seats: draft.seats,
    })),
    addOns: Object.entries(state.addOns)
      .filter(([, quantity]) => quantity > 0)
      .map(([code, quantity]) => ({ code, quantity })),
  };
}

export const fareFor = (segment: SegmentDraft) =>
  segment.journey.classes.find((item) => item.travelClass === segment.travelClass)?.fareCents ?? 0;
