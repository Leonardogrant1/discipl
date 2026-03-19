import { StyleSheet, Text, View } from 'react-native';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function getTodayIndex(): number {
    const day = new Date().getDay(); // 0 = Sun
    return day === 0 ? 6 : day - 1;  // Mo = 0 ... Su = 6
}

export function HabitStep() {
    const todayIndex = getTodayIndex();

    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>🔥</Text>

            <View style={styles.textBlock}>
                <Text style={styles.title}>Build your daily habit</Text>
                <Text style={styles.subtitle}>Consistency is key to lasting change</Text>
            </View>

            <View style={styles.weekRow}>
                {DAYS.map((day, i) => {
                    const isToday = i === todayIndex;
                    return (
                        <View key={day} style={styles.dayColumn}>
                            <Text style={[styles.dayLabel, isToday && styles.dayLabelActive]}>
                                {day}
                            </Text>
                            <View style={[styles.dayDot, isToday && styles.dayDotActive]}>
                                {isToday && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                        </View>
                    );
                })}
            </View>

            <Text style={styles.hint}>Start small and stay consistent</Text>

            <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🔥</Text>
                <Text style={styles.statText}>
                    People with 7-day streaks are 3x more likely to form lasting habits
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
    },
    emoji: {
        fontSize: 72,
    },
    textBlock: {
        alignItems: 'center',
        gap: 10,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 15,
        textAlign: 'center',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    dayColumn: {
        alignItems: 'center',
        gap: 10,
    },
    dayLabel: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 13,
        fontWeight: '500',
    },
    dayLabelActive: {
        color: 'white',
        fontWeight: '700',
    },
    dayDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayDotActive: {
        backgroundColor: '#e05c2a',
    },
    checkmark: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    hint: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 14,
    },
    statCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#1c1c1c',
        borderRadius: 14,
        padding: 18,
        gap: 14,
    },
    statEmoji: {
        fontSize: 28,
    },
    statText: {
        flex: 1,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        lineHeight: 21,
    },
});
