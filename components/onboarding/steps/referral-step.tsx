import { useState } from 'react';

import { useOnboardingControl } from '../onboarding-control-context';
import { SurveyQuestion } from '../survey-question';

const OPTIONS = ['Instagram', 'TikTok', 'YouTube', 'Friend or family', 'Google', 'Other'];

export function ReferralStep() {
    const { setCanContinue } = useOnboardingControl();
    const [value, setValue] = useState<string | null>(null);

    return (
        <SurveyQuestion
            question="Where did you hear about us?"
            subtext="Help us understand how you found Discipl"
            options={OPTIONS}
            value={value}
            onChange={(v) => {
                setValue(v);
                setCanContinue(true);
            }}
        />
    );
}
