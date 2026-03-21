import ChartIcon from '@/assets/icons/chart.svg'
import KeyIcon from '@/assets/icons/key.svg'
import LockIcon from '@/assets/icons/lock_check.svg'
import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'


export function TrackingStep() {
    const titleOpacity = useRef(new Animated.Value(0)).current
    const titleY = useRef(new Animated.Value(16)).current
    const bodyOpacity = useRef(new Animated.Value(0)).current
    const bodyY = useRef(new Animated.Value(16)).current
    const badgesOpacity = useRef(new Animated.Value(0)).current
    const badgesY = useRef(new Animated.Value(12)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(titleY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 5 }),
        ]).start()

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(bodyOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(bodyY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 5 }),
            ]).start()
        }, 300)

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(badgesOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(badgesY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 5 }),
            ]).start()
        }, 600)
    }, [])

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.titleContainer, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
                <Text style={styles.title}>Built for athletes.{'\n'}Honest about data.</Text>
                <Text style={styles.subtitle}>
                    To build the best experience for athletes, we collect anonymous usage data.
                </Text>
            </Animated.View>

            <Animated.View style={[styles.badges, { opacity: badgesOpacity, transform: [{ translateY: badgesY }] }]}>
                <View style={styles.badge}>
                    <LockIcon width={24} height={24} />
                    <Text style={styles.badgeText}>No personal data</Text>
                </View>
                <View style={styles.badge}>
                    <KeyIcon width={24} height={24} />
                    <Text style={styles.badgeText}>No selling. Ever.</Text>
                </View>
                <View style={styles.badge}>
                    <ChartIcon width={24} height={24} />
                    <Text style={styles.badgeText}>Just insights to improve Discipl</Text>
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        alignItems: "center",
    },
    container: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: 'center',
        gap: 32,
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
        lineHeight: 26,
        textAlign: "center",
    },
    badges: {
        gap: 10,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    badgeIcon: {
        fontSize: 16,
    },
    badgeText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        lineHeight: 20,
    },
})
