# Onboarding Control Provider — Design Spec

**Date:** 2026-03-19
**Status:** Approved

---

## Overview

Refactor the onboarding flow to use a React context (`OnboardingControlProvider`) that owns step progression state. Steps consume this context via a `useOnboardingControl()` hook instead of receiving an `onContinue` prop. This makes control flow explicit, enables a globally-disabled continue button, and allows per-step async pre-flight logic defined declaratively in the step config.

---

## Goals

- Central context owns `currentIndex`, `canContinue`, and step advancement
- Continue button is disabled when `canContinue` is false
- Steps set `canContinue` via context (e.g. survey steps enable it on selection)
- Optional `preContinue` async callback per step, defined in the config, runs before advancing
- Survey steps highlight selection and enable continue button instead of auto-advancing
- `StepProps` / `onContinue` prop pattern is removed

---

## Context API

```ts
// components/onboarding/onboarding-control-context.tsx

type OnboardingControlContextValue = {
  currentIndex: number;
  canContinue: boolean;
  setCanContinue: (value: boolean) => void;
  nextStep: () => void;
};
```

`nextStep()` is the single advancement path. It:
1. Is a **no-op** if a prior call is still in flight (re-entry safe)
2. Calls `preContinue()` from the current step config (if defined), awaiting completion
3. Advances `currentIndex` (or calls `onComplete` if on the last step)

Both the wrapper's continue button and any self-advancing step component call `nextStep()`.

`isLoading` (while `preContinue` runs) is **internal to the wrapper** and not exposed on the context. The wrapper disables and visually indicates the button while loading.

---

## Updated Types

```ts
// components/onboarding/types.ts

export type OnboardingStep = {
  component: ComponentType;          // no StepProps — steps use context
  showProgressIndicator?: boolean;   // default: true
  showContinueButton?: boolean;      // default: true
  continueButtonText?: string;       // default: 'Continue'
  initialCanContinue?: boolean;      // default: true
  preContinue?: () => Promise<void>; // runs before advancing, optional
};
```

`StepProps` is removed entirely.

---

## Continue Button Behaviour

The continue button in `OnboardingProgressWrapper`:
- Is shown when `showContinueButton !== false`
- Is **disabled** (greyed out) when `canContinue === false` or while `isLoading`
- Calls `nextStep()` on press

When the user navigates to a new step, `canContinue` is reset to the step's `initialCanContinue` value (default `true`).

`nextStep()` itself does **not** check `canContinue` internally. The `canContinue` guard is the button UI's responsibility only. Self-advancing steps (like `CommitmentStep`) call `nextStep()` directly and bypass the button entirely — this is intentional.

---

## Survey Steps

Steps that previously had `showContinueButton: false` and called `onContinue()` on selection (GenderStep, ReferralStep, AgeStep, ActivityStep, AffirmationsFamiliarityStep) are updated to:

1. Remove `showContinueButton: false` from their config entry in `onboarding.tsx`
2. Add `initialCanContinue: false` to their config entry
3. In the component: call `setCanContinue(true)` on selection instead of `onContinue()`

`SurveyQuestion` component: `onChange` no longer triggers auto-advance. The option highlights on selection (already working via `value` state), and the continue button becomes enabled.

---

## NameStep

`NameStep` uses `initialCanContinue: false`. The component calls `setCanContinue(name.trim().length > 0)` reactively via `onChangeText`. `updateSettings({ name })` is called only on submit (inside `handleSubmit`), not on every keystroke — this matches the existing behavior. `nextStep()` is called from `onSubmitEditing` and from `handleSubmit`. The wrapper's continue button also calls `nextStep()`, which is safe because `canContinue` is already false for an empty name.

---

## ImprovementStep

`ImprovementStep` gets `initialCanContinue: false`. The component calls `setCanContinue(v.length > 0)` inside its `onChange` handler to enforce the "Choose at least one" requirement that was previously unenforced.

---

## Self-Advancing Steps

Steps that advance themselves without the continue button (e.g. `CommitmentStep` after the hold gesture) call `nextStep()` from `useOnboardingControl()` instead of `onContinue()` from props. The `done` guard in `CommitmentStep` already prevents double-fire; `nextStep()` being re-entry safe provides an additional layer.

---

## `preContinue` Example

```ts
// In ONBOARDING_STEPS (app/onboarding.tsx)
{
  component: NotificationsStep,
  continueButtonText: 'Enable notifications',
  preContinue: async () => {
    await requestPermissionsAsync();
  },
},
```

---

## File Changes

| File | Change |
|------|--------|
| `components/onboarding/types.ts` | Update `OnboardingStep`, remove `StepProps` |
| `components/onboarding/onboarding-control-context.tsx` | **New file** — context + provider + hook |
| `components/onboarding/onboarding-progress-wrapper.tsx` | Use context internally, disable button when `!canContinue` or loading, handle `preContinue`, reset `canContinue` on step change |
| `app/onboarding.tsx` | Update step configs (add `initialCanContinue: false`, add `preContinue` where needed) |
| `components/onboarding/steps/welcome-step.tsx` | Remove `StepProps` import and prop only; no other change |
| `components/onboarding/steps/name-step.tsx` | Use `setCanContinue` reactively; call `nextStep()` from context |
| `components/onboarding/steps/gender-step.tsx` | Use `useOnboardingControl`, call `setCanContinue(true)` on select |
| `components/onboarding/steps/referral-step.tsx` | Same |
| `components/onboarding/steps/age-step.tsx` | Same |
| `components/onboarding/steps/activity-step.tsx` | Same |
| `components/onboarding/steps/affirmations-familiarity-step.tsx` | Same |
| `components/onboarding/steps/improvement-step.tsx` | Use `useOnboardingControl`, call `setCanContinue(v.length > 0)` |
| `components/onboarding/steps/commitment-step.tsx` | Use `nextStep()` from context |
| `components/onboarding/steps/habit-step.tsx` | Remove `onContinue` prop |
| `components/onboarding/steps/notification-schedule-step.tsx` | Remove `onContinue` prop |
| `components/onboarding/steps/notifications-step.tsx` | Remove `onContinue` prop |

---

## Known Orphans (out of scope)

- `components/onboarding/steps/goal-step.tsx` — exists in the codebase but is not included in the `ONBOARDING_STEPS` array. No changes needed in this refactor.

---

## Non-Goals

- No back-navigation support
- No step skipping logic
- No persistence of `canContinue` state across app restarts
