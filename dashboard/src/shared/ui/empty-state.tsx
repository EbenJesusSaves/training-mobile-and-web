import { IconInbox } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { iconSizes } from '../constants';

import styles from './states.module.css';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      <div>
        <div className={styles.icon}>
          <IconInbox size={iconSizes.xxl} />
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        {action}
      </div>
    </div>
  );
}
