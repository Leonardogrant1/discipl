import { useOnboardingControl } from '../onboarding-control-context';
import { useUserDataStore } from '@/stores/UserDataStore';
import { CATEGORIES, SportCard } from '@/components/sport-card';
import { StyleSheet, Text, View } from 'react-native';

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
                    <SportCard
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
});
