import LottieView from 'lottie-react-native';
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

export function TrialReminderStep() {
    const titleAnim = useFadeSlide(200);
    const subtitleAnim = useFadeSlide(450);

    return (
        <View style={styles.container}>
            <LottieView
                source={require('@/assets/animations/bell.json')}
                autoPlay
                loop={false}
                style={{ width: 80, height: 80 }}
            />
            <Animated.Text style={[styles.title, titleAnim]}>
                We'll send you a reminder 1 day before your trial ends
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, subtitleAnim]}>
                No surprise, no pressure
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
        gap: 24,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 36,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 16,
        textAlign: 'center',
    },
});
