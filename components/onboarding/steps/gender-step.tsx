import { useState } from 'react';

import { useUserDataStore } from '@/stores/UserDataStore';
import { Gender } from '@/types/user-data';

import { useOnboardingControl } from '../onboarding-control-context';
import { SurveyQuestion } from '../survey-question';

const OPTIONS: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say'];

export function GenderStep() {
    const updateSettings = useUserDataStore((s) => s.updateSettings);
    const { setCanContinue } = useOnboardingControl();
    const [value, setValue] = useState<string | null>(null);

    return (
        <SurveyQuestion
            question="How do you identify?"
            subtext="Help me personalize your journey"
            options={OPTIONS}
            value={value}
            onChange={(v) => {
                setValue(v);
                updateSettings({ gender: v as Gender });
                setCanContinue(true);
            }}
        />
    );
}
