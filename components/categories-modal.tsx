import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ALL_CATEGORIES, Category } from '@/data/quotes';
import { trackerManager } from '@/lib/tracking/tracker-manager';
import { useUserDataStore } from '@/stores/UserDataStore';

const CATEGORY_LABELS: Record<Category, string> = {
  discipline: 'Discipline',
  mindset: 'Winner Mindset',
  strength: 'Mental Strength',
  confidence: 'Confidence',
  resilience: 'Resilience',
  affirmations: 'Affirmations',
  focus: 'Focus',
  purpose: 'Purpose',
};

const CATEGORY_SUBTEXTS: Record<Category, string> = {
  discipline: 'Stay focused & consistent',
  mindset: 'Think like a champion',
  strength: 'Push through any obstacle',
  confidence: 'Believe in yourself',
  resilience: 'Bounce back stronger',
  affirmations: 'Speak your power into existence',
  focus: 'Eliminate noise, execute deep',
  purpose: 'Know your why, own your path',
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

function CategoryCard({ category, selected }: { category: Category; selected: boolean }) {
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      {selected && (
        <MaterialIcons name="check-circle-outline" size={20} color="white" style={styles.cardCheck} />
      )}
      <Text style={styles.cardName}>{CATEGORY_LABELS[category]}</Text>
      <Text style={styles.cardSubtext}>{CATEGORY_SUBTEXTS[category]}</Text>
    </View>
  );
}

export function CategoriesModal({ visible, onClose }: Props) {
  const selectedCategories = useUserDataStore((s) => s.settings.selectedCategories) as Category[];
  const updateSettings = useUserDataStore((s) => s.updateSettings);

  function toggleCategory(cat: Category) {
    const isSelected = selectedCategories.includes(cat);
    if (isSelected && selectedCategories.length === 1) return;
    const next = isSelected
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    updateSettings({ selectedCategories: next });
    trackerManager.track('category_toggled', { category: cat, selected: !isSelected });
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Categories</Text>

          <View style={styles.grid}>
            {ALL_CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat} style={styles.gridItem} onPress={() => toggleCategory(cat)}>
                <CategoryCard category={cat} selected={selectedCategories.includes(cat)} />
              </TouchableOpacity>
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
  createMixButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0ece0',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    marginBottom: 32,
  },
  createMixText: {
    color: '#111',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  sectionLabel: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  gridItem: {
    width: '47%',
  },
  card: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 16,
    minHeight: 90,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: 'rgba(255,255,255,0.4)',
  },
  cardCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  cardName: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtext: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
  },
});
