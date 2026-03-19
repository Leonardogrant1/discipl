import { useState } from 'react';

import { SurveyQuestion } from '../survey-question';
import { StepProps } from '../types';

const OPTIONS = [
    'Feel more motivated',
    'Build more discipline',
    'Develop a stronger mindset',
    'Stay consistent',
    'Perform better',
    'Find daily inspiration',
];

export function GoalStep({ onContinue }: StepProps) {
    const [value, setValue] = useState<string | null>(null);

    return (
        <SurveyQuestion
            question="How do you want to feel?"
            subtext="What do you want to get out of Discipl?"
            options={OPTIONS}
            value={value}
            onChange={(v) => {
                setValue(v);
                onContinue();
            }}
        />
    );
}
