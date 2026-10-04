import { describe, expect, it } from 'vitest';

import { datetimeLocalToIso, formatDateTime, formatMoney } from './format';

describe('format helpers', () => {
  it('formats pesewas as Ghana cedi', () => {
    expect(formatMoney(12345)).toContain('123.45');
  });

  it('treats datetime-local values as UTC/GMT', () => {
    expect(datetimeLocalToIso('2026-10-05T09:30')).toBe('2026-10-05T09:30:00.000Z');
    expect(formatDateTime('2026-10-05T09:30:00.000Z')).toContain('09:30');
  });
});
