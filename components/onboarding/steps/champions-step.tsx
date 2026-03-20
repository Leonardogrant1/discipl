import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

const lines = [
    { text: "Champions don't just train their body. They train what drives it.", large: true },
    { text: 'Daily affirmations. Unbreakable beliefs.', large: false },
];

function AnimatedLine({ text, large, delay }: { text: string; large: boolean; delay: number }) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(16);

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
        translateY.value = withDelay(delay, withTiming(0, { duration: 600 }));
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.Text style={[large ? styles.large : styles.small, style]}>
            {text}
        </Animated.Text>
    );
}

export function ChampionsStep() {
    return (
        <View style={styles.container}>
            {lines.map((line, i) => (
                <AnimatedLine
                    key={i}
                    text={line.text}
                    large={line.large}
                    delay={i * 350}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 12,
    },
    large: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 38,
    },
    small: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 17,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 26,
        marginTop: 4,
    },
});
