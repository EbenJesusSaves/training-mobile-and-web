# Lesson B · Tickets: PDF417 and PDF export — 📱 Mobile

> This optional guide reads the finished ticketing code. Learners see why the API owns barcode data while the app renders and exports it.

## What arrives

Nothing. This extension copies no mobile files.

## Talk through (together)

1. **`mobile/api/types.ts`: barcode contract.** Ask: what does `BarcodeMatrix` contain? Answer: `format: 'PDF417'`, matrix dimensions, rows and payload from the API.
2. **`mobile/features/tickets/barcode.tsx`: renderer, not encoder.** Ask: why draw API-provided matrix rows? Answer: the backend owns validity and payload rules; the app makes the matrix visible.
3. **`mobile/features/tickets/ticket-pdf.ts`: export boundary.** Ask: what belongs in PDF code? Answer: rendering the existing ticket data for sharing, not inventing ticket validity.
4. **`mobile/features/tickets/ticket-card.tsx`: theme boundary.** Ask: why keep tickets high-contrast? Answer: scannability and legibility beat theme decoration.

## Live tasks

There is no mobile LIVE task. Use `kata/mobile/ticket-export-kata.md` to explain why the app renders barcode matrix data from the API instead of re-encoding ticket data on the device.

## Checkpoint

Read `mobile/features/tickets/barcode.tsx`, `mobile/features/tickets/ticket-card.tsx`, `mobile/features/tickets/ticket-pdf.ts` and `mobile/api/types.ts`. Commands: `lesson status B` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

Nothing.
