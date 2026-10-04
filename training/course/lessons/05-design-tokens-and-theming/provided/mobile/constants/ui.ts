/** Small behavioural UI constants shared across screens. */
export const ui = {
  /** Placeholder counts while lists load. */
  skeletonCount: { cards: 2, list: 3, rows: 4 },
  /** "Try the next day" moves the search by this many days. */
  dayStep: 1,
  stepperStep: 1,
  routeConnectorDots: 7,
  /** Chips kept to the left of the selected date so neighbours peek in. */
  dateStripLeadingChips: 2,
  cityGridColumns: 2,
} as const;

/** Builds `[0, 1, …, count-1]` for rendering placeholder rows. */
export const placeholderKeys = (count: number) => Array.from({ length: count }, (_, index) => index);
