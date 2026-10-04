import { describe, it } from 'vitest';

import { render } from '../../../testing';
import { BookingStatusBadge } from './booking-status-badge';

describe('BookingStatusBadge', () => {
  it('renders an accessible checked-in label', () => {
    render(<BookingStatusBadge status="CHECKED_IN" />);
    // LIVE 15.6 — Assert the checked-in label is visible.
    throw new Error('LIVE 15.6 — add visible label assertion');
  });
});
