// DELIBERATELY FLAWED – teaching example, not used by the apps.
// Problem: catches and discards errors, so screens cannot show retry, field errors or conflict recovery.

export async function unsafeSubmitBooking(api: { createBooking(): Promise<unknown> }) {
  try {
    return await api.createBooking();
  } catch {
    return null;
  }
}
