import { StyleSheet, Text, View } from 'react-native';

import { StepProps } from '../types';

export function CategoriesStep(_: StepProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pick your categories</Text>
            <Text style={styles.subtitle}>Choose the topics that fuel your mindset</Text>
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
