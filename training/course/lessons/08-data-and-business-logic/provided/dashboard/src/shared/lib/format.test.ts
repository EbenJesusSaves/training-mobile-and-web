import { describe, expect, it } from 'vitest';

import { datetimeLocalToIso, formatDateTime, formatMoney } from './format';

describe('format helpers', () => {
  it('formats pesewas as Ghana cedi', () => {
    // LIVE 08.6 — Add one money-formatting example that protects integer-pesewa math.
    expect(formatMoney(12345)).toContain('TODO');
  });

  it('treats datetime-local values as UTC/GMT', () => {
    expect(datetimeLocalToIso('2026-10-05T09:30')).toBe('2026-10-05T09:30:00.000Z');
    expect(formatDateTime('2026-10-05T09:30:00.000Z')).toContain('09:30');
  });
});
