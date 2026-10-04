# Extension B — Dashboard operations patterns

**Estimated duration:** 60 minutes

## Learning objectives

Learners can extend the staff dashboard while respecting Redux/TanStack boundaries, Mantine theming and CSS Module token usage.

## Relevant code paths

- `dashboard/src/features/journeys/components/journeys-view.tsx`
- `dashboard/src/features/journeys/components/journey-form.tsx`
- `dashboard/src/features/bookings/components/bookings-view.tsx`
- `dashboard/src/features/bookings/api/booking-queries.ts`
- `dashboard/src/shared/ui/data-table.tsx`
- `dashboard/src/styles/tokens.css`

## Real snippets to read aloud

Filters are local input state; server data stays in Query:

```tsx
const [status, setStatus] = useState('');
const journeys = useJourneys({
  page,
  pageSize: pageSizes.default,
  search: debouncedSearch,
  when,
  status: (status || undefined) as JourneyStatus | undefined,
});
```

The table consumes UI state without owning server data:

```tsx
const density = useAppSelector((state) => state.ui.tableDensity);
```

## What we chose / Why / Trade-offs / When we'd choose differently

| What               | Why                                                | Trade-off                  | Choose differently when                              |
| ------------------ | -------------------------------------------------- | -------------------------- | ---------------------------------------------------- |
| Mantine components | Accessible defaults and fast dashboard development | Must align with tokens     | Fully custom design systems may wrap every primitive |
| CSS Modules        | Scoped layout styles                               | Token discipline is manual | CSS-in-JS may enforce tokens through types           |
| Query mutations    | Built-in pending/error state and invalidation      | Query keys need care       | Simple local-only edits need no server mutation      |

## Activities

- **Demo:** Add a temporary column to the journeys table in the editor and identify required API fields.
- **Prediction:** If table density is added to the journeys query key, changing density causes unnecessary refetching.
- **Debugging:** A notification says success but the table stays stale; inspect invalidated query keys.
- **Code review:** Check CSS Modules for raw `px` or hex values.
- **Challenge:** Add a dashboard filter or column using existing constants and query invalidation patterns.

## Facilitator guidance

Use live screenshots from `.artifacts/dashboard/` to connect code with visual states. Keep learners focused on dashboard-specific boundaries rather than re-teaching mobile patterns.
