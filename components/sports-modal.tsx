import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CATEGORIES, SportCard } from '@/components/sport-card';
import { useUserDataStore } from '@/stores/UserDataStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function SportsModal({ visible, onClose }: Props) {
  const selectedSports = useUserDataStore((s) => s.settings.selectedSports);
  const updateSettings = useUserDataStore((s) => s.updateSettings);

  function toggleSport(slug: string) {
    const isSelected = selectedSports.includes(slug);
    if (isSelected && selectedSports.length === 1) return;
    const next = isSelected
      ? selectedSports.filter((s) => s !== slug)
      : [...selectedSports, slug];
    updateSettings({ selectedSports: next });
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Your Sport</Text>

          <View style={styles.grid}>
            {CATEGORIES.map((cat) => (
              <SportCard
                key={cat.slug}
                label={cat.label}
                examples={cat.examples}
                image={cat.image}
                selected={selectedSports.includes(cat.slug)}
                onPress={() => toggleSport(cat.slug)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
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
  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
