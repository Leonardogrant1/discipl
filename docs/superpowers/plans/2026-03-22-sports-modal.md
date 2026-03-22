# Sports Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the sport card component into a shared component, create a `SportsModal` for the home screen, and wire `BallIcon` to open it.

**Architecture:** Extract `CardItem`+`CATEGORIES` from `sport-category-step.tsx` into a standalone `sport-card.tsx`. Create `sports-modal.tsx` mirroring the structure of `categories-modal.tsx`. Update `home.tsx` so `BallIcon` → `SportsModal` and `UserIcon` → `SettingsModal`.

**Tech Stack:** React Native, Expo, TypeScript, Zustand (`useUserDataStore`)

---

### Task 1: Extract `SportCard` component

**Files:**
- Create: `components/sport-card.tsx`

- [ ] **Step 1: Create `components/sport-card.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { Animated, ImageBackground, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

export const CATEGORIES: { slug: string; label: string; examples: string; image: ImageSourcePropType }[] = [
    { slug: 'combat-sports', label: 'Combat Sports', examples: 'Boxing, MMA, Wrestling...', image: require('@/assets/category-images/combat.jpg') },
    { slug: 'team-sports', label: 'Team Sports', examples: 'Football, Basketball...', image: require('@/assets/category-images/team.jpeg') },
    { slug: 'athletics', label: 'Athletics', examples: 'Running, Jumping...', image: require('@/assets/category-images/athletics.jpg') },
    { slug: 'strength-power', label: 'Strength & Power', examples: 'Weightlifting, CrossFit...', image: require('@/assets/category-images/strength.jpg') },
    { slug: 'water-sports', label: 'Water Sports', examples: 'Swimming, Surfing...', image: require('@/assets/category-images/water.jpeg') },
    { slug: 'racket-sports', label: 'Racket Sports', examples: 'Tennis, Badminton...', image: require('@/assets/category-images/racket.jpeg') },
    { slug: 'endurance', label: 'Endurance', examples: 'Cycling, Triathlon...', image: require('@/assets/category-images/endurance.jpeg') },
    { slug: 'other', label: 'Other', examples: '', image: require('@/assets/category-images/other.jpeg') },
];

export function SportCard({
    label,
    examples,
    image,
    selected,
    onPress,
}: {
    label: string;
    examples: string;
    image: ImageSourcePropType;
    selected: boolean;
    onPress: () => void;
}) {
    const overlayOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(overlayOpacity, {
            toValue: selected ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [selected]);

    return (
        <View style={styles.cardWrapper}>
            <Pressable onPress={onPress} style={{ flex: 1 }}>
                <ImageBackground source={image} style={[styles.card, selected && styles.cardSelected]} imageStyle={styles.cardImage}>
                    <Animated.View style={[styles.cardOverlay, { opacity: overlayOpacity }]} />
                    <Text style={styles.cardLabel}>{label}</Text>
                    {examples ? <Text style={styles.cardExamples}>{examples}</Text> : null}
                </ImageBackground>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    cardWrapper: {
        width: '47%',
        height: 120,
    },
    card: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        minHeight: 120,
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    cardImage: {
        borderRadius: 12,
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
    },
    cardSelected: {
        borderColor: 'rgba(255,255,255,0.6)',
    },
    cardLabel: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    cardExamples: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
    },
});
```

- [ ] **Step 2: Commit**

```bash
git add components/sport-card.tsx
git commit -m "feat: extract SportCard shared component"
```

---

### Task 2: Update `sport-category-step.tsx` to use shared `SportCard`

**Files:**
- Modify: `components/onboarding/steps/sport-category-step.tsx`

- [ ] **Step 1: Replace local `CardItem` + `CATEGORIES` with imports**

Remove the `CATEGORIES` array and `CardItem` function entirely. Add import at the top:

```tsx
import { CATEGORIES, SportCard } from '@/components/sport-card';
```

Replace all usages of `CardItem` with `SportCard` in the JSX:

```tsx
{CATEGORIES.map((cat) => (
    <SportCard
        key={cat.slug}
        label={cat.label}
        examples={cat.examples}
        image={cat.image}
        selected={selectedSports.includes(cat.slug)}
        onPress={() => toggle(cat.slug)}
    />
))}
```

Remove the styles for `cardWrapper`, `card`, `cardImage`, `cardOverlay`, `cardSelected`, `cardLabel`, `cardExamples` from the local `StyleSheet` — they now live in `sport-card.tsx`.

- [ ] **Step 2: Commit**

```bash
git add components/onboarding/steps/sport-category-step.tsx
git commit -m "refactor: use shared SportCard in sport-category-step"
```

---

### Task 3: Create `SportsModal`

**Files:**
- Create: `components/sports-modal.tsx`

- [ ] **Step 1: Create `components/sports-modal.tsx`**

```tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CATEGORIES, SportCard } from '@/components/sport-card';
import { useUserDataStore } from '@/stores/UserDataStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function SportsModal({ visible, onClose }: Props) {
  const selectedSports = useUserDataStore((s) => s.settings.selectedSports);
  const updateSettings = useUserDataStore((s) => s.updateSettings);

  function toggleSport(slug: string) {
    const isSelected = selectedSports.includes(slug);
    if (isSelected && selectedSports.length === 1) return;
    const next = isSelected
      ? selectedSports.filter((s) => s !== slug)
      : [...selectedSports, slug];
    updateSettings({ selectedSports: next });
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Your Sport</Text>

          <View style={styles.grid}>
            {CATEGORIES.map((cat) => (
              <SportCard
                key={cat.slug}
                label={cat.label}
                examples={cat.examples}
                image={cat.image}
                selected={selectedSports.includes(cat.slug)}
                onPress={() => toggleSport(cat.slug)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  closeButton: {
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add components/sports-modal.tsx
git commit -m "feat: add SportsModal for sport background selection"
```

---

### Task 4: Wire `home.tsx`

**Files:**
- Modify: `app/home.tsx`

- [ ] **Step 1: Add `sportsVisible` state and import `SportsModal`**

Add import:
```tsx
import { SportsModal } from '@/components/sports-modal';
```

Add state (alongside existing `settingsVisible`, `categoriesVisible`):
```tsx
const [sportsVisible, setSportsVisible] = useState(false);
```

- [ ] **Step 2: Update `BallIcon` button `onPress`**

Change line 189 from:
```tsx
<TouchableOpacity style={styles.iconButton} onPress={() => setSettingsVisible(true)}>
    <BallIcon width={22} height={22} color="white" />
</TouchableOpacity>
```
To:
```tsx
<TouchableOpacity style={styles.iconButton} onPress={() => setSportsVisible(true)}>
    <BallIcon width={22} height={22} color="white" />
</TouchableOpacity>
```

- [ ] **Step 3: Render `SportsModal`**

Add alongside the existing modals at the bottom of the JSX (before closing `</View>`):
```tsx
<SportsModal visible={sportsVisible} onClose={() => setSportsVisible(false)} />
```

- [ ] **Step 4: Commit**

```bash
git add app/home.tsx
git commit -m "feat: wire BallIcon to SportsModal on home screen"
```
