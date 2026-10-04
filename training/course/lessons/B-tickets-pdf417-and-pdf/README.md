# B · Tickets: PDF417 and PDF export

**Notes:** `/courses/scalable-mobile-and-web-apps/tickets-pdf417-and-pdf` on the course website · **Time:** 20 min ·
**Workspace changes:** none (reading guide and kata)

## Goal

Learners understand the ticket boundary: the API creates barcode truth, and clients render or export it.

## What happens

1. **Concept, about 4 min:** ticket validity is a backend contract; frontend code renders it.
2. **Mobile reading, about 7 min:** trace `Barcode`, `barcodeSvg`, `ticket-card.tsx` and `ticket-pdf.ts`.
3. **Dashboard reading, about 4 min:** discuss where an authenticated export action would belong.
4. **Kata, about 3 min:** answer the matrix-versus-encoder question.
5. **Checkpoint, about 2 min:** share the trust boundary.

## Kata

Use `kata/mobile/ticket-export-kata.md` and `kata/dashboard/exercise.md`. The mobile kata asks why barcode rendering uses the API matrix. The dashboard kata asks for one risk and a small frontend-only improvement.

## Checkpoint

- 📱 Learners can explain PDF417 matrix rendering and PDF export without moving validity to the device.
- 🖥️ Learners can place a dashboard export action without changing the backend.
- `yarn run check` passes.

## Common problems

- Do not suggest re-encoding ticket payloads on the device.
- Keep barcode and ticket print colours scannable, even in dark mode.
- Do not add backend or API changes in this extension.

## Facilitator notes

- Keep the discussion anchored to real files: `barcode.tsx`, `ticket-card.tsx` and `ticket-pdf.ts`.
- Connect this to lesson 08: clients send selections, not truth that the server must trust.
- If time is short, read only `barcode.tsx` and the kata answer key.

**Next:** extension C reviews dashboard operations patterns.
