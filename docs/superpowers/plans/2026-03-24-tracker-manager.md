# TrackerManager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a singleton `TrackerManager` that delegates `init`, `identify`, `track`, and `logout` to all registered trackers, with PostHog as the error-reporting backbone.

**Architecture:** Singleton class with a private tracker list. `register()` accepts `Tracker` instances (auto-detects `PostHogTracker` for error reporting). `init()` initializes all trackers once and freezes the list. Each delegating method catches per-tracker errors and reports them to PostHog.

**Tech Stack:** TypeScript, `posthog-react-native`, `react-native-appsflyer`, Jest (unit tests)

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `lib/tracking/trackers/posthog-tracker.ts` | Wraps `services/posthog/` |
| Modify | `lib/tracking/trackers/appsflyer-tracker.ts` | Wraps `services/appsflyer/` |
| Create | `lib/tracking/tracker-manager.ts` | Singleton coordinator |
| Create | `lib/tracking/__tests__/tracker-manager.test.ts` | Unit tests for manager |
| Create | `lib/tracking/__tests__/posthog-tracker.test.ts` | Unit tests for PostHog wrapper |
| Create | `lib/tracking/__tests__/appsflyer-tracker.test.ts` | Unit tests for AppsFlyer wrapper |
| Modify | `package.json` | Add jest + test script |
| Create | `jest.config.js` | Jest config for React Native / Expo |
| Existing | `lib/tracking/tracker.ts` | Abstract base class — do not modify |

---

## Task 1: Set up Jest

**Files:**
- Modify: `package.json`
- Create: `jest.config.js`

- [ ] **Step 1: Install dependencies**

```bash
yarn add --dev jest @types/jest jest-expo
```

- [ ] **Step 2: Add test script to `package.json`**

Add inside `"scripts"`:
```json
"test": "jest"
```

- [ ] **Step 3: Create `jest.config.js`**

```js
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'node',
};
```

- [ ] **Step 4: Run jest to verify setup**

```bash
npx jest --listTests
```

Expected: no errors, empty list (no tests yet)

---

## Task 2: Implement `PostHogTracker`

**Files:**
- Modify: `lib/tracking/trackers/posthog-tracker.ts`
- Create: `lib/tracking/__tests__/posthog-tracker.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/tracking/__tests__/posthog-tracker.test.ts`:

```ts
const mockPosthog = {
  identify: jest.fn(),
  capture: jest.fn(),
  reset: jest.fn(),
};

jest.mock('@/services/posthog/init', () => ({
  initPosthog: jest.fn(),
  getPosthog: jest.fn(() => mockPosthog),
}));

import { PostHogTracker } from '../trackers/posthog-tracker';
import { initPosthog, getPosthog } from '@/services/posthog/init';

describe('PostHogTracker', () => {
  let tracker: PostHogTracker;

  beforeEach(() => {
    jest.clearAllMocks();
    (getPosthog as jest.Mock).mockReturnValue(mockPosthog);
    tracker = new PostHogTracker();
  });

  it('calls initPosthog on init()', () => {
    tracker.init();
    expect(initPosthog).toHaveBeenCalledTimes(1);
  });

  it('calls posthog.identify on identify()', () => {
    tracker.identify('user-123', { plan: 'pro' });
    expect(mockPosthog.identify).toHaveBeenCalledWith('user-123', { plan: 'pro' });
  });

  it('calls posthog.capture on track()', () => {
    tracker.track('button_clicked', { screen: 'home' });
    expect(mockPosthog.capture).toHaveBeenCalledWith('button_clicked', { screen: 'home' });
  });

  it('calls posthog.reset on logout()', () => {
    tracker.logout();
    expect(mockPosthog.reset).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest posthog-tracker.test.ts
```

Expected: FAIL — `PostHogTracker` not found

- [ ] **Step 3: Implement `PostHogTracker`**

Write `lib/tracking/trackers/posthog-tracker.ts`:

```ts
import { initPosthog, getPosthog } from '@/services/posthog/init';
import { Tracker } from '../tracker';

export class PostHogTracker extends Tracker {
    init(): void {
        initPosthog();
    }

    identify(userId: string, properties?: Record<string, unknown>): void {
        getPosthog()?.identify(userId, properties);
    }

    track(event: string, properties?: Record<string, unknown>): void {
        getPosthog()?.capture(event, properties);
    }

    logout(): void {
        getPosthog()?.reset();
    }
}
```

