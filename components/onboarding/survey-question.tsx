import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    question: string;
    subtext?: string;
    options: string[];
    value: string | null;
    onChange: (value: string) => void;
};

export function SurveyQuestion({ question, subtext, options, value, onChange }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.question}>{question}</Text>
                {subtext && <Text style={styles.subtext}>{subtext}</Text>}
            </View>

            <View style={styles.options}>
                {options.map((option) => {
                    const selected = value === option;
                    return (
                        <TouchableOpacity
                            key={option}
                            style={[styles.option, selected && styles.optionSelected]}
                            onPress={() => onChange(option)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                                {option}
                            </Text>
                            <View style={[styles.radio, selected && styles.radioSelected]}>
                                {selected && <View style={styles.radioDot} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
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
        marginBottom: 40,
    },
    question: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtext: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 14,
        textAlign: 'center',
    },
    options: {
        gap: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1c1c1c',
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 18,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionSelected: {
        borderColor: 'white',
    },
    optionText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
    },
    optionTextSelected: {
        color: 'white',
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: 'white',
    },
    radioDot: {
        width: 11,
        height: 11,
        borderRadius: 6,
        backgroundColor: 'white',
    },
});
