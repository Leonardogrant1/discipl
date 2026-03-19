import { StyleSheet, Text, View } from 'react-native';

export function WelcomeStep() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Discipl</Text>
            <Text style={styles.subtitle}>Daily quotes & affirmations for athletes</Text>
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
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 17,
        textAlign: 'center',
        lineHeight: 24,
    },
});
