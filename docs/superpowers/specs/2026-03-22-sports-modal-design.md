# Sports Modal Design

**Date:** 2026-03-22
**Status:** Approved

## Overview

Add a sport selection modal accessible from the home screen via the BallIcon. Users can change which sports appear as background images in the feed. Extract the existing `CardItem` component from `sport-category-step.tsx` into a shared `SportCard` component reused in both the onboarding step and the new modal.

## Components

### 1. `/components/sport-card.tsx` (new)

Exports:
- `CATEGORIES` — the existing array of `{ slug, label, examples, image }` objects (moved from `sport-category-step.tsx`)
- `SportCard` — the existing `CardItem` component renamed, accepting `{ label, examples, image, selected, onPress }`

### 2. `/components/sports-modal.tsx` (new)

Structure mirrors `categories-modal.tsx`:
- `Modal` with `animationType="slide"`
- Dark `#0d0d0d` background
- `ScrollView` with close button, title "Your Sport"
- 2-column grid of `SportCard` components
- Toggle logic: at least 1 sport must remain selected
- Changes written directly to `useUserDataStore` via `updateSettings({ selectedSports })`

### 3. `sport-category-step.tsx` (updated)

Remove local `CardItem` and `CATEGORIES`. Import `SportCard` and `CATEGORIES` from `/components/sport-card.tsx`.

### 4. `home.tsx` (updated)

- `BallIcon` → opens `SportsModal` (new state: `sportsVisible`)
- `UserIcon` → opens `SettingsModal`
- Import and render `SportsModal`

## Data Flow

`selectedSports` lives in `useUserDataStore`. Both the onboarding step and the modal read/write this value. No additional state is needed.

## Constraints

- Minimum 1 sport must remain selected (consistent with categories behavior)
- No save button — changes apply immediately on toggle
