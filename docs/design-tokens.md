# RailPass design tokens

Both frontends use the same visual language. Values were sampled from the supplied mobile
references (light theme) and adapted for the requested dark theme, where the green/lime brand
accent becomes red.

- Mobile implementation: `mobile/components/theme/tokens.ts`
- Dashboard implementation: `dashboard/src/styles/tokens.css` (CSS variables) + `dashboard/src/app/theme.ts` (Mantine)

## Typeface

**Plus Jakarta Sans** (SIL OFL 1.1), weights 400 / 500 / 600 / 700. It is the closest open-licence match
to the geometric sans in the references. Font files and licence live in each app's `assets/fonts`.

| Role                                   | Size / line height | Weight |
| -------------------------------------- | ------------------ | ------ |
| Display (screen title, “Book Tickets”) | 28 / 34            | 600    |
| Title (route, “Choose a Seat” header)  | 22 / 28            | 600    |
| Heading (section title, “The Fastest”) | 18 / 24            | 600    |
| Body strong (values)                   | 14 / 20            | 600    |
| Body                                   | 14 / 20            | 500    |
| Caption (labels, sub-text)             | 11–12 / 14–16      | 500    |

The mobile app uses this smaller scale; the dashboard keeps its own sizes in `dashboard/src/constants/typography.ts`.

## Colour

The mobile app has no background gradients or glows: screens sit on a flat `canvas`, cards are
solid `surfaceRaised` with a hairline `line` border.

| Token            | Light           | Dark (red adaptation) | Used for                                                      |
| ---------------- | --------------- | --------------------- | ------------------------------------------------------------- |
| `canvas`         | `#F5F5F7`       | `#0C0B0B`             | Screen background                                             |
| `surface`        | `#F0F0F3`       | `#171515`             | Secondary fills (station codes, chips)                        |
| `surfaceRaised`  | `#FFFFFF`       | `#1F1C1C`             | Cards, date chips, sheets, bottom bars                        |
| `controlActive`  | `#FFFFFF`       | `#2E2A2A`             | Selected segment                                              |
| `ink`            | `#111113`       | `#F6F3F3`             | Primary text                                                  |
| `inkSecondary`   | `#5C5C66`       | `#B9B1B1`             | Secondary text                                                |
| `inkMuted`       | `#8E8E96`       | `#847B7B`             | Labels, captions                                              |
| `line`           | `#E5E5EA`       | `#2A2626`             | Dividers, outlines                                            |
| `inverse`        | `#111113`       | `#050404`             | Journey card, selected date, ticket screen                    |
| `inverseRaised`  | `#1E1E22`       | `#2A1416`             | Class row inside a journey card                               |
| `onInverse`      | `#FFFFFF`       | `#FFFFFF`             | Text on inverse surfaces                                      |
| `onInverseMuted` | `#9A9AA3`       | `#A99595`             | Muted text on inverse surfaces                                |
| `accent`         | `#7EE6A0`       | `#FF4D5A`             | Primary buttons, available seats, journey line                |
| `accentStrong`   | `#4FCB7B`       | `#FF6B76`             | Timeline dots, focus rings                                    |
| `onAccent`       | `#0B120D`       | `#140405`             | Text/icons on accent (dark text keeps ≥ 6:1 contrast on both) |
| `accentSoft`     | `#E3F7EA`       | `#3A1418`             | Tinted backgrounds, badges                                    |
| `danger`         | `#C8372D`       | `#FFB4A9`             | Errors and destructive actions (always with icon + label)     |
| `dangerSoft`     | `#FDECEA`       | `#3B1D1A`             | Error banners                                                 |
| `warning`        | `#B76E00`       | `#FFC46B`             | Delays                                                        |
| `seatTaken`      | `#DEDEE2` hatch | `#3A3535` hatch       | Unavailable seats (shape, never colour alone)                 |

### Why the dark accent is `#FF4D5A`

A pure red (`#FF0000`) vibrates on near-black and fails contrast with dark text. `#FF4D5A` is a slightly
warm, lighter red: dark text on it measures about 6:1, and it reads clearly against `#0C0B0B` without
glowing. Dark surfaces are neutral (not green-tinted); only the journey-card class row picks up a
faint red tint.

### Keeping states distinguishable from the red brand accent

- **Errors / destructive actions** use `danger` (a pale salmon in dark mode, not the brand red),
  an alert or trash icon, explicit wording ("Cancel booking"), and an outlined or tinted shape
  rather than a filled accent button.
- **Unavailable seats** are hatched grey squares with no number; available seats are filled with
  the accent and show their number; the selected seat is inverse (black/white) with a backrest bar.
- **Booking states** are chips with icons: Confirmed (check), Checked in (badge-check),
  Cancelled (x, muted), Delayed (clock, `warning`), Journey cancelled (ban icon + label).

## Shape and spacing

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40.
- Radii: chips/inputs 16, cards 24, journey card 28, ticket 22, pills 999.
- Touch targets ≥ 44 pt.
