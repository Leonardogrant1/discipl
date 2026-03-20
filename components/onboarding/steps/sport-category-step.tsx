import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

import { useOnboardingControl } from '../onboarding-control-context';

const CATEGORIES: { label: string; examples: string; image: ImageSourcePropType }[] = [
    { label: 'Combat Sports', examples: 'Boxing, MMA, Wrestling...', image: require('@/assets/category-images/combat.jpg') },
    { label: 'Team Sports', examples: 'Football, Basketball...', image: require('@/assets/category-images/team.jpeg') },
    { label: 'Athletics', examples: 'Running, Jumping...', image: require('@/assets/category-images/athletics.jpg') },
    { label: 'Strength & Power', examples: 'Weightlifting, CrossFit...', image: require('@/assets/category-images/strength.jpg') },
    { label: 'Water Sports', examples: 'Swimming, Surfing...', image: require('@/assets/category-images/water.jpeg') },
    { label: 'Racket Sports', examples: 'Tennis, Badminton...', image: require('@/assets/category-images/racket.jpeg') },
    { label: 'Endurance', examples: 'Cycling, Triathlon...', image: require('@/assets/category-images/endurance.jpeg') },
    { label: 'Other', examples: '', image: require('@/assets/category-images/other.jpeg') },
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
    const [value, setValue] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <Text style={styles.question}>What's your sport?</Text>

            <View style={styles.grid}>
                {CATEGORIES.map((cat, i) => (
                    <CardItem
                        key={cat.label}
                        label={cat.label}
                        examples={cat.examples}
                        image={cat.image}
                        selected={value === cat.label}
                        onPress={() => {
                            setValue(cat.label);
                            setCanContinue(true);
                        }}
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
