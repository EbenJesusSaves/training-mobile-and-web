# Mobile kata · Debugging toolkit

Use the final app to practise narrowing a failure.

## Exercise
A physical phone cannot sign in but the simulator can. Write the first five checks.

## Answer key
Confirm `EXPO_PUBLIC_API_URL`, use the facilitator LAN IP, check phone and laptop Wi-Fi, open `/api/health`, inspect the Axios normalized error, then retry after clearing SecureStore/session state.
