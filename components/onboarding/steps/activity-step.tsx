import { useState } from 'react';

import { trackerManager } from '@/lib/tracking/tracker-manager';
import { useOnboardingControl } from '../onboarding-control-context';
import { SurveyQuestion } from '../survey-question';

const OPTIONS = [
    'Full-time athlete',
    'Train regularly',
    'Train occasionally',
    'Hobby athlete',
    'Just getting started',
];

export function ActivityStep() {
    const { setCanContinue } = useOnboardingControl();
    const [value, setValue] = useState<string | null>(null);

    return (
        <SurveyQuestion
            question="How active are you?"
            subtext="We'll tailor your feed to match your lifestyle"
            options={OPTIONS}
            value={value}
            onChange={(v) => {
                setValue(v);
                setCanContinue(true);
                trackerManager.track('onboarding_experience_level', { level: v });
            }}
        />
    );
}
