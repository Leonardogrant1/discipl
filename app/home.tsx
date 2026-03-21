import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Share, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, ViewToken } from 'react-native';

import HeartIcon from '@/assets/icons/heart.svg';
import ShareIcon from '@/assets/icons/share.svg';
import UserIcon from '@/assets/icons/user.svg';
import { CategoriesModal } from '@/components/categories-modal';
import { SettingsModal } from '@/components/settings-modal';
import { Fonts } from '@/constants/theme';
import { buildFeed, Category, FeedQuote } from '@/data/quotes';
import { checkAndReschedule, scheduleNotifications } from '@/services/notifications';
import { posthog } from '@/services/posthog';
import { useUserDataStore } from '@/stores/UserDataStore';


export default function HomeScreen() {
    const { height } = useWindowDimensions();
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [categoriesVisible, setCategoriesVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const selectedCategories = useUserDataStore((s) => s.settings.selectedCategories) as Category[];
    const likedQuoteIds = useUserDataStore((s) => s.likedQuoteIds);
    const toggleLikedQuote = useUserDataStore((s) => s.toggleLikedQuote);
    const checkAndUpdateStreak = useUserDataStore((s) => s.checkAndUpdateStreak);
    const settings = useUserDataStore((s) => s.settings);

    useEffect(() => {
        checkAndUpdateStreak();
        checkAndReschedule(settings);
    }, []);

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        scheduleNotifications(settings);
    }, [
        settings.notificationsEnabled,
        settings.notificationsPerDay,
        settings.notificationStartHour,
        settings.notificationEndHour,
        settings.selectedCategories.join(','),
    ]);

    const feed = useMemo(() => buildFeed(selectedCategories), [selectedCategories]);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems[0]) setCurrentIndex(viewableItems[0].index ?? 0);
    });

    const currentQuote: FeedQuote | undefined = feed[currentIndex];

    function shareQuote(quote: FeedQuote) {
        const author = quote.author ? `\n— ${quote.author}` : '';
        Share.share({
            message: `"${quote.text}"${author}\n\n📲 Discipl – Daily quotes & affirmations for athletes\nhttps://apps.apple.com/app/discipl`,
        });
    }

    const likeCount = Math.min(likedQuoteIds.length, 5);
    const likeProgress = likeCount / 5;

    const heartsOpacity = useRef(new Animated.Value(likedQuoteIds.length >= 5 ? 0 : 1)).current;
    const heartsScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (likedQuoteIds.length === 5) {
            posthog.capture('five_likes_reached');
            Animated.sequence([
                Animated.spring(heartsScale, { toValue: 1.3, useNativeDriver: true }),
                Animated.spring(heartsScale, { toValue: 1, useNativeDriver: true }),
                Animated.delay(400),
                Animated.timing(heartsOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
            ]).start();
        }
    }, [likedQuoteIds.length]);

    const swipeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(swipeAnim, { toValue: -8, duration: 600, useNativeDriver: true }),
                Animated.timing(swipeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
            ])
        ).start();
    }, []);





    return (
        <View style={styles.container}>
            {/* Scrolling quote feed */}
            <FlatList
                data={feed}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={height}
                decelerationRate="fast"
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                renderItem={({ item }) => (
                    <View style={[styles.card, { height }]}>
                        <View style={styles.placeholder} />
                        <View style={styles.overlay} />
                        <View style={styles.quoteContainer}>
                            <Text style={[styles.quoteText, { fontFamily: Fonts?.serif }]}>{item.text}</Text>
                        </View>
                    </View>
                )}
            />

            {/* Fixed UI overlay */}
            <View style={styles.fixedOverlay} pointerEvents="box-none">
                {/* Top bar */}
                <View style={styles.topBar} pointerEvents="box-none">
                    <View style={{ width: 22 }} />
                    <Animated.View style={[styles.heartsRow, { opacity: heartsOpacity, transform: [{ scale: heartsScale }] }]}>
                        <HeartIcon width={15} height={15} color="white" />
                        <Text style={styles.heartsText}>{likeCount}/5</Text>
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: `${likeProgress * 100}%` }]} />
                        </View>
                    </Animated.View>
                    <TouchableOpacity style={styles.iconButton} onPress={() => setSettingsVisible(true)}>
                        <UserIcon width={22} height={22} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Action icons */}
                <View style={styles.actionsRow} pointerEvents="box-none">
                    <TouchableOpacity style={styles.actionButton} onPress={() => currentQuote && shareQuote(currentQuote)}>
                        <View style={[styles.iconButton, {
                            backgroundColor: 'rgba(20,20,20,0.85)',
                        }]}>
                            <ShareIcon width={26} height={26} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => currentQuote && toggleLikedQuote(currentQuote.id)}>
                        <View style={[styles.iconButton, { backgroundColor: currentQuote && likedQuoteIds.includes(currentQuote.id) ? '#f92f2c57' : 'rgba(20,20,20,0.85)' }]}>
                            <HeartIcon width={26} height={26} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Swipe hint */}
                <Animated.View style={[styles.swipeHint, { transform: [{ translateY: swipeAnim }] }]} pointerEvents="none">
                    <MaterialIcons name="keyboard-arrow-up" size={20} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.swipeText}>SWIPE UP FOR NEXT QUOTE</Text>
                </Animated.View>

                {/* Category badge */}
                <TouchableOpacity style={styles.categoryBadge} onPress={() => setCategoriesVisible(true)}>
                    <Text style={styles.categoryText}>{currentQuote?.category.toUpperCase()}</Text>
                </TouchableOpacity>
            </View>

            {__DEV__ && (
                <TouchableOpacity
                    style={styles.debugButton}
                    onPress={() => {
                        useUserDataStore.setState({ hasCompletedOnboarding: false });
                        router.replace('/start');
                    }}
                >
                    <Text style={styles.debugButtonText}>⚙ Onboarding</Text>
                </TouchableOpacity>
            )}

            <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
            <CategoriesModal visible={categoriesVisible} onClose={() => setCategoriesVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    card: {
        backgroundColor: '#111',
    },
    placeholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#2a2a2a',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    quoteContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingBottom: 80,
    },
    quoteText: {
        color: 'white',
        fontSize: 30,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 40,
    },
    fixedOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    topBar: {
        position: 'absolute',
        top: 56,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 15,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartsRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    heartsText: {
        color: 'white',
        fontSize: 13,
    },
    progressTrack: {
        width: 80,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 1,
    },
    progressFill: {
        width: '0%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 1,
    },
    actionsRow: {
        position: 'absolute',
        bottom: 230,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 36,
    },
    actionButton: {
        padding: 8,
    },
    swipeHint: {
        position: 'absolute',
        bottom: 150,
        left: 0,
        right: 0,
        alignItems: 'center',
        gap: 2,
    },
    swipeText: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 11,
        letterSpacing: 1.2,
    },
    categoryBadge: {
        position: 'absolute',
        bottom: 36,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    categoryText: {
        backgroundColor: 'rgba(20,20,20,0.85)',
        color: 'white',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 2,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 24,
        overflow: 'hidden',
    },
    debugButton: {
        position: 'absolute',
        bottom: 100,
        right: 16,
        backgroundColor: 'rgba(255,59,48,0.85)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    debugButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});
