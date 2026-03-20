import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useOnboardingControl } from '../onboarding-control-context';

function useFadeSlide(delay: number) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(16)).current;

    useEffect(() => {
        const t = setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    speed: 18,
                    bounciness: 5,
                }),
            ]).start();
        }, delay);
        return () => clearTimeout(t);
    }, []);

    return { opacity, transform: [{ translateY }] };
}

export function AddWidgetStep() {
    const { setCanContinue } = useOnboardingControl();
    const titleAnim = useFadeSlide(200);
    const subtitleAnim = useFadeSlide(450);
    const placeholderAnim = useFadeSlide(700);

    useEffect(() => {
        const t = setTimeout(() => setCanContinue(true), 900);
        return () => clearTimeout(t);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Animated.Text style={[styles.title, titleAnim]}>
                    Add a widget to your{'\n'}home screen
                </Animated.Text>

                <Animated.Text style={[styles.subtitle, subtitleAnim]}>
                    Long press your home screen, tap +, search 'Discipl' then add the widget.
                </Animated.Text>

                <Animated.View style={[styles.lottieWrapper, placeholderAnim]}>
                    <LottieView
                        source={require('@/assets/animations/widget.json')}
                        autoPlay
                        loop={false}
                        style={styles.lottie}
                    />
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
        gap: 20,
    },
    title: {
        color: 'white',
        fontSize: 30,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 38,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
    lottieWrapper: {
        width: '100%',
        aspectRatio: 0.75,
        marginTop: 8,
    },
    lottie: {
        flex: 1,
    },
});
