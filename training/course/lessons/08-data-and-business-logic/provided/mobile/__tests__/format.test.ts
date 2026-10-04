import { formatDuration, formatFare, formatMoney, formatTime, initials } from '@/libs/format';

describe('format', () => {
  it('formats pesewas as cedis with grouping', () => {
    expect(formatMoney(17_500)).toBe('GH₵175.00');
    expect(formatMoney(123_456_789)).toBe('GH₵1,234,567.89');
    expect(formatMoney(0)).toBe('GH₵0.00');
  });

  it('shows whole fares without decimals and signs extras', () => {
    expect(formatFare(17_500)).toBe('GH₵175');
    expect(formatFare(3_550)).toBe('GH₵35.50');
    expect(formatFare(3_500, { sign: true })).toBe('+GH₵35');
  });

  it('formats network (GMT) times regardless of the device time zone', () => {
    expect(formatTime('2026-10-05T07:25:00.000Z')).toBe('7:25 AM');
    expect(formatTime('2026-10-05T00:05:00.000Z')).toBe('12:05 AM');
    expect(formatTime('2026-10-05T17:10:00.000Z')).toBe('5:10 PM');
  });

  it('formats durations like the ticket design', () => {
    expect(formatDuration(190)).toBe('3h 10m');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(35)).toBe('35m');
  });

  it('builds initials for the avatar', () => {
    expect(initials('Ama  Owusu')).toBe('AO');
    expect(initials('kwame')).toBe('K');
  });
});
