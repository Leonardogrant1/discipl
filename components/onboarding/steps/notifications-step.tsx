import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

export function NotificationsStep() {
    const titleOpacity = useRef(new Animated.Value(0)).current
    const titleY = useRef(new Animated.Value(16)).current
    const warningOpacity = useRef(new Animated.Value(0)).current
    const warningY = useRef(new Animated.Value(16)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(titleY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 5 }),
        ]).start()

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(warningOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(warningY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 5 }),
            ]).start()
        }, 300)
    }, [])

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.titleContainer, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
                <Text style={styles.title}>Stay on track.{'\n'}Every single day.</Text>
                <Text style={styles.subtitle}>
                    To receive your daily affirmations, enable notifications.
                </Text>
            </Animated.View>

            <Animated.View style={[styles.warning, { opacity: warningOpacity, transform: [{ translateY: warningY }] }]}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningText}>
                    Without notifications you'll miss one of the core features of this app.
                </Text>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: 'center',
        gap: 24,
    },
    titleContainer: {
        alignItems: "center",
    },
    title: {
        color: 'white',
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 42,
        marginBottom: 12,
        textAlign: "center",
    },
    subtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
    },
    warning: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
    },
    warningIcon: {
        fontSize: 16,
        marginTop: 1,
    },
    warningText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
})
