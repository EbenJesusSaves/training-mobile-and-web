import { Table } from '@mantine/core';
import type { CSSProperties, ReactNode } from 'react';

import { componentSizes, spacingKeys } from '../constants';

import styles from './data-table.module.css';

interface DataTableProps {
  children: ReactNode;
  minWidth?: number;
}

type TableStyle = CSSProperties & { '--rp-data-table-min-width': string };

function DataTableRoot({ children, minWidth = componentSizes.tableMinWidth }: DataTableProps) {
  const style: TableStyle = { '--rp-data-table-min-width': `${minWidth}px` };

  return (
    <div className={styles.wrapper} style={style}>
      <div className={styles.scroll}>
        <Table className={styles.table} verticalSpacing={spacingKeys.md} horizontalSpacing={spacingKeys.lg} highlightOnHover>
          {children}
        </Table>
      </div>
    </div>
  );
}

export const DataTable = Object.assign(DataTableRoot, {
  Head: Table.Thead,
  Body: Table.Tbody,
  Row: Table.Tr,
  Th: Table.Th,
  Td: Table.Td,
});
