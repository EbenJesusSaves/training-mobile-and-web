import { apiClient } from './client';

import type { Booking, BookingRequest, BookingScope, Quote, QuoteRequest } from './types';

export const bookingsApi = {
  quote: (body: QuoteRequest) => apiClient.post<Quote>('/bookings/quote', body).then((r) => r.data),
  /** Simulated checkout: the API creates a real booking; no payment is taken. */
  create: (body: BookingRequest) => apiClient.post<Booking>('/bookings', body).then((r) => r.data),
  list: (scope: BookingScope, signal?: AbortSignal) =>
    apiClient.get<Booking[]>('/bookings', { params: { scope }, signal }).then((r) => r.data),
  get: (id: string, signal?: AbortSignal) => apiClient.get<Booking>(`/bookings/${id}`, { signal }).then((r) => r.data),
  cancel: (id: string) => apiClient.post<Booking>(`/bookings/${id}/cancel`).then((r) => r.data),
};
