# Mobile kata · Tickets and PDF417

Read `features/tickets/barcode.tsx`, `features/tickets/ticket-card.tsx`, and `features/tickets/ticket-pdf.ts`.

## Exercise
Explain why the app renders the barcode from API-provided matrix data instead of re-encoding ticket data on the device.

## Answer key
The backend owns ticket validity and barcode payload rules. The app is a renderer/exporter, so mobile and dashboard stay consistent and offline display cannot invent a valid ticket.
