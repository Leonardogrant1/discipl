import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { useUserDataStore } from '@/stores/UserDataStore';

import { useOnboardingControl } from '../onboarding-control-context';

const HOLD_DURATION = 3000;

function buildPactText(improvements: string[]): string {
    const two = improvements.slice(0, 2).map((s) => s.toLowerCase());
    if (two.length === 0) return 'become the best version of myself';
    if (two.length === 1) return two[0];
    return `${two[0]} and ${two[1]}`;
}

export function CommitmentStep() {
    const name = useUserDataStore((s) => s.settings.name);
    const improvements = useUserDataStore((s) => s.settings.improvements);
    const { nextStep } = useOnboardingControl();

    const scale = useRef(new Animated.Value(1)).current;
    const [holding, setHolding] = useState(false);
    const [done, setDone] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }

    useEffect(() => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    const pactText = buildPactText(improvements);
    const displayName = name.trim() || 'Athlete';

    return (
        <View style={styles.container}>
            <View style={styles.textBlock}>
                <Text style={styles.pactTitle}>
                    I, <Text style={styles.pactName}>{displayName}</Text>, will use Discipl to
                </Text>
                <Text style={styles.pactGoal}>{pactText}</Text>
            </View>

            <Animated.View style={[styles.buttonWrapper, { transform: [{ scale }] }]}>
                <Pressable
                    style={[styles.button, holding && styles.buttonHolding, done && styles.buttonDone]}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                >
                    <MaterialIcons
                        name="fingerprint"
                        size={100}
                        color={done ? 'white' : '#333'}
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
        gap: 12,
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
    pactGoal: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    buttonWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonHolding: {
        backgroundColor: '#c8c8c8',
    },
    buttonDone: {
        backgroundColor: '#e05c2a',
    },
    hint: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        textAlign: 'center',
    },
});
