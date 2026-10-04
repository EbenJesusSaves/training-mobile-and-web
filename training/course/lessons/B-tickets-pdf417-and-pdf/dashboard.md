# Lesson B · Tickets: PDF417 and PDF export — 🖥️ Dashboard

## Goal
Learners connect ticketing ideas to dashboard boundaries without adding backend or PDF code to the course app.

## What arrives
| Path | Status | Why |
|---|---|---|
| `kata/dashboard/exercise.md`, `kata/dashboard/answer-key.md` | kata | Optional design exercise for where ticket export code would belong. |

## Talk through
- **`src/features/bookings/types.ts` — booking contract.** Ask: what data would a ticket need? Answer: passenger, booking, journey, seat, and validation identifiers.
- **`src/features/bookings/components/booking-detail-drawer.tsx` — action placement.** Ask: where would an export button live? Answer: near booking details, not in shared UI.
- **`src/shared/api/client.ts` — file download boundary.** Ask: where should authenticated downloads be configured? Answer: the shared client, with feature APIs requesting files.

## LIVE tasks
None. Use the kata to discuss architecture only.

## Checkpoint
The browser remains the completed dashboard; learners use the kata to discuss where a ticket export action would appear without adding PDF code. Commands: `lesson status B`, `yarn run check`.
