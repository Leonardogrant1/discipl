import Logo from '@/assets/logo.svg';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

function useFadeSlide(delay: number) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(16)).current;

    useEffect(() => {
        const t = setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 5 }),
            ]).start();
        }, delay);
        return () => clearTimeout(t);
    }, []);

    return { opacity, transform: [{ translateY }] };
}

const BENEFITS = [
    "Enjoy your first 3 days, it's free",
    'Cancel easily from the app or iCloud',
    'Affirmations that resonate with you',
    'Homescreen & lockscreen widgets',
    'Feel more self-confident',
];

function BenefitRow({ text, delay }: { text: string; delay: number }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(-20)).current;


    useEffect(() => {
        const t = setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                    speed: 18,
                    bounciness: 6,
                }),
            ]).start();
        }, delay);
        return () => clearTimeout(t);
    }, []);

    return (
        <Animated.View style={[styles.benefitRow, { opacity, transform: [{ translateX }] }]}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.benefitText}>{text}</Text>
        </Animated.View>
    );
}

export function WhatYouWillGetStep() {
    const emojiAnim = useFadeSlide(0);
    const titleAnim = useFadeSlide(150);

    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 10 }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.emojiContainer}>
                    <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
                        <Logo width={100} height={100} />
                    </Animated.View>
                    <Animated.Text style={[styles.title, titleAnim]}>What you'll get</Animated.Text>
                </View>
                <View style={styles.benefits}>
                    {BENEFITS.map((benefit, i) => (
                        <BenefitRow key={benefit} text={benefit} delay={300 + i * 150} />
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 54,
    },

    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
    },
    benefits: {
        width: '90%',
        gap: 24,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    checkmark: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 20,
        fontWeight: '700',
    },
    benefitText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 16,
    },
    emojiContainer: {
        alignItems: 'center',
        gap: 20,
    },
});