Note: uses `getPosthog()` (not the bare export from `services/posthog/index.ts`) so that all calls go through the fully-configured instance created by `initPosthog()` (session replay, ATT config, etc.).

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest posthog-tracker.test.ts
```

Expected: PASS (4 tests)

---

## Task 3: Implement `AppsFlyerTracker`

**Files:**
- Modify: `lib/tracking/trackers/appsflyer-tracker.ts`
- Create: `lib/tracking/__tests__/appsflyer-tracker.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/tracking/__tests__/appsflyer-tracker.test.ts`:

```ts
const mockSetCustomerUserId = jest.fn();
const mockLogEvent = jest.fn();

jest.mock('react-native-appsflyer', () => ({
  __esModule: true,
  default: {
    setCustomerUserId: mockSetCustomerUserId,
    logEvent: mockLogEvent,
  },
}));

jest.mock('@/services/appsflyer/init', () => ({
  initAppsFlyer: jest.fn(),
}));

import { AppsFlyerTracker } from '../trackers/appsflyer-tracker';
import { initAppsFlyer } from '@/services/appsflyer/init';

describe('AppsFlyerTracker', () => {
  let tracker: AppsFlyerTracker;

  beforeEach(() => {
    jest.clearAllMocks();
    tracker = new AppsFlyerTracker();
  });

  it('calls initAppsFlyer on init()', () => {
    tracker.init();
    expect(initAppsFlyer).toHaveBeenCalledTimes(1);
  });

  it('calls setCustomerUserId on identify()', () => {
    tracker.identify('user-123');
    expect(mockSetCustomerUserId).toHaveBeenCalledWith('user-123');
  });

  it('calls logEvent on track()', () => {
    tracker.track('purchase', { amount: 9.99 });
    expect(mockLogEvent).toHaveBeenCalledWith('purchase', { amount: 9.99 });
  });

  it('calls setCustomerUserId with empty string on logout()', () => {
    tracker.logout();
    expect(mockSetCustomerUserId).toHaveBeenCalledWith('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest appsflyer-tracker.test.ts
```

Expected: FAIL — `AppsFlyerTracker` not found

- [ ] **Step 3: Implement `AppsFlyerTracker`**

Write `lib/tracking/trackers/appsflyer-tracker.ts`:

```ts
import { initAppsFlyer } from '@/services/appsflyer/init';
import appsFlyer from 'react-native-appsflyer';
import { Tracker } from '../tracker';

export class AppsFlyerTracker extends Tracker {
    init(): void {
        initAppsFlyer();
    }

    identify(userId: string): void {
        appsFlyer.setCustomerUserId(userId);
    }

    track(event: string, properties?: Record<string, unknown>): void {
        appsFlyer.logEvent(event, properties ?? {});
    }

    logout(): void {
        appsFlyer.setCustomerUserId('');
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest appsflyer-tracker.test.ts
```

Expected: PASS (4 tests)

---

## Task 4: Implement `TrackerManager`

**Files:**
- Create: `lib/tracking/tracker-manager.ts`
- Create: `lib/tracking/__tests__/tracker-manager.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `lib/tracking/__tests__/tracker-manager.test.ts`:

```ts
import { Tracker } from '../tracker';
import { TrackerManager } from '../tracker-manager';
import { PostHogTracker } from '../trackers/posthog-tracker';

// Reset singleton between tests
beforeEach(() => {
  (TrackerManager as any).instance = undefined;
});

function makeTracker(): jest.Mocked<Tracker> {
  return {
    init: jest.fn(),
    identify: jest.fn(),
    track: jest.fn(),
    logout: jest.fn(),
  } as any;
}

describe('TrackerManager', () => {
  it('returns the same instance on repeated getInstance() calls', () => {
    const a = TrackerManager.getInstance();
    const b = TrackerManager.getInstance();
    expect(a).toBe(b);
  });

  it('calls init() on all registered trackers', () => {
    const t1 = makeTracker();
    const t2 = makeTracker();
    const manager = TrackerManager.getInstance();
    manager.register(t1);
    manager.register(t2);
    manager.init();
    expect(t1.init).toHaveBeenCalledTimes(1);
    expect(t2.init).toHaveBeenCalledTimes(1);
  });

  it('delegates identify() to all trackers', () => {
    const t1 = makeTracker();
    const manager = TrackerManager.getInstance();
    manager.register(t1);
    manager.init();
    manager.identify('u1', { role: 'admin' });
    expect(t1.identify).toHaveBeenCalledWith('u1', { role: 'admin' });
  });

  it('delegates track() to all trackers', () => {
    const t1 = makeTracker();
    const manager = TrackerManager.getInstance();
    manager.register(t1);
    manager.init();
    manager.track('page_view', { page: 'home' });
    expect(t1.track).toHaveBeenCalledWith('page_view', { page: 'home' });
  });

  it('delegates logout() to all trackers', () => {
    const t1 = makeTracker();
    const manager = TrackerManager.getInstance();
    manager.register(t1);
    manager.init();
    manager.logout();
    expect(t1.logout).toHaveBeenCalledTimes(1);
  });

  it('continues with remaining trackers if one throws', () => {
    const failing = makeTracker();
    const working = makeTracker();
    failing.track.mockImplementation(() => { throw new Error('sdk crash'); });

    // Use PostHogTracker mock as posthog reporter
    const posthogMock = makeTracker();
    Object.setPrototypeOf(posthogMock, PostHogTracker.prototype);

    const manager = TrackerManager.getInstance();
    manager.register(posthogMock);
    manager.register(failing);
    manager.register(working);
    manager.init();

    expect(() => manager.track('some_event')).not.toThrow();
    expect(working.track).toHaveBeenCalledWith('some_event', undefined);
    expect(posthogMock.track).toHaveBeenCalledWith(
      'tracker_error',
      expect.objectContaining({ method: 'track', error: 'sdk crash' })
    );
  });

  it('logs console.error on tracker failure', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const failing = makeTracker();
    failing.track.mockImplementation(() => { throw new Error('fail'); });

    const manager = TrackerManager.getInstance();
    manager.register(failing);
    manager.init();
    manager.track('event');

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest tracker-manager.test.ts
```

Expected: FAIL — `TrackerManager` not found

- [ ] **Step 3: Implement `TrackerManager`**

Create `lib/tracking/tracker-manager.ts`:

```ts
import { Tracker } from './tracker';
import { PostHogTracker } from './trackers/posthog-tracker';

export class TrackerManager {
    private static instance: TrackerManager;
    private trackers: Tracker[] = [];
    private posthog?: PostHogTracker;
    private initialized = false;

    private constructor() {}

    static getInstance(): TrackerManager {
        if (!TrackerManager.instance) {
            TrackerManager.instance = new TrackerManager();
        }
        return TrackerManager.instance;
    }

    register(tracker: Tracker): void {
        if (tracker instanceof PostHogTracker) {
            this.posthog = tracker;
        }
        this.trackers.push(tracker);
    }

    init(): void {
        if (this.initialized) return;
        this.initialized = true;
        for (const tracker of this.trackers) {
            this.safeCall(tracker, 'init', () => tracker.init());
        }
    }

    identify(userId: string, properties?: Record<string, unknown>): void {
        for (const tracker of this.trackers) {
            this.safeCall(tracker, 'identify', () => tracker.identify(userId, properties));
        }
    }

    track(event: string, properties?: Record<string, unknown>): void {
        for (const tracker of this.trackers) {
            this.safeCall(tracker, 'track', () => tracker.track(event, properties));
        }
    }

    logout(): void {
        for (const tracker of this.trackers) {
            this.safeCall(tracker, 'logout', () => tracker.logout());
        }
    }

    private safeCall(tracker: Tracker, method: string, fn: () => void): void {
        try {
            fn();
        } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            const trackerName = tracker.constructor.name;
            console.error(`[TrackerManager] ${trackerName}.${method} failed:`, err);
            if (this.posthog && tracker !== this.posthog) {
                try {
                    this.posthog.track('tracker_error', { tracker: trackerName, method, error });
                } catch {
                    console.error(`[TrackerManager] PostHog error reporting failed`);
                }
            }
        }
    }
}

export const trackerManager = TrackerManager.getInstance();
```

- [ ] **Step 4: Run all tests**

```bash
npx jest
```

Expected: PASS (alle Tests grün)

---

## Task 5: Wire up in app startup

**Files:**
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Register trackers in `app/_layout.tsx`**

`initPosthog()` and `initAppsFlyer()` are not yet called anywhere in the app — this is the first initialization. Add the following at module level (outside the component, before the default export) in `app/_layout.tsx`:

```ts
import { trackerManager } from '@/lib/tracking/tracker-manager';
import { PostHogTracker } from '@/lib/tracking/trackers/posthog-tracker';
import { AppsFlyerTracker } from '@/lib/tracking/trackers/appsflyer-tracker';

trackerManager.register(new PostHogTracker());
trackerManager.register(new AppsFlyerTracker());
trackerManager.init();
```

Place these lines after the existing imports, before the `Notifications.setNotificationHandler(...)` call.

- [ ] **Step 2: Verify app starts without errors**

```bash
npx expo start
```

Expected: no errors in Metro output related to PostHog or AppsFlyer init.
