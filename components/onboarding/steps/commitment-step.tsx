import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import PactIcon from "@/assets/icons/pact.svg";
import { Category } from '@/data/quotes';
import { useUserDataStore } from '@/stores/UserDataStore';
import { useOnboardingControl } from '../onboarding-control-context';

const HOLD_DURATION = 3000;
const ICON_SIZE = 200;

const CATEGORY_GOALS: Record<Category, string> = {
    discipline: 'Become more disciplined',
    mindset: 'Build a champion mindset',
    strength: 'Become mentally stronger',
    confidence: 'Build unshakeable confidence',
    resilience: 'Develop unstoppable resilience',
};

function GoalRow({ text, delay }: { text: string; delay: number }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(-16)).current;

    useEffect(() => {
        const t = setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(translateX, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 6 }),
            ]).start();
        }, delay);
        return () => clearTimeout(t);
    }, []);

    return (
        <Animated.View style={[styles.goalRow, { opacity, transform: [{ translateX }] }]}>
            <Text style={styles.goalCheck}>✓</Text>
            <Text style={styles.goalText}>{text}</Text>
        </Animated.View>
    );
}

export function CommitmentStep() {
    const name = useUserDataStore((s) => s.settings.name);
    const selectedCategories = useUserDataStore((s) => s.settings.selectedCategories) as Category[];
    const { nextStep } = useOnboardingControl();

    const goals = selectedCategories.length > 0
        ? selectedCategories.map((cat) => CATEGORY_GOALS[cat]).filter(Boolean)
        : ['Become the best version of myself'];

    const scale = useRef(new Animated.Value(1)).current;
    const fillProgress = useRef(new Animated.Value(0)).current; // 0 = leer, 1 = voll
    const [holding, setHolding] = useState(false);
    const [done, setDone] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fillAnimRef = useRef<Animated.CompositeAnimation | null>(null);
    const scaleAnimRef = useRef<Animated.CompositeAnimation | null>(null);

    function onPressIn() {
        if (done) return;
        setHolding(true);

        scaleAnimRef.current = Animated.spring(scale, {
            toValue: 0.82,
            useNativeDriver: true,
            speed: 8,
            bounciness: 2,
        });
        scaleAnimRef.current.start();

        // Fill von 0 → 1 über HOLD_DURATION
        fillAnimRef.current = Animated.timing(fillProgress, {
            toValue: 1,
            duration: HOLD_DURATION,
            useNativeDriver: false, // false weil SVG-Props
        });
        fillAnimRef.current.start();

        timerRef.current = setTimeout(() => {
            setDone(true);
            setHolding(false);
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
            }).start(() => nextStep());
        }, HOLD_DURATION);
    }

    function onPressOut() {
        if (done) return;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setHolding(false);

        scaleAnimRef.current?.stop();
        fillAnimRef.current?.stop();

        // Fill zurücksetzen
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
        Animated.timing(fillProgress, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }

    useEffect(() => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    // fillProgress (0→1) → reveal height von unten (0→ICON_SIZE)
    const revealHeight = fillProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, ICON_SIZE],
    });

    const displayName = name.trim() || 'Athlete';

    return (
        <View style={styles.container}>
            <View style={styles.textBlock}>
                <Text style={styles.pactTitle}>
                    I, <Text style={styles.pactName}>{displayName}</Text>, commit to
                </Text>
                <View style={styles.goalList}>
                    {goals.map((goal, i) => (
                        <GoalRow key={goal} text={goal} delay={i * 120} />
                    ))}
                </View>
            </View>

            <Animated.View style={[styles.buttonWrapper, { transform: [{ scale }] }]}>
                <Pressable
                    style={styles.button}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                >
                    {/* Grüner Kreis füllt sich von unten nach oben */}
                    <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end' }]}>
                        <Animated.View style={{
                            width: ICON_SIZE,
                            height: revealHeight,
                            backgroundColor: done ? 'white' : '#4ade80',
                        }} />
                    </View>

                    {/* SVG Fingerprint liegt oben drüber */}
                    <PactIcon
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                        style={StyleSheet.absoluteFill}
                    />
                </Pressable>
            </Animated.View>

            <Text style={styles.hint}>
                {done ? '✓ Committed' : 'Tap and hold the Commit Button'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 52,
    },
    textBlock: {
        alignItems: 'center',
        gap: 30,
    },
    pactTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 32,
    },
    pactName: {
        color: 'white',
    },
    goalList: {
        gap: 10,
        alignSelf: 'stretch',
        paddingLeft: 17,
    },
    goalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    goalCheck: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 14,
        fontWeight: '700',
    },
    goalText: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 14,
        lineHeight: 20,
    },
    buttonWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        borderRadius: ICON_SIZE / 2,
        backgroundColor: '#1c1c1c',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    hint: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        textAlign: 'center',
    },
});