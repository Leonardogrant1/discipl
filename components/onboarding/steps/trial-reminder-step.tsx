import { StyleSheet, Text, View } from 'react-native';

export function TrialReminderStep() {
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>🔔</Text>
            <Text style={styles.title}>We'll send you a reminder 1 day before your trial ends</Text>
            <Text style={styles.subtitle}>No surprise, no pressure</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 16,
    },
    emoji: {
        fontSize: 72,
        marginBottom: 8,
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
