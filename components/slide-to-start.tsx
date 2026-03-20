import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    clamp,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';

const HANDLE_SIZE = 56;
const TRACK_HEIGHT = 64;
const TRACK_PADDING = 4;
const COMPLETE_THRESHOLD = 0.85;

type Props = {
    onComplete: () => void;
    label?: string;
};

export function SlideToStart({ onComplete, label = 'Start' }: Props) {
    const trackWidth = useSharedValue(0);
    const translateX = useSharedValue(0);
    const maxX = useSharedValue(0);

    const pan = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = clamp(e.translationX, 0, maxX.value);
        })
        .onEnd(() => {
            if (translateX.value >= maxX.value * COMPLETE_THRESHOLD) {
                translateX.value = withSpring(maxX.value, { damping: 20 });
                runOnJS(onComplete)();
            } else {
                translateX.value = withSpring(0, { damping: 20 });
            }
        });

    const handleStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const labelStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, maxX.value * 0.4], [1, 0]),
    }));

    const fillStyle = useAnimatedStyle(() => ({
        width: translateX.value + HANDLE_SIZE + TRACK_PADDING,
    }));

    return (
        <View
            style={styles.track}
            onLayout={(e) => {
                trackWidth.value = e.nativeEvent.layout.width;
                maxX.value = e.nativeEvent.layout.width - HANDLE_SIZE - TRACK_PADDING * 2;
            }}
        >
            {/* Fill */}
            <Animated.View style={[styles.fill, fillStyle]} />

            {/* Label */}
            <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>

            {/* Handle */}
            <GestureDetector gesture={pan}>
                <Animated.View style={[styles.handle, handleStyle]}>
                    <MaterialIcons name="chevron-right" size={28} color="#0d0d0d" />
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        height: TRACK_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: TRACK_HEIGHT / 2,
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    fill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: TRACK_HEIGHT / 2,
    },
    label: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    handle: {
        position: 'absolute',
        left: TRACK_PADDING,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
        borderRadius: HANDLE_SIZE / 2,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
