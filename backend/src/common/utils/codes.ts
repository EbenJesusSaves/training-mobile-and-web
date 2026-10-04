import { randomInt } from 'node:crypto';

const TICKET_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Human-friendly booking reference, e.g. TRN-2026-482913. Uniqueness is enforced by the database. */
export function createBookingReference(now = new Date()): string {
  return `TRN-${now.getUTCFullYear()}-${String(randomInt(0, 1_000_000)).padStart(6, '0')}`;
}

/** Ticket code printed in the QR code, e.g. RP-7KQ4-M2XD. */
export function createTicketCode(): string {
  const chunk = () => Array.from({ length: 4 }, () => TICKET_ALPHABET[randomInt(0, TICKET_ALPHABET.length)]).join('');
  return `RP-${chunk()}-${chunk()}`;
}
