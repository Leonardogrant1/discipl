# TrackerManager Design

**Date:** 2026-03-24

## Overview

A singleton `TrackerManager` that coordinates multiple analytics trackers. Consumers register trackers before calling `init()`, then use the manager as a single entry point for all tracking calls.

## File Structure

```
lib/tracking/
├── tracker.ts                  (existing, unchanged)
├── tracker-manager.ts          (new)
└── trackers/
    ├── posthog-tracker.ts      (implement)
    └── appsflyer-tracker.ts    (implement)
```

## Architecture

### TrackerManager (`lib/tracking/tracker-manager.ts`)

Singleton via static `getInstance()`, exported as `trackerManager`.

**API:**
```ts
register(tracker: Tracker): void
init(): void
identify(userId: string, properties?: Record<string, unknown>): void
track(event: string, properties?: Record<string, unknown>): void
logout(): void
```

**Rules:**
- Trackers must be registered before `init()` is called
- `init()` initializes all registered trackers once; the list is frozen after
- Each method delegates to all trackers in order
- If a tracker throws, the error is caught, logged via `console.error`, and reported to PostHog as `tracker_error` with `{ tracker, method, error }` — remaining trackers continue uninterrupted
- `PostHogTracker` is detected automatically on `register()` and stored as a private reference for error reporting

### PostHogTracker (`lib/tracking/trackers/posthog-tracker.ts`)

Wraps `services/posthog/`:

| Method | PostHog call |
|---|---|
| `init()` | `initPosthog()` |
| `identify(userId, props)` | `posthog.identify(userId, props)` |
| `track(event, props)` | `posthog.capture(event, props)` |
| `logout()` | `posthog.reset()` |

### AppsFlyerTracker (`lib/tracking/trackers/appsflyer-tracker.ts`)

Wraps `services/appsflyer/`:

| Method | AppsFlyer call |
|---|---|
| `init()` | `initAppsFlyer()` |
| `identify(userId, props)` | `appsflyer.setCustomerUserId(userId)` |
| `track(event, props)` | `appsflyer.logEvent(event, props)` |
| `logout()` | `appsflyer.setCustomerUserId('')` |

## Usage

```ts
// app startup (e.g. _layout.tsx)
trackerManager.register(new PostHogTracker())
trackerManager.register(new AppsFlyerTracker())
trackerManager.init()

// anywhere in the app
trackerManager.identify(userId)
trackerManager.track('onboarding_completed', { step: 5 })
trackerManager.logout()
```

## Error Reporting

When any tracker method throws:
1. `console.error` with tracker name, method, and error
2. `posthog.capture('tracker_error', { tracker: '<name>', method: '<method>', error: '<message>' })`
3. Execution continues with remaining trackers

PostHog itself failing is logged to `console.error` only (no circular error reporting).
