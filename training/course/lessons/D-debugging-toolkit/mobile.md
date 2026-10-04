# Lesson D · Debugging toolkit — 📱 Mobile

> This optional guide practises a calm mobile debugging loop with Expo dev tools, logs, network checks and React Native DevTools.

## What arrives

Nothing. This extension copies no mobile files.

## Talk through (together)

1. **Expo dev tools:** Ask: where do you start when the app fails to load? Answer: Metro logs, Expo dev menu and whether the device can reach the development server.
2. **Network failures:** Ask: why can the simulator sign in while a phone cannot? Answer: the phone needs a LAN API URL, the same Wi-Fi and a reachable `/api/health`.
3. **Axios errors:** Ask: where is the error normalized? Answer: the API client converts responses into the app's `ApiError` shape.
4. **State reset:** Ask: when should you clear storage? Answer: after confirming a stale token or bad persisted URL is part of the repro.

## Live tasks

There is no mobile LIVE task. Use `kata/mobile/debugging-toolkit-kata.md` to write the first checks for a physical phone that cannot sign in while the simulator can.

## Checkpoint

Practise the loop: reproduce, isolate, hypothesise, verify. Commands: `lesson status D` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

Nothing.
