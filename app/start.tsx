import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StartScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Discipl</Text>
                <Text style={styles.subtitle}>Daily affirmations for athletes</Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={() => router.replace('/onboarding')}>
                    <Text style={styles.buttonText}>Get started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d0d0d',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    title: {
        color: 'white',
        fontSize: 40,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 17,
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 48,
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#0d0d0d',
        fontSize: 16,
        fontWeight: '700',
    },
});
