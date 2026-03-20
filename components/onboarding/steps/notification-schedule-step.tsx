import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useUserDataStore } from '@/stores/UserDataStore';
import LottieView from 'lottie-react-native';

const MIN = 1;
const MAX = 10;

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(hour: number): string {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
}

type HourPickerModalProps = {
    visible: boolean;
    value: number;
    onSelect: (hour: number) => void;
    onClose: () => void;
};

function HourPickerModal({ visible, value, onSelect, onClose }: HourPickerModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
            <View style={styles.sheet}>
                <View style={styles.sheetHandle} />
                <FlatList
                    data={HOURS}
                    keyExtractor={(h) => String(h)}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.hourRow, item === value && styles.hourRowSelected]}
                            onPress={() => { onSelect(item); onClose(); }}
                        >
                            <Text style={[styles.hourText, item === value && styles.hourTextSelected]}>
                                {formatHour(item)}
                            </Text>
                            {item === value && (
                                <MaterialIcons name="check" size={18} color="white" />
                            )}
                        </TouchableOpacity>
                    )}
                />
            </View>
        </Modal>
    );
}

export function NotificationScheduleStep() {
    const settings = useUserDataStore((s) => s.settings);
    const updateSettings = useUserDataStore((s) => s.updateSettings);

    const [count, setCount] = useState(settings.notificationsPerDay);
    const [startHour, setStartHour] = useState(settings.notificationStartHour);
    const [endHour, setEndHour] = useState(settings.notificationEndHour);
    const [picker, setPicker] = useState<'start' | 'end' | null>(null);

    function updateCount(next: number) {
        const clamped = Math.max(MIN, Math.min(MAX, next));
        setCount(clamped);
        updateSettings({ notificationsPerDay: clamped });
    }

    function handleStartSelect(hour: number) {
        setStartHour(hour);
        updateSettings({ notificationStartHour: hour });
    }

    function handleEndSelect(hour: number) {
        setEndHour(hour);
        updateSettings({ notificationEndHour: hour });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Schedule your quotes</Text>
                <Text style={styles.subtext}>
                    Let me know when you'd like to hear from me
                </Text>
            </View>

            <LottieView
                source={require('@/assets/animations/notifications.json')}
                autoPlay
                loop={false}
                style={{ width: "100%", height: 200 }}
            />

            <View style={styles.card}>
                {/* How many */}
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>How many</Text>
                    <View style={styles.counter}>
                        <TouchableOpacity style={styles.counterButton} onPress={() => updateCount(count - 1)}>
                            <MaterialIcons name="remove" size={20} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{count}x</Text>
                        <TouchableOpacity style={styles.counterButton} onPress={() => updateCount(count + 1)}>
                            <MaterialIcons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Start at */}
                <TouchableOpacity style={styles.row} onPress={() => setPicker('start')}>
                    <Text style={styles.rowLabel}>Start at</Text>
                    <View style={styles.timeChip}>
                        <Text style={styles.timeChipText}>{formatHour(startHour)}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* End at */}
                <TouchableOpacity style={styles.row} onPress={() => setPicker('end')}>
                    <Text style={styles.rowLabel}>End at</Text>
                    <View style={styles.timeChip}>
                        <Text style={styles.timeChipText}>{formatHour(endHour)}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={styles.summary}>
                You'll receive {count} notification{count > 1 ? 's' : ''} per day between{' '}
                {formatHour(startHour)} and {formatHour(endHour)}
            </Text>

            <HourPickerModal
                visible={picker === 'start'}
                value={startHour}
                onSelect={handleStartSelect}
                onClose={() => setPicker(null)}
            />
            <HourPickerModal
                visible={picker === 'end'}
                value={endHour}
                onSelect={handleEndSelect}
                onClose={() => setPicker(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
    },
    title: {
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
        lineHeight: 20,
    },
    card: {
        backgroundColor: '#1c1c1c',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    rowLabel: {
        color: 'white',
        fontSize: 16,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 20,
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    counterButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        minWidth: 32,
        textAlign: 'center',
    },
    timeChip: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    timeChipText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    summary: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    // Sheet modal
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        backgroundColor: '#1c1c1c',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '55%',
        paddingBottom: 40,
    },
    sheetHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    hourRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    hourRowSelected: {
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    hourText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
    },
    hourTextSelected: {
        color: 'white',
        fontWeight: '600',
    },
});
