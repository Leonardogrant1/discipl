import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useUserDataStore } from '@/stores/UserDataStore';

const MIN = 1;
const MAX = 10;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function formatHour(hour: number): string {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
}

type HourPickerProps = {
    visible: boolean;
    value: number;
    onSelect: (hour: number) => void;
    onClose: () => void;
};

function HourPicker({ visible, value, onSelect, onClose }: HourPickerProps) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.hourBackdrop} activeOpacity={1} onPress={onClose} />
            <View style={styles.hourSheet}>
                <View style={styles.handle} />
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

type Props = {
    visible: boolean;
    onClose: () => void;
};

export function NotificationSettingsModal({ visible, onClose }: Props) {
    const settings = useUserDataStore((s) => s.settings);
    const updateSettings = useUserDataStore((s) => s.updateSettings);

    const [count, setCount] = useState(settings.notificationsPerDay);
    const [startHour, setStartHour] = useState(settings.notificationStartHour);
    const [endHour, setEndHour] = useState(settings.notificationEndHour);
    const [picker, setPicker] = useState<'start' | 'end' | null>(null);

    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        if (visible) {
            setCount(settings.notificationsPerDay);
            setStartHour(settings.notificationStartHour);
            setEndHour(settings.notificationEndHour);
            Animated.parallel([
                Animated.timing(overlayOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    function handleClose() {
        Animated.parallel([
            Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
        ]).start(() => onClose());
    }

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
        <Modal visible={visible} animationType="none" transparent onRequestClose={handleClose}>
            <Animated.View style={[styles.backdrop, { opacity: overlayOpacity }]}>
                <Pressable style={styles.backdropPressable} onPress={handleClose}>
                    <Pressable onPress={(e) => e.stopPropagation()}>
                        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                            <View style={styles.handle} />

                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>Notifications</Text>
                                <TouchableOpacity onPress={handleClose}>
                                    <MaterialIcons name="close" size={22} color="rgba(255,255,255,0.6)" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.card}>
                                <View style={styles.row}>
                                    <Text style={styles.rowLabel}>How many per day</Text>
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

                                <TouchableOpacity style={styles.row} onPress={() => setPicker('start')}>
                                    <Text style={styles.rowLabel}>Start at</Text>
                                    <View style={styles.timeChip}>
                                        <Text style={styles.timeChipText}>{formatHour(startHour)}</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.divider} />

                                <TouchableOpacity style={styles.row} onPress={() => setPicker('end')}>
                                    <Text style={styles.rowLabel}>End at</Text>
                                    <View style={styles.timeChip}>
                                        <Text style={styles.timeChipText}>{formatHour(endHour)}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.summary}>
                                {count} notification{count > 1 ? 's' : ''} per day between {formatHour(startHour)} and {formatHour(endHour)}
                            </Text>
                        </Animated.View>
                    </Pressable>
                </Pressable>
            </Animated.View>

            <HourPicker
                visible={picker === 'start'}
                value={startHour}
                onSelect={handleStartSelect}
                onClose={() => setPicker(null)}
            />
            <HourPicker
                visible={picker === 'end'}
                value={endHour}
                onSelect={handleEndSelect}
                onClose={() => setPicker(null)}
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    backdropPressable: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#1c1c1c',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
        gap: 16,
    },
    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'center',
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    headerTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#2a2a2a',
        borderRadius: 14,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    rowLabel: {
        color: 'white',
        fontSize: 15,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 16,
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    counterButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterValue: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
        minWidth: 28,
        textAlign: 'center',
    },
    timeChip: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    timeChipText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    summary: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    hourBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    hourSheet: {
        backgroundColor: '#1c1c1c',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '55%',
        paddingBottom: 40,
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
