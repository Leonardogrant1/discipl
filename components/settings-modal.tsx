import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FireIcon from '@/assets/icons/fire.svg';
import { EditFieldModal } from '@/components/modals/edit-field-modal';
import { NotificationSettingsModal } from '@/components/modals/notification-settings-modal';
import { useUserDataStore } from '@/stores/UserDataStore';

const AGE_OPTIONS = ['18–24', '25–34', '35–44', '45–54', '55+'];
const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'So'];

function getCurrentWeekDates(): string[] {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

const LEGAL_ROWS = [
  { label: 'Terms of Use', url: 'https://northbyte.studio/terms-of-service/discipl' },
  { label: 'Privacy Policy', url: 'https://northbyte.studio/privacy-policy/discipl' },
];

type EditField = 'name' | 'age' | null;

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function SettingsModal({ visible, onClose }: Props) {
  const streak = useUserDataStore((s) => s.streak);
  const settings = useUserDataStore((s) => s.settings);
  const updateSettings = useUserDataStore((s) => s.updateSettings);
  const weekDates = getCurrentWeekDates();
  const [editField, setEditField] = useState<EditField>(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const settingsRows = [
    { label: 'Name', value: settings.name || '—', field: 'name' as EditField, onPress: undefined },
    { label: 'Age', value: settings.age || '—', field: 'age' as EditField, onPress: undefined },
    { label: 'Notifications', value: undefined, field: null, onPress: () => setNotificationsVisible(true) },
    // { label: 'Widget', value: undefined, field: null, onPress: undefined },
    { label: 'Manage Subscriptions', value: undefined, field: null, onPress: () => Linking.openURL('https://apps.apple.com/account/subscriptions') },
    { label: 'Feature Request', value: undefined, field: null, onPress: () => WebBrowser.openBrowserAsync('https://northbyte.studio/features/discipl') },
    { label: 'Bug Report', value: undefined, field: null, onPress: () => WebBrowser.openBrowserAsync('https://northbyte.studio/bugs/discipl') },
  ];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.appTitle}>Discipl</Text>

          <View style={styles.streakLabel}>
            <Text style={styles.sectionLabel}>Your streak</Text>
            <FireIcon style={{ marginBottom: 5 }} width={22} height={22} />
          </View>
          <View style={styles.streakCard}>
            <View style={styles.streakLeft}>
              <Text style={styles.streakCount}>{streak.currentStreak}</Text>
              <Text style={styles.streakDaysLabel}>Days</Text>
            </View>
            <View style={styles.streakRight}>
              <View style={styles.weekRow}>
                {DAYS.map((day) => (
                  <Text key={day} style={styles.dayLabel}>{day}</Text>
                ))}
              </View>
              <View style={styles.weekRow}>
                {weekDates.map((date, i) => {
                  const active = streak.activeDays.includes(date);
                  return (
                    <MaterialIcons
                      key={i}
                      name={active ? 'check-circle' : 'check-circle-outline'}
                      size={22}
                      color={active ? 'white' : 'rgba(255,255,255,0.2)'}
                    />
                  );
                })}
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Settings</Text>
          <View style={styles.rowGroup}>
            {settingsRows.map((row, i) => (
              <TouchableOpacity
                key={row.label}
                style={[styles.row, i < settingsRows.length - 1 && styles.rowBorder]}
                onPress={() => row.onPress ? row.onPress() : row.field && setEditField(row.field)}
              >
                <Text style={styles.rowLabel}>{row.label}</Text>
                <View style={styles.rowRight}>
                  {row.value !== undefined && (
                    <Text style={styles.rowValue}>{row.value}</Text>
                  )}
                  <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.4)" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Legal</Text>
          <View style={styles.rowGroup}>
            {LEGAL_ROWS.map((row, i) => (
              <TouchableOpacity
                key={row.label}
                style={[styles.row, i < LEGAL_ROWS.length - 1 && styles.rowBorder]}
                onPress={() => WebBrowser.openBrowserAsync(row.url)}
              >
                <Text style={styles.rowLabel}>{row.label}</Text>
                <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <NotificationSettingsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />

      <EditFieldModal
        visible={editField === 'name'}
        title="Name"
        type="text"
        placeholder="Your name"
        value={settings.name}
        onSave={(v) => updateSettings({ name: v })}
        onClose={() => setEditField(null)}
      />

      <EditFieldModal
        visible={editField === 'age'}
        title="Age"
        type="options"
        options={AGE_OPTIONS}
        value={settings.age}
        onSave={(v) => updateSettings({ age: v })}
        onClose={() => setEditField(null)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  closeButton: {
    marginBottom: 24,
  },
  appTitle: {
    color: 'white',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionLabel: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  streakLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakCard: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
    alignItems: 'center',
  },
  streakLeft: {
    alignItems: 'center',
    marginRight: 20,
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  streakCount: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
  },
  streakDaysLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  streakRight: {
    flex: 1,
    gap: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    width: 22,
    textAlign: 'center',
  },
  rowGroup: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    marginBottom: 28,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  rowLabel: {
    color: 'white',
    fontSize: 15,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
  },
});
