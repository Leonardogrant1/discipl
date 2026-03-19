import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { useUserDataStore } from '@/stores/UserDataStore';

import { useOnboardingControl } from '../onboarding-control-context';

export function NameStep() {
    const updateSettings = useUserDataStore((s) => s.updateSettings);
    const savedName = useUserDataStore((s) => s.settings.name);
    const { setCanContinue, nextStep } = useOnboardingControl();
    const [name, setName] = useState(savedName);

    function handleNameChange(value: string) {
        setName(value);
        setCanContinue(value.trim().length > 0);
    }

    function handleSubmit() {
        if (name.trim()) {
            updateSettings({ name: name.trim() });
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.question}>What's your name?</Text>
                <Text style={styles.subtext}>Let's make this personal</Text>
            </View>

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
        </KeyboardAvoidingView>
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
    question: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtext: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 14,
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
