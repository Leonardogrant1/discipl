import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRef, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

type OptionPickerProps = {
    type: 'options';
    options: string[];
};

type TextInputProps = {
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

type Props = BaseProps & (OptionPickerProps | TextInputProps);

export function EditFieldModal(props: Props) {
    const { visible, title, value, onSave, onClose } = props;
    const [draft, setDraft] = useState(value ?? '');
    const inputRef = useRef<TextInput>(null);

    function handleOpen() {
        setDraft(value ?? '');
        if (props.type === 'text') {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }

    function handleSave() {
        if (!draft) return;
        onSave(draft);
        onClose();
    }

    function handleOptionSelect(option: string) {
        onSave(option);
        onClose();
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            onShow={handleOpen}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoid}
                pointerEvents="box-none"
            >
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
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
                                    style={[styles.optionRow, value === option && styles.optionRowSelected]}
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
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: 'flex-end',
        pointerEvents: 'box-none',
    },
    sheet: {
        backgroundColor: '#1c1c1c',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        gap: 16,
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
    optionRowSelected: {
        opacity: 1,
    },
    optionText: {
        color: 'white',
        fontSize: 16,
    },
});
