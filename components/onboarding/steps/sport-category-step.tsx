import { useEffect, useRef } from 'react';
import { Animated, ImageBackground, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

import { useOnboardingControl } from '../onboarding-control-context';
import { useUserDataStore } from '@/stores/UserDataStore';

const CATEGORIES: { slug: string; label: string; examples: string; image: ImageSourcePropType }[] = [
    { slug: 'combat-sports', label: 'Combat Sports', examples: 'Boxing, MMA, Wrestling...', image: require('@/assets/category-images/combat.jpg') },
    { slug: 'team-sports', label: 'Team Sports', examples: 'Football, Basketball...', image: require('@/assets/category-images/team.jpeg') },
    { slug: 'athletics', label: 'Athletics', examples: 'Running, Jumping...', image: require('@/assets/category-images/athletics.jpg') },
    { slug: 'strength-power', label: 'Strength & Power', examples: 'Weightlifting, CrossFit...', image: require('@/assets/category-images/strength.jpg') },
    { slug: 'water-sports', label: 'Water Sports', examples: 'Swimming, Surfing...', image: require('@/assets/category-images/water.jpeg') },
    { slug: 'racket-sports', label: 'Racket Sports', examples: 'Tennis, Badminton...', image: require('@/assets/category-images/racket.jpeg') },
    { slug: 'endurance', label: 'Endurance', examples: 'Cycling, Triathlon...', image: require('@/assets/category-images/endurance.jpeg') },
    { slug: 'other', label: 'Other', examples: '', image: require('@/assets/category-images/other.jpeg') },
];

function CardItem({
    label,
    examples,
    image,
    selected,
    onPress,
}: {
    label: string;
    examples: string;
    image: ImageSourcePropType;
    selected: boolean;
    onPress: () => void;
}) {
    const overlayOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(overlayOpacity, {
            toValue: selected ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [selected]);

    return (
        <View style={styles.cardWrapper}>
            <Pressable onPress={onPress} style={{ flex: 1 }}>
                <ImageBackground source={image} style={[styles.card, selected && styles.cardSelected]} imageStyle={styles.cardImage}>
                    <Animated.View style={[styles.cardOverlay, { opacity: overlayOpacity }]} />
                    <Text style={styles.cardLabel}>{label}</Text>
                    {examples ? <Text style={styles.cardExamples}>{examples}</Text> : null}
                </ImageBackground>
            </Pressable>
        </View>
    );
}

export function SportCategoryStep() {
    const { setCanContinue } = useOnboardingControl();
    const selectedSports = useUserDataStore((s) => s.settings.selectedSports);
    const updateSettings = useUserDataStore((s) => s.updateSettings);

    const toggle = (slug: string) => {
        const isSelected = selectedSports.includes(slug);
        const next = isSelected
            ? selectedSports.filter((s) => s !== slug)
            : [...selectedSports, slug];
        updateSettings({ selectedSports: next });
        setCanContinue(next.length > 0);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.question}>What's your sport?</Text>

            <View style={styles.grid}>
                {CATEGORIES.map((cat) => (
                    <CardItem
                        key={cat.slug}
                        label={cat.label}
                        examples={cat.examples}
                        image={cat.image}
                        selected={selectedSports.includes(cat.slug)}
                        onPress={() => toggle(cat.slug)}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 24,
        justifyContent: 'center',
    },
    question: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 28,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 28,
    },
    cardWrapper: {
        width: '47%',
        height: 120,
    },
    card: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        minHeight: 120,
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    cardImage: {
        borderRadius: 12,
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
    },
    cardSelected: {
        borderColor: 'rgba(255,255,255,0.6)',
    },
    cardLabel: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    cardExamples: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
    },
});
