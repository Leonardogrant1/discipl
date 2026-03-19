import { useState } from 'react';

import { useUserDataStore } from '@/stores/UserDataStore';

import { useOnboardingControl } from '../onboarding-control-context';
import { SurveyQuestion } from '../survey-question';

const OPTIONS = [
    'This is new for me',
    "I've used them occasionally",
    'I use them regularly',
];

export function AffirmationsFamiliarityStep() {
    const name = useUserDataStore((s) => s.settings.name);
    const { setCanContinue } = useOnboardingControl();
    const [value, setValue] = useState<string | null>(null);

    const displayName = name.trim() || 'Athlete';

    return (
        <SurveyQuestion
            question={`How familiar are you with affirmations, ${displayName}?`}
            subtext="Your experience will be personalized to match your level"
            options={OPTIONS}
            value={value}
            onChange={(v) => {
                setValue(v);
                setCanContinue(true);
            }}
        />
    );
}
