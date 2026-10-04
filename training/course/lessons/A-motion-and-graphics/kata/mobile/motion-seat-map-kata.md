# Mobile kata · Motion and graphics

Trace `features/booking/seat-map.tsx`, `components/ui/display/journey-timeline.tsx`, `features/auth/travel-scene.tsx`, and `features/booking/success-mark.tsx`.

## Exercise
List three places where motion communicates state rather than decoration, then sketch how you would respect Reduce Motion.

## Answer key
- Seat selection uses shared values for immediate feedback.
- Timeline and travel scene keep animation isolated behind small components.
- Success mark celebrates completion after the server confirms the booking.
- Reduce Motion should shorten or remove loops while keeping static state visible.
