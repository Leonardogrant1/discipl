import { useState } from 'react';

import { useUserDataStore } from '@/stores/UserDataStore';

import { MultiPicker } from '../multi-picker';
import { useOnboardingControl } from '../onboarding-control-context';

const OPTIONS = [
    { emoji: '💪', label: 'Discipline & consistency' },
    { emoji: '🧠', label: 'Mental strength' },
    { emoji: '🎯', label: 'Focus & productivity' },
    { emoji: '😤', label: 'Motivation' },
    { emoji: '🏆', label: 'Performance & results' },
    { emoji: '🔥', label: 'Confidence' },
    { emoji: '⚡', label: 'Energy levels' }
];

export function ImprovementStep() {
    const updateSettings = useUserDataStore((s) => s.updateSettings);
    const { setCanContinue } = useOnboardingControl();
    const [value, setValue] = useState<string[]>([]);

    return (
        <MultiPicker
            question="What areas in your life need improvement?"
            subtext="Choose at least one"
            options={OPTIONS}
            value={value}
            onChange={(v) => {
                setValue(v);
                updateSettings({ improvements: v });
                setCanContinue(v.length > 0);
            }}
        />
    );
}
