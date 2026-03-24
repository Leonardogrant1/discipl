import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type OptionPickerProps = {
    type: 'options';
    options: string[];
};

type TextFieldProps = {
    type: 'text';
    placeholder?: string;
};

type BaseProps = {
    visible: boolean;
    title: string;
    value: string | null;
    onSave: (value: string) => void;
    onClose: () => void;
};

type Props = BaseProps & (OptionPickerProps | TextFieldProps);

import { Modal } from 'react-native';

export function EditFieldModal(props: Props) {
    const { visible, title, value, onSave, onClose } = props;
    const [draft, setDraft] = useState(value ?? '');
    const inputRef = useRef<TextInput>(null);

    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        if (visible) {
            setDraft(value ?? '');
            Animated.parallel([
                Animated.timing(overlayOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start(() => {
                if (props.type === 'text') {
                    setTimeout(() => inputRef.current?.focus(), 50);
                }
            });
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

    function handleSave() {
        if (!draft) return;
        onSave(draft);
        handleClose();
    }

    function handleOptionSelect(option: string) {
        onSave(option);
        handleClose();
    }

    return (
        <Modal visible={visible} animationType="none" transparent onRequestClose={handleClose}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Animated.View style={[styles.backdrop, { opacity: overlayOpacity }]}>
                    <Pressable style={styles.backdropPressable} onPress={handleClose}>
                        <Pressable onPress={(e) => e.stopPropagation()}>
                            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                                <View style={styles.handle} />

                                <View style={styles.header}>
                                    <Text style={styles.title}>{title}</Text>
                                    <TouchableOpacity onPress={handleClose}>
                                        <MaterialIcons name="close" size={22} color="rgba(255,255,255,0.6)" />
                                    </TouchableOpacity>
                                </View>

                                {props.type === 'text' && (
                                    <>
                                        <TextInput
                                            ref={inputRef}
                                            style={styles.input}
                                            value={draft}
                                            onChangeText={setDraft}
                                            placeholder={props.placeholder ?? ''}
                                            placeholderTextColor="rgba(255,255,255,0.3)"
                                            returnKeyType="done"
                                            onSubmitEditing={handleSave}
                                        />
                                        <TouchableOpacity
                                            style={[styles.saveButton, !draft && styles.saveButtonDisabled]}
                                            onPress={handleSave}
                                            disabled={!draft}
                                        >
                                            <Text style={styles.saveButtonText}>Save</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {props.type === 'options' && (
                                    <View style={styles.optionList}>
                                        {props.options.map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                style={styles.optionRow}
                                                onPress={() => handleOptionSelect(option)}
                                            >
                                                <Text style={styles.optionText}>{option}</Text>
                                                {value === option && (
                                                    <MaterialIcons name="check" size={18} color="white" />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </Animated.View>
                        </Pressable>
                    </Pressable>
                </Animated.View>
            </KeyboardAvoidingView>
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
    title: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: 'white',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: 'white',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.35,
    },
    saveButtonText: {
        color: '#0d0d0d',
        fontSize: 15,
        fontWeight: '700',
    },
    optionList: {
        gap: 2,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    optionText: {
        color: 'white',
        fontSize: 16,
    },
});
