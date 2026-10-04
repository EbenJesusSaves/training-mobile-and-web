# Maestro end-to-end flows

[Maestro](https://maestro.mobile.dev) drives the real app in a simulator/emulator by tapping and typing,
the same way a passenger would. These flows run against Expo Go and a running API.

```bash
# 1. API running (see root README), Metro running: yarn start
# 2. From mobile/, with the iOS simulator booted and Expo Go installed:
maestro test \
  -e EXPO_URL=exp://$(ipconfig getifaddr en0):8081 \
  -e EMAIL=kwame@railpass.dev -e PASSWORD='Passenger#2026' \
  -e FROM='Accra Central' -e TO='Kumasi Central' \
  -e OUT=../.artifacts/mobile \
  e2e/maestro/book-one-way.yaml
```

| Flow                | What it checks                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `open-app.yaml`     | Opens the project in Expo Go (accepts the iOS "Open in Expo Go?" prompt)                            |
| `sign-in.yaml`      | Skips onboarding if shown and signs in                                                              |
| `book-one-way.yaml` | Search → class → seat → extra luggage → server quote → simulated payment → ticket → PDF share sheet |

Selectors use the accessibility labels the app already provides for screen readers (e.g.
`Seat 6, right side, available`), plus `testID`s on the sign-in fields. Good accessibility makes UI tests easier.
The team guide suggests Detox; Maestro was chosen here because it works with Expo Go without a native build.
