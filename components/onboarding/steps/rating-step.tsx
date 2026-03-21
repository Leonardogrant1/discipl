import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import ClockIcon from '@/assets/icons/clock.svg';
import { useUserDataStore } from '@/stores/UserDataStore';

export function RatingStep() {
    const name = useUserDataStore((s) => s.settings.name);
    const displayName = name.trim() || 'Athlete';

    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleY = useRef(new Animated.Value(16)).current;
    const bodyOpacity = useRef(new Animated.Value(0)).current;
    const bodyY = useRef(new Animated.Value(16)).current;
    const badgeOpacity = useRef(new Animated.Value(0)).current;
    const badgeY = useRef(new Animated.Value(12)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(titleY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 5 }),
        ]).start();

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(bodyOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(bodyY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 5 }),
            ]).start();
        }, 300);

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(badgeOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(badgeY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 5 }),
            ]).start();
        }, 600);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}>
                <Text style={styles.title}>You're in,{'\n'}{displayName}.</Text>
                <Text style={styles.subtitle}>
                    {'Discipl was built for athletes like you —\nby people who know what it takes.\n\nIf you believe in what we\'re building,\nhelp us reach more athletes like yourself.'}
                </Text>
            </Animated.View>

            <Animated.View style={[styles.badge, { opacity: badgeOpacity, transform: [{ translateY: badgeY }] }]}>
                <ClockIcon width={24} height={24} />
                <Text style={styles.badgeText}>It takes 5 seconds and means everything to us.</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
    },
    title: {
        color: 'white',
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 42,
        marginBottom: 32,
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        lineHeight: 26,
        textAlign: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    badgeText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        lineHeight: 20,
    },
});
