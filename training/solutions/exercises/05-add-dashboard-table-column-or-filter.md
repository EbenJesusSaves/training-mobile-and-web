# Solution — Exercise 05: Add a dashboard table column or filter

## Corrected code pattern

Keep filters as input state and pass them into the server-state hook:

```tsx
const [status, setStatus] = useState('');
const journeys = useJourneys({
  page,
  pageSize: pageSizes.default,
  search: debouncedSearch,
  status: (status || undefined) as JourneyStatus | undefined,
});
```

Add columns using existing DTO fields and tokenized components:

```tsx
<DataTable.Th>Seats</DataTable.Th>
<DataTable.Td>{journey.availableSeats}/{journey.totalSeats}</DataTable.Td>
```

## Explanation

Dashboard server data belongs to TanStack Query. Redux owns session and UI preferences only. A new filter should affect the query key in `useJourneys` and request params in the API module.

## Discussion points

- Does the column need a backend field, or is it derived from existing fields?
- Does the filter reset pagination to page 1?
- What query should be invalidated after mutations that affect the column?

import {create } from 'zustand'

const useVacation = create((set)) => ({
vacations: 200,
reduceVac: ()=> set((state)=> ({vacation: state.vacation - 10}))

})
