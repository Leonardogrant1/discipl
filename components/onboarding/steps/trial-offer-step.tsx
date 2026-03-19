import { StyleSheet, Text, View } from 'react-native';

export function TrialOfferStep() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>We offer 3 days of premium access, just for you</Text>
            <Text style={styles.subtitle}>To help you feel more self-confident</Text>
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
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 14,
        lineHeight: 36,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 16,
        textAlign: 'center',
    },
});
