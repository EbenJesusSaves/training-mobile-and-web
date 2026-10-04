import { Button } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

import { parseApiError } from '../api/errors';
import { iconSizes, spacingKeys } from '../constants';

import styles from './states.module.css';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const parsed = parseApiError(error);
  return (
    <div className={styles.state} role="alert">
      <div>
        <div className={styles.icon}>
          <IconAlertTriangle size={iconSizes.xxl} />
        </div>
        <h2 className={styles.title}>We could not load this data</h2>
        <p className={styles.description}>{parsed.message}</p>
        {onRetry ? (
          <Button mt={spacingKeys.md} variant="light" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    </div>
  );
}
