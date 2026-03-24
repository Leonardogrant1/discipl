import { useState } from 'react';

import { trackerManager } from '@/lib/tracking/tracker-manager';
import { useUserDataStore } from '@/stores/UserDataStore';
import { useOnboardingControl } from '../onboarding-control-context';
import { SurveyQuestion } from '../survey-question';

const OPTIONS = ['18–24', '25–34', '35–44', '45–54', '55+'];

export function AgeStep() {
    const { setCanContinue } = useOnboardingControl();
    const updateSettings = useUserDataStore((s) => s.updateSettings);
    const [value, setValue] = useState<string | null>(null);

    return (
        <SurveyQuestion
            question="How old are you?"
            subtext="This helps me tailor your experience"
            options={OPTIONS}
            value={value}
            onChange={(v) => {
                setValue(v);
                updateSettings({ age: v });
                setCanContinue(true);
                trackerManager.track('onboarding_age', { age: v });
            }}
        />
    );
}
