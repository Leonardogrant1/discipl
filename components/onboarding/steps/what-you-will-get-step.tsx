import { StyleSheet, Text, View } from 'react-native';


const BENEFITS = [
    "Enjoy your first 3 days, it's free",
    'Cancel easily from the app or iCloud',
    'Affirmations that resonate with you',
    'Homescreen & lockscreen widgets',
    'Feel more self-confident',
];

export function WhatYouWillGetStep() {
    return (
        <View style={styles.container}>

            <View style={styles.content}>
                <Text style={styles.emoji}>🕯️</Text>

                <Text style={styles.title}>What you'll get</Text>

                <View style={styles.benefits}>
                    {BENEFITS.map((benefit) => (
                        <View key={benefit} style={styles.benefitRow}>
                            <Text style={styles.checkmark}>✓</Text>
                            <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    skipButton: {
        position: 'absolute',
        top: 20,
        right: 24,
        zIndex: 1,
    },
    skipText: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 16,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 24,
    },
    emoji: {
        fontSize: 72,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
    },
    benefits: {
        width: '100%',
        gap: 14,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkmark: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        fontWeight: '700',
    },
    benefitText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 16,
    },
});
