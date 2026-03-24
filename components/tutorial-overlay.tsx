import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Logo from '@/assets/logo.svg';
import { Fonts } from '@/constants/theme';
import { useTutorial } from '@/contexts/TutorialContext';


function AnimatedTooltip({ text, style }: { text: string; style: object }) {
    const boxAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        boxAnim.setValue(0);
        textAnim.setValue(0);
        Animated.sequence([
            Animated.timing(boxAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(textAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                style,
                {
                    opacity: boxAnim,
                    transform: [{ translateY: boxAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
                },
            ]}
            pointerEvents="none"
        >
            <Animated.Text
                style={[
                    styles.tooltipText,
                    {
                        opacity: textAnim,
                        transform: [{ translateY: textAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
                    },
                ]}
            >
                {text}
            </Animated.Text>
        </Animated.View>
    );
}

export function TutorialOverlay() {
    const { step, nextStep } = useTutorial();

    // Welcome step entrance animation
    const welcomeAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

    // Notifications step animation
    const notifAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

    // Widget step animation
    const widgetAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

    // Ready step animation
    const readyAnims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        if (step === 0) {
            welcomeAnims.forEach((a) => a.setValue(0));
            Animated.stagger(120, welcomeAnims.map((a) =>
                Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: true })
            )).start();
        }
        if (step === 5) {
            notifAnims.forEach((a) => a.setValue(0));
            Animated.stagger(120, notifAnims.map((a) =>
                Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: true })
            )).start();
        }
        if (step === 6) {
            widgetAnims.forEach((a) => a.setValue(0));
            Animated.stagger(120, widgetAnims.map((a) =>
                Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: true })
            )).start();
        }
        if (step === 7) {
            readyAnims.forEach((a) => a.setValue(0));
            Animated.stagger(120, readyAnims.map((a) =>
                Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: true })
            )).start();
        }
    }, [step]);

    const tooltips: Record<number, string> = {
        1: 'Here you can customize the categories of your quotes — choose what suits you.',
        2: 'Your profile, streak and all settings are here.',
        3: 'Here you choose the sport categories for the background images.',
        4: 'Swipe up to see the next quote — give it a try!',
    };

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents={step === 4 ? 'none' : 'box-none'}>
            {/* Backdrop — sits between background elements (zIndex 1) and highlighted element (zIndex 20) */}
            <View
                style={[
                    styles.backdrop,
                    {
                        backgroundColor: [0, 5, 6, 7].includes(step)
                            ? 'rgba(0,0,0,0.88)'
                            : step === 4
                                ? 'rgba(0,0,0,0.45)'
                                : 'rgba(0,0,0,0.75)',
                    },
                ]}
                pointerEvents="none"
            />

            {/* Step 0: Welcome content */}
            {step === 0 && (
                <View style={styles.welcomeContainer} pointerEvents="box-none">
                    {[
                        <Logo width={100} height={100} />,
                        <Text style={[styles.welcomeTitle, { fontFamily: Fonts?.serif }]}>
                            Welcome to Discipl
                        </Text>,
                        <Text style={styles.welcomeText}>
                            Regular affirmations and daily refreshers strengthen your mindset.
                        </Text>,
                        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>,
                    ].map((child, i) => (
                        <Animated.View
                            key={i}
                            style={{
                                opacity: welcomeAnims[i],
                                transform: [{ translateY: welcomeAnims[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
                            }}
                        >
                            {child}
                        </Animated.View>
                    ))}
                </View>
            )}

            {/* Steps 1–3: tap anywhere to advance */}
            {[1, 2, 3].includes(step) && (
                <TouchableOpacity
                    style={[StyleSheet.absoluteFill, { zIndex: 11 }]}
                    onPress={nextStep}
                    activeOpacity={1}
                />
            )}

            {/* Steps 1–4: tooltip */}
            {step === 1 && <AnimatedTooltip text={tooltips[1]} style={styles.tooltipBottom} />}
            {step === 2 && <AnimatedTooltip text={tooltips[2]} style={styles.tooltipTop} />}
            {step === 3 && <AnimatedTooltip text={tooltips[3]} style={styles.tooltipTop} />}
            {step === 4 && <AnimatedTooltip text={tooltips[4]} style={styles.tooltipSwipe} />}

            {/* Step 5: Notifications */}
            {step === 5 && (
                <View style={styles.overlayInfo} pointerEvents="box-none">
                    {[
                        <Text style={styles.overlayInfoTitle}>Daily Reminders</Text>,
                        <LottieView
                            source={require('@/assets/animations/notifications.json')}
                            autoPlay
                            loop={false}
                            style={{ width: 300, height: 150 }}
                        />,
                        <Text style={styles.overlayInfoText}>
                            When you need it most, you'll receive a reminder to keep you motivated.
                        </Text>,
                        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>,
                    ].map((child, i) => (
                        <Animated.View
                            key={i}
                            style={{
                                opacity: notifAnims[i],
                                transform: [{ translateY: notifAnims[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
                            }}
                        >
                            {child}
                        </Animated.View>
                    ))}
                </View>
            )}

            {/* Step 6: Widget */}
            {step === 6 && (
                <View style={styles.overlayInfo} pointerEvents="box-none">
                    {[
                        <Text style={styles.overlayInfoTitle}>Add your widget</Text>,
                        <LottieView
                            source={require('@/assets/animations/widget.json')}
                            autoPlay
                            loop={false}
                            style={{ width: 400, height: 300 }}
                        />,
                        <Text style={styles.overlayInfoText}>
                            Add your Discipl widget to your home screen — so you always have your daily affirmation in view without opening the app.
                        </Text>,
                        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>,
                    ].map((child, i) => (
                        <Animated.View
                            key={i}
                            style={{
                                opacity: widgetAnims[i],
                                transform: [{ translateY: widgetAnims[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
                            }}
                        >
                            {child}
                        </Animated.View>
                    ))}
                </View>
            )}
            {/* Step 7: Ready */}
            {step === 7 && (
                <View style={styles.overlayInfo} pointerEvents="box-none">
                    {[
                        <Text style={styles.readyTitle}>You're ready.</Text>,
                        <Text style={styles.overlayInfoText}>
                            Stay consistent, swipe daily, and build the right mindset to achieve your goals.
                        </Text>,
                        <TouchableOpacity style={styles.letsGoButton} onPress={nextStep}>
                            <Text style={styles.letsGoButtonText}>Let's go</Text>
                        </TouchableOpacity>,
                    ].map((child, i) => (
                        <Animated.View
                            key={i}
                            style={{
                                opacity: readyAnims[i],
                                transform: [{ translateY: readyAnims[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
                            }}
                        >
                            {child}
                        </Animated.View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.75)',
        zIndex: 10,
    },
    welcomeContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 16,
        zIndex: 30,
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
    },
    welcomeText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: 24,
    },
    nextButton: {
        backgroundColor: 'white',
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 100,
        marginTop: 8,
    },
    nextButtonText: {
        color: '#111',
        fontSize: 16,
        fontWeight: '700',
    },
    tooltipBottom: {
        position: 'absolute',
        bottom: 130,
        left: 32,
        right: 32,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        zIndex: 30,
    },
    tooltipTop: {
        position: 'absolute',
        top: 130,
        left: 32,
        right: 32,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        zIndex: 30,
    },
    tooltipSwipe: {
        position: 'absolute',
        bottom: 230,
        left: 32,
        right: 32,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        zIndex: 30,
    },
    overlayInfo: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 16,
        zIndex: 30,
    },
    overlayInfoTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
    },
    overlayInfoText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: 24,
    },
    readyTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
    },
    letsGoButton: {
        backgroundColor: 'white',
        paddingHorizontal: 56,
        paddingVertical: 16,
        borderRadius: 100,
        marginTop: 8,
    },
    letsGoButtonText: {
        color: '#111',
        fontSize: 18,
        fontWeight: '800',
    },
    tooltipText: {
        fontSize: 15,
        color: '#333',
        textAlign: 'center',
        lineHeight: 22,
    },
});
