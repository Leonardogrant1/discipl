import { useUserDataStore } from '@/stores/UserDataStore';
import { Redirect } from 'expo-router';

export default function Index() {
    const hasCompletedOnboarding = useUserDataStore((s) => s.hasCompletedOnboarding);

    console.log(hasCompletedOnboarding);


    if (!hasCompletedOnboarding) {
        return <Redirect href="/start" />
    }

    return <Redirect href="/home" />
}

