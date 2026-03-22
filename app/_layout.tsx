import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

import { NotificationProvider } from '@/contexts/NotificationContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RevenueCatProvider } from '@/services/revenuecat/providers/RevenueCatProvider';
import { devLog } from '@/utils/dev-log';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    devLog('🔔 handleNotification triggered:', JSON.stringify(notification))
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }
  },
  handleSuccess: (id) => devLog('✅ handleSuccess:', id),
  handleError: (id, error) => devLog('❌ handleError:', id, error),
})

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <KeyboardProvider>
      <RevenueCatProvider>
        <NotificationProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Slot />
            <StatusBar style="auto" />
          </ThemeProvider>
        </NotificationProvider>
      </RevenueCatProvider>
    </KeyboardProvider>
  );
}
