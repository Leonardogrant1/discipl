import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import FireIcon from '@/assets/icons/fire.svg';
import Logo from '@/assets/logo.svg';
import { useOnboardingControl } from '../onboarding-control-context';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const DELAY_BETWEEN = 350; // ms between each check

function getTodayIndex(): number {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
}

export function HabitStep() {
    const { setCanContinue } = useOnboardingControl();
    const todayIndex = getTodayIndex();
    const totalChecks = todayIndex + 1;

    const [filledCount, setFilledCount] = useState(0);
    const streakAnim = useRef(new Animated.Value(0)).current;
    const statCardOpacity = useRef(new Animated.Value(0)).current;
    const statCardTranslate = useRef(new Animated.Value(16)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        setCanContinue(false);

        Animated.parallel([
            Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 10 }),
        ]).start();

        let current = 0;
        const timeouts: ReturnType<typeof setTimeout>[] = [];

        function fillNext() {
            if (current >= totalChecks) {
                // all done — show stat card and unlock continue
                const t = setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(statCardOpacity, {
                            toValue: 1,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.timing(statCardTranslate, {
                            toValue: 0,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                    ]).start(() => setCanContinue(true));
                }, 300);
                timeouts.push(t);
                return;
            }

            const t = setTimeout(() => {
                current += 1;
                setFilledCount(current);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Animated.spring(streakAnim, {
                    toValue: current,
                    useNativeDriver: false,
                    speed: 20,
                    bounciness: 6,
                }).start();
                fillNext();
            }, current === 0 ? 600 : DELAY_BETWEEN);

            timeouts.push(t);
        }

        fillNext();
        return () => timeouts.forEach(clearTimeout);
    }, []);



    return (
        <View style={styles.container}>

            <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
                <Logo width={100} height={100} />
            </Animated.View>


            <View style={styles.textBlock}>
                <Text style={styles.title}>Build your daily habit</Text>
                <Text style={styles.subtitle}>Consistency is key to lasting change</Text>
            </View>

            {/* Streak card — same layout as settings-modal */}
            <View style={styles.streakCard}>
                <View style={styles.streakLeft}>
                    <AnimatedStreakNumber anim={streakAnim} total={totalChecks} />
                    <Text style={styles.streakDaysLabel}>Days</Text>
                </View>
                <View style={styles.streakRight}>
                    <View style={styles.weekRow}>
                        {DAYS.map((day) => (
                            <Text key={day} style={styles.dayLabel}>{day}</Text>
                        ))}
                    </View>
                    <View style={styles.weekRow}>
                        {DAYS.map((day, i) => {
                            const active = i < filledCount;
                            const isToday = i === todayIndex;
                            return (
                                <MaterialIcons
                                    key={day}
                                    name={active ? 'check-circle' : 'check-circle-outline'}
                                    size={22}
                                    color={
                                        active
                                            ? isToday
                                                ? '#e05c2a'
                                                : 'white'
                                            : 'rgba(255,255,255,0.15)'
                                    }
                                />
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* Stat card — fades in after animation */}
            <Animated.View
                style={[
                    styles.statCard,
                    {
                        opacity: statCardOpacity,
                        transform: [{ translateY: statCardTranslate }],
                    },
                ]}
            >
                <FireIcon width={30} height={30} />
                <Text style={styles.statText}>
                    People with 7-day streaks are 3x more likely to form lasting habits
                </Text>
            </Animated.View>
        </View>
    );
}

function AnimatedStreakNumber({ anim, total }: { anim: Animated.Value; total: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const id = anim.addListener(({ value }) => {
            setDisplay(Math.round(value));
        });
        return () => anim.removeListener(id);
    }, [anim]);

    return <Text style={styles.streakCount}>{display}</Text>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
    },
    textBlock: {
        alignItems: 'center',
        gap: 10,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 15,
        textAlign: 'center',
    },
    streakCard: {
        flexDirection: 'row',
        backgroundColor: '#1c1c1c',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        width: '100%',
    },
    streakLeft: {
        alignItems: 'center',
        marginRight: 20,
        paddingRight: 20,
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.1)',
    },
    streakCount: {
        color: 'white',
        fontSize: 32,
        fontWeight: '700',
        minWidth: 40,
        textAlign: 'center',
    },
    streakDaysLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
    },
    streakRight: {
        flex: 1,
        gap: 8,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        width: 22,
        textAlign: 'center',
    },
    statCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c1c1c',
        borderRadius: 14,
        padding: 18,
        gap: 14,
        width: '100%',
    },
    statEmoji: {
        fontSize: 28,
    },
    statText: {
        flex: 1,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        lineHeight: 21,
    },
});
