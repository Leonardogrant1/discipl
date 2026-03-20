import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

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

export function TrialOfferStep() {
    const titleAnim = useFadeSlide(200);
    const subtitleAnim = useFadeSlide(450);

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.title, titleAnim]}>
                We offer 3 days of premium access, just for you
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, subtitleAnim]}>
                To let you feel the impact of Descipl
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 14,
        lineHeight: 36,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 16,
        textAlign: 'center',
    },
});
