import { notifications } from '@mantine/notifications';

import { parseApiError } from '../api/errors';

export function notifySuccess(message: string) {
  notifications.show({ color: 'rail', title: 'Saved', message });
}

export function notifyError(error: unknown, title = 'Request failed') {
  const parsed = parseApiError(error);
  notifications.show({ color: 'railDanger', title, message: parsed.message });
}
