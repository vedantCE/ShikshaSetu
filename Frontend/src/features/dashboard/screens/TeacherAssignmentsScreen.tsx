import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { palette, metrics, typography } from '../../../theme/design';

const templates = [
  { id: '1', title: 'Sensory Focus: Audio', desc: 'Identify and distinguish distant sounds in a busy environment.' },
  { id: '2', title: 'Social Cues: Emotions', desc: 'Interactive quiz on recognizing facial expressions and emotions.' },
  { id: '3', title: 'Pattern Recognition', desc: 'Exercises focused on identifying sequences and visual patterns.' },
];

const chips = ['All', 'Learning Modules', 'Practice Tasks'];

const TeacherAssignmentsScreen = () => {
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState(0);

  const list = useMemo(
    () => templates.filter(t => t.title.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Assignments Hub</Text>
        <View style={styles.search}>
          <Icon name="magnify" size={20} color={palette.muted} />
          <TextInput
            placeholder="Search topics..."
            placeholderTextColor={palette.muted}
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
        </View>
        <View style={styles.chips}>
          {chips.map((c, i) => (
            <Pressable
              key={c}
              onPress={() => setActiveChip(i)}
              style={[styles.chip, activeChip === i && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeChip === i && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {list.map(t => (
          <View key={t.id} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconWrap}>
                <Icon name="book-open-variant" size={22} color={palette.primary} />
              </View>
              <View style={styles.flexOne}>
                <Text style={styles.cardTitle}>{t.title}</Text>
                <Text style={styles.cardDesc}>{t.desc}</Text>
              </View>
              <Pressable style={styles.assignBtn}>
                <Text style={styles.assignText}>Assign</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.background },
  header: { padding: metrics.spacing },
  title: { ...typography.title, marginBottom: metrics.spacing },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: metrics.radius,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: metrics.spacing,
  },
  input: { flex: 1, paddingVertical: 12, marginLeft: 8, color: palette.text },
  chips: { flexDirection: 'row', marginTop: metrics.spacing, gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
  },
  chipActive: { backgroundColor: palette.card, ...metrics.shadow },
  chipText: { color: palette.muted, fontWeight: '700' },
  chipTextActive: { color: palette.primary },
  content: { padding: metrics.spacing, paddingTop: 0 },
  card: {
    backgroundColor: palette.card,
    borderRadius: metrics.radius,
    padding: metrics.spacing,
    marginBottom: metrics.spacing,
    ...metrics.shadow,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexOne: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  cardDesc: { color: palette.muted, marginTop: 4 },
  assignBtn: {
    backgroundColor: palette.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  assignText: { color: '#fff', fontWeight: '700' },
});

export default TeacherAssignmentsScreen;
