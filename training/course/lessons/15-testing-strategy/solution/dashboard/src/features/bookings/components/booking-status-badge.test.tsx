import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../testing';
import { BookingStatusBadge } from './booking-status-badge';

describe('BookingStatusBadge', () => {
  it('renders an accessible checked-in label', () => {
    render(<BookingStatusBadge status="CHECKED_IN" />);
    expect(screen.getByText('Checked in')).toBeTruthy();
  });
});
