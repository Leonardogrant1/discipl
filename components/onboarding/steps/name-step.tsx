import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

import { useUserDataStore } from '@/stores/UserDataStore';

import { useOnboardingControl } from '../onboarding-control-context';

export function NameStep() {
    const updateSettings = useUserDataStore((s) => s.updateSettings);
    const savedName = useUserDataStore((s) => s.settings.name);
    const { setCanContinue } = useOnboardingControl();
    const [name, setName] = useState(savedName);
    const [inputVisible, setInputVisible] = useState(false);

    const introOpacity = useSharedValue(0);
    const introTranslateY = useSharedValue(12);
    const questionOpacity = useSharedValue(0);
    const questionTranslateY = useSharedValue(12);
    const inputOpacity = useSharedValue(0);
    const inputTranslateY = useSharedValue(12);

    useEffect(() => {
        introOpacity.value = withTiming(1, { duration: 600 });
        introTranslateY.value = withTiming(0, { duration: 600 });

        questionOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
        questionTranslateY.value = withDelay(300, withTiming(0, { duration: 600 }));

        setTimeout(() => setInputVisible(true), 800);
        inputOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
        inputTranslateY.value = withDelay(800, withTiming(0, { duration: 500 }));
    }, []);

    function handleNameChange(value: string) {
        setName(value);
        setCanContinue(value.trim().length > 0);
    }

    function handleSubmit() {
        if (name.trim()) {
            updateSettings({ name: name.trim() });
        }
    }

    const introStyle = useAnimatedStyle(() => ({
        opacity: introOpacity.value,
        transform: [{ translateY: introTranslateY.value }],
    }));

    const questionStyle = useAnimatedStyle(() => ({
        opacity: questionOpacity.value,
        transform: [{ translateY: questionTranslateY.value }],
    }));

    const inputStyle = useAnimatedStyle(() => ({
        opacity: inputOpacity.value,
        transform: [{ translateY: inputTranslateY.value }],
    }));

    return (
        <KeyboardAwareScrollView
            scrollEnabled={false}
            contentContainerStyle={styles.container}
            bottomOffset={24}>
            <View style={styles.header}>
                <Animated.Text style={[styles.intro, introStyle]}>
                    Please introduce{'\n'}yourself to us                </Animated.Text>
                <Animated.Text style={[styles.question, questionStyle]}>
                    What's your name?
                </Animated.Text>
            </View>

            <Animated.View style={inputStyle}>
                {inputVisible && (
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={handleNameChange}
                        placeholder="Your name"
                        placeholderTextColor="rgba(255,255,255,0.25)"
                        autoFocus
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                    />
                )}
            </Animated.View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    intro: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    question: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#1c1c1c',
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 18,
        fontSize: 16,
        color: 'white',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
});
