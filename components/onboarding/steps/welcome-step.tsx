import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

export function WelcomeStep() {
    const welcomeOpacity = useSharedValue(0);
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(16);

    useEffect(() => {
        welcomeOpacity.value = withTiming(1, { duration: 600 });
        titleOpacity.value = withDelay(300, withTiming(1, { duration: 700 }));
        titleTranslateY.value = withDelay(300, withTiming(0, { duration: 700 }));
    }, []);

    const welcomeStyle = useAnimatedStyle(() => ({
        opacity: welcomeOpacity.value,
    }));

    const titleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleTranslateY.value }],
    }));

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.welcome, welcomeStyle]}>Welcome</Animated.Text>
            <Animated.Text style={[styles.title, titleStyle]}>
                Your mind is your biggest enemy — and your greatest weapon. We help you master it. Every day.
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
    welcome: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 38,
    },
});
