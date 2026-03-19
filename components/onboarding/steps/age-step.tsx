import { useState } from 'react';

import { useOnboardingControl } from '../onboarding-control-context';
import { SurveyQuestion } from '../survey-question';

const OPTIONS = ['18–24', '25–34', '35–44', '45–54', '55+'];

export function AgeStep() {
    const { setCanContinue } = useOnboardingControl();
    const [value, setValue] = useState<string | null>(null);

    return (
        <SurveyQuestion
            question="How old are you?"
            subtext="This helps me tailor your experience"
            options={OPTIONS}
            value={value}
            onChange={(v) => {
                setValue(v);
                setCanContinue(true);
            }}
        />
    );
}
