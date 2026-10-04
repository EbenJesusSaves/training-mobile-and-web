import bwipjs from 'bwip-js';

export interface BarcodeMatrix {
  format: 'PDF417';
  /** Text encoded in the symbol, so scanners and staff tools can look the ticket up. */
  payload: string;
  columns: number;
  /** Each row is a string of "1" (bar) and "0" (space) modules. Draw rows ~3× taller than modules are wide. */
  rows: string[];
}

/**
 * Generated on the server so the mobile bundle does not need a ~2 MB barcode library.
 * The matrix is tiny (~1 KB) and easy to draw with Skia, SVG or HTML.
 */
export function pdf417Matrix(payload: string): BarcodeMatrix {
  // PDF417-specific options (columns, eclevel) are not in bwip-js's TypeScript option type.
  const options = { bcid: 'pdf417', text: payload, columns: 4, eclevel: 2 };
  const [symbol] = bwipjs.raw(options) as unknown as {
    pixs: number[];
    pixx: number;
  }[];
  const rows: string[] = [];
  for (let start = 0; start < symbol.pixs.length; start += symbol.pixx) {
    rows.push(symbol.pixs.slice(start, start + symbol.pixx).join(''));
  }
  return { format: 'PDF417', payload, columns: symbol.pixx, rows };
}

export const ticketPayload = (reference: string, ticketCode: string) => `RAILPASS|${reference}|${ticketCode}`;
