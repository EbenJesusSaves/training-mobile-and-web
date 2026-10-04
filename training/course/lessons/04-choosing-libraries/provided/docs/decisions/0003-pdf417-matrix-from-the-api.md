# 0003 · The API draws the ticket barcode; the app only paints it

- **Status:** accepted
- **Applies to:** 📱 mobile (tickets and the PDF export)

## Context

Every ticket shows a wide PDF417 2-D barcode that staff can scan, and the passenger can export the ticket as a PDF.
A PDF417 encoder for React Native (bwip-js) adds about 2 MB of JavaScript to the bundle that every user downloads,
for one small feature.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| Encode on the device (bwip-js) | No API dependency for the symbol | ~2 MB of JavaScript for every user; slower start-up |
| API returns a PNG image | Simple to show | Blurry when scaled; another network request; harder to recolour |
| API returns the module matrix | ~1 KB with each ticket; crisp at any size | The app depends on the matrix shape |

## Chosen

The API encodes the symbol and returns a small matrix with each ticket (`BarcodeMatrix` in `mobile/api/types.ts`:
`format`, `payload`, `columns`, `rows`). `mobile/features/tickets/barcode.tsx` merges the dark modules of each row
into rectangles of a single Skia path, so the whole barcode is one draw call. `mobile/features/tickets/ticket-pdf.ts`
embeds the same matrix as SVG (`barcodeSvg`).

## Why

- About 1 KB per ticket instead of about 2 MB for every user.
- Pixel-perfect at any size, on screen and in the PDF, from one source of truth.

## Trade-offs

- The client trusts the API's encoding: a format change needs an API change first.
- The barcode arrives with the ticket, so a ticket the app hasn't loaded since it started can't show one offline
  (the mobile query cache lives in memory). Saving the PDF is the offline copy.

## Choose differently when

- Tickets must be generated fully offline, or by a device that never talks to this API.
- You need several barcode formats on the client and an encoder you already ship.
