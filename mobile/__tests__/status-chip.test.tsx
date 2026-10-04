import { render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { StatusChip } from '@/components/ui/display/status-chip';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}));

describe('StatusChip', () => {
  it('announces the status in words, not just colour', async () => {
    await render(
      <ThemeProvider>
        <StatusChip kind="DELAYED" suffix="+25 min" />
      </ThemeProvider>,
    );
    expect(await screen.findByLabelText('Delayed +25 min')).toBeTruthy();
    expect(screen.getByText('Delayed +25 min')).toBeTruthy();
  });
});
