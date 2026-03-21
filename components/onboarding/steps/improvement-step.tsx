import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ALL_CATEGORIES, Category } from '@/data/quotes';
import { useUserDataStore } from '@/stores/UserDataStore';

import { useOnboardingControl } from '../onboarding-control-context';

const CATEGORY_META: Record<Category, { title: string; subtext: string }> = {
    discipline: { title: 'Discipline', subtext: 'Stay consistent, no matter what' },
    mindset: { title: 'Winner Mindset', subtext: 'Think bigger, grow stronger' },
    strength: { title: 'Mental Strength', subtext: 'Train the muscle between your ears' },
    confidence: { title: 'Confidence', subtext: 'Own the room, own yourself' },
    resilience: { title: 'Resilience', subtext: 'Bounce back harder every time' },
};

function CategoryCard({ category, selected }: { category: Category; selected: boolean }) {
    const { title, subtext } = CATEGORY_META[category];
    return (
        <View style={[styles.card, selected && styles.cardSelected]}>
            {selected && (
                <MaterialIcons
                    name="check-circle-outline"
                    size={20}
                    color="white"
                    style={styles.cardCheck}
                />
            )}
            <Text style={styles.cardName}>{title}</Text>
            <Text style={styles.cardSubtext}>{subtext}</Text>
        </View>
    );
}

export function ImprovementStep() {
    const selectedCategories = useUserDataStore((s) => s.settings.selectedCategories) as Category[];
    const updateSettings = useUserDataStore((s) => s.updateSettings);
    const { setCanContinue } = useOnboardingControl();

    useEffect(() => {
        setCanContinue(selectedCategories.length > 0);
    }, []);

    function toggleCategory(cat: Category) {
        const isSelected = selectedCategories.includes(cat);
        const next = isSelected
            ? selectedCategories.filter((c) => c !== cat)
            : [...selectedCategories, cat];
        updateSettings({ selectedCategories: next });
        setCanContinue(next.length > 0);
    }

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.question}>What topics fuel your mindset?</Text>
                <Text style={styles.subtext}>Choose at least one</Text>
            </View>

            <View style={styles.grid}>
                {ALL_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={styles.gridItem}
                        onPress={() => toggleCategory(cat)}
                        activeOpacity={0.7}
                    >
                        <CategoryCard category={cat} selected={selectedCategories.includes(cat)} />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 36,
    },
    question: {
        color: 'white',
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 34,
    },
    subtext: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 14,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridItem: {
        width: '100%',
    },
    card: {
        backgroundColor: '#1c1c1c',
        borderRadius: 12,
        padding: 16,
        minHeight: 90,
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: 'rgba(255,255,255,0.4)',
    },
    cardCheck: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    cardName: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardSubtext: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
});
