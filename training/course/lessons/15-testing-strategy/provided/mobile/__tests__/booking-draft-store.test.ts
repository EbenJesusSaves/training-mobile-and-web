import { buildBookingRequest, useBookingDraftStore } from '@/store/booking-draft-store';

import type { Journey } from '@/api/types';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}));

const station = (id: string) => ({ id, code: id.toUpperCase(), name: id, city: id, address: null, isActive: true });
const journey = {
  id: 'journey-1',
  classes: [{ travelClass: 'FIRST', fareCents: 17_500, totalSeats: 72, availableSeats: 40, airConditioned: true, carNumbers: [1, 2] }],
  origin: station('acc'),
  destination: station('ksi'),
} as unknown as Journey;

describe('booking draft store', () => {
  beforeEach(() => {
    useBookingDraftStore.setState({ passengerCount: 1, outbound: null, inbound: null, addOns: {}, tripType: 'ONE_WAY' });
  });

  it('replaces the seat when one passenger taps another seat', () => {
    const store = useBookingDraftStore.getState();
    store.chooseJourney('OUTBOUND', journey, 'FIRST');
    store.toggleSeat('OUTBOUND', { carNumber: 1, seatNumber: 6 });
    useBookingDraftStore.getState().toggleSeat('OUTBOUND', { carNumber: 1, seatNumber: 7 });
    // LIVE 15.1 — Assert that the second tap replaced the first: one passenger keeps only seat 7.
    throw new Error('Write this assertion (task 15.1).');
  });

  it('trims seats and extras when passengers are removed', () => {
    const store = useBookingDraftStore.getState();
    store.setPassengerCount(2);
    store.chooseJourney('OUTBOUND', journey, 'FIRST');
    useBookingDraftStore.getState().toggleSeat('OUTBOUND', { carNumber: 1, seatNumber: 1 });
    useBookingDraftStore.getState().toggleSeat('OUTBOUND', { carNumber: 1, seatNumber: 2 });
    useBookingDraftStore.getState().setAddOnQuantity('EXTRA_LUGGAGE', 2);
    useBookingDraftStore.getState().setPassengerCount(1);
    const state = useBookingDraftStore.getState();
    expect(state.outbound?.seats).toHaveLength(1);
    expect(state.addOns.EXTRA_LUGGAGE).toBe(1);
  });

  it('builds the API request without any prices', () => {
    const store = useBookingDraftStore.getState();
    store.chooseJourney('OUTBOUND', journey, 'FIRST');
    useBookingDraftStore.getState().toggleSeat('OUTBOUND', { carNumber: 1, seatNumber: 6 });
    useBookingDraftStore.getState().setAddOnQuantity('EXTRA_LUGGAGE', 1);
    const request = buildBookingRequest(useBookingDraftStore.getState());
    expect(request).toEqual({
      tripType: 'ONE_WAY',
      segments: [{ journeyId: 'journey-1', travelClass: 'FIRST', direction: 'OUTBOUND', seats: [{ carNumber: 1, seatNumber: 6 }] }],
      addOns: [{ code: 'EXTRA_LUGGAGE', quantity: 1 }],
    });
  });
});
