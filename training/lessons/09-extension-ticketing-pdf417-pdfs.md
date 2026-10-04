# Extension A — Ticketing, PDF417 and PDFs

**Estimated duration:** 60 minutes

## Learning objectives

Learners can explain why the API generates PDF417 barcode matrices, how the mobile app draws them, and how ticket PDFs reuse the same data.

## Relevant code paths

- `backend/src/bookings/barcode.ts`
- `mobile/features/tickets/barcode.tsx`
- `mobile/features/tickets/ticket-card.tsx`
- `mobile/features/tickets/ticket-pdf.ts`
- `mobile/constants/drawing.ts`
- `mobile/constants/colors.ts`

## Real snippets to read aloud

The API keeps the barcode encoder out of the mobile bundle:

```ts
export function pdf417Matrix(payload: string): BarcodeMatrix {
  const options = { bcid: 'pdf417', text: payload, columns: 4, eclevel: 2 };
  const [symbol] = bwipjs.raw(options) as unknown as { pixs: number[]; pixx: number }[];
  return { format: 'PDF417', payload, columns: symbol.pixx, rows };
}
```

The app draws dark-module runs into one Skia path:

```tsx
matrix.rows.forEach((row, rowIndex) => {
  let runStart = -1;
  for (let column = 0; column <= row.length; column += 1) {
    const dark = row[column] === DARK_MODULE;
```

The PDF ticket uses the same matrix as SVG:

```ts
return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="${ticketColors.ink}">${rects.join('')}</svg>`;
```

## What we chose / Why / Trade-offs / When we'd choose differently

| What | Why | Trade-off | Choose differently when |
| --- | --- | --- | --- |
| Server barcode matrix | Avoids shipping a large encoder to mobile | Backend owns barcode format | Offline ticket creation would need local generation |
| One Skia path | Efficient drawing | More path-building logic | SVG/native image is simpler if performance is fine |
| Black-on-white ticket | Scannable in both themes | Ticket does not fully inherit theme | Branded non-scannable cards can use theme colours |

## Activities

- **Demo:** Open a ticket, compare `TicketCard` and exported PDF.
- **Prediction:** If barcode rows are drawn as hundreds of React Native `View`s, rendering becomes heavier and harder to keep crisp.
- **Debugging:** A barcode does not scan. Check payload, matrix dimensions, row-height/module-width scaling and PDF white background.
- **Code review:** Verify `ticketColors` and `pdfTicketGeometry` are used instead of raw CSS values.
- **Challenge:** Add a small “copy ticket code” affordance with an accessible label and no barcode changes.

## Facilitator guidance

Keep this extension concrete. Learners do not need to understand PDF417 internals; they need to understand bundle-size, API contract, drawing and accessibility trade-offs.
