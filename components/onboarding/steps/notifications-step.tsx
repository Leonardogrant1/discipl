import { ThemedText } from '@/components/themed-text'
import { posthog } from '@/services/posthog'
import * as Notifications from 'expo-notifications'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useOnboardingControl } from '../onboarding-control-context'



export function NotificationsStep() {
    const [isLoading, setIsLoading] = useState(false)
    const { nextStep } = useOnboardingControl();
    const fingerAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fingerAnim, {
                    toValue: -10,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(fingerAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start()
    }, [])

    const handleAllow = async () => {
        setIsLoading(true)
        try {
            const { status } = await Notifications.requestPermissionsAsync()
            if (status === 'granted') {
                posthog.capture('notification_permission_granted')
            } else {
                posthog.capture('notification_permission_denied')
            }
        } finally {
            nextStep()
        }
    }

    return (
        <View style={styles.container}>
            {/* Title */}
            <ThemedText style={styles.title}>
                Reach your goals with notifications
            </ThemedText>

            <View style={styles.spacer} />

            {/* Dialog Box */}
            <View style={styles.dialog}>
                <View style={styles.messageArea}>
                    <ThemedText style={styles.message}>
                        Turn on Notification to receive your daily affirmations
                    </ThemedText>
                </View>

                <View style={styles.buttonRow}>
                    {/* Don't Allow */}
                    <TouchableOpacity
                        style={[styles.button, styles.dontAllowButton]}
                        onPress={undefined}
                        activeOpacity={0.8}
                    >
                        <ThemedText style={styles.dontAllowText}>Don't Allow</ThemedText>
                    </TouchableOpacity>

                    {/* Allow */}
                    <TouchableOpacity
                        style={[styles.button, styles.allowButton]}
                        onPress={isLoading ? undefined : handleAllow}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <ThemedText style={styles.allowText}>Allow</ThemedText>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Finger emoji */}
            <Animated.View style={{
                transform: [{ translateY: fingerAnim }], alignSelf: 'flex-end',
                marginRight: 100,
                marginTop: 16,
            }}>
                <ThemedText style={styles.finger}>👆</ThemedText>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    spacer: {
        height: 40,
    },
    dialog: {
        width: 280,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    messageArea: {
        padding: 20,
    },
    message: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        color: '#000',
    },
    buttonRow: {
        flexDirection: 'row',
        height: 50,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dontAllowButton: {
        backgroundColor: '#e5e5e5',
        borderBottomLeftRadius: 16,
    },
    allowButton: {
        backgroundColor: '#000',
        borderBottomRightRadius: 16,
    },
    dontAllowText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    allowText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    finger: {
        fontSize: 24,

    },
})