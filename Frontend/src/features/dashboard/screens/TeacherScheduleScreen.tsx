import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { palette, metrics, typography } from '../../../theme/design';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const sessions = [
  { id: '1', time: '09:00 AM', title: 'Math', tag: 'Interactive', duration: '20 min', color: '#DCEBFF' },
  { id: '2', time: '09:30 AM', title: 'Break', tag: 'Sensory', duration: '10 min', color: '#E8FFF5' },
  { id: '3', time: '10:00 AM', title: 'English', tag: 'Reading', duration: '20 min', color: '#FFF3E6' },
  { id: '4', time: '11:00 AM', title: 'Art Class', tag: 'Creative', duration: '45 min', color: '#F5E8FF' },
];

const TeacherScheduleScreen = () => {
  const [activeDay, setActiveDay] = useState(0);
  const [locked, setLocked] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        {days.map((d, idx) => (
          <Pressable
            key={d}
            style={[styles.dayChip, idx === activeDay && styles.dayChipActive]}
            onPress={() => setActiveDay(idx)}
          >
            <Text style={[styles.dayText, idx === activeDay && styles.dayTextActive]}>{d}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.lockRow}>
        <Pressable style={styles.lockBtn} onPress={() => setLocked(v => !v)}>
          <Icon name={locked ? 'lock' : 'lock-open'} size={18} color={palette.primary} />
          <Text style={styles.lockText}>{locked ? 'Locked' : 'Lock Routine'}</Text>
        </Pressable>
        <Pressable style={styles.autoBtn}>
          <Icon name="magic-staff" size={18} color="#fff" />
          <Text style={styles.autoText}>Auto‑Generate Schedule</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {sessions.map(s => (
          <View key={s.id} style={styles.sessionRow}>
            <Text style={styles.time}>{s.time}</Text>
            <View style={[styles.sessionCard, { backgroundColor: s.color }]}>
              <View style={styles.sessionHead}>
                <Text style={styles.sessionTitle}>{s.title}</Text>
                <Text style={styles.duration}>{s.duration}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{s.tag}</Text>
              </View>
            </View>
          </View>
        ))}
        <Pressable style={styles.placeholder}>
          <Text style={styles.placeholderText}>Tap to add session</Text>
        </Pressable>
      </ScrollView>

      <Pressable style={styles.fab}>
        <Icon name="plus" size={24} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.background },
  header: {
    flexDirection: 'row',
    padding: metrics.spacing,
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
  },
  dayChipActive: { backgroundColor: palette.card, ...metrics.shadow },
  dayText: { color: palette.muted, fontWeight: '700' },
  dayTextActive: { color: palette.primary },
  lockRow: {
    paddingHorizontal: metrics.spacing,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    ...metrics.shadow,
  },
  lockText: { color: palette.primary, fontWeight: '700' },
  autoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  autoText: { color: '#fff', fontWeight: '700' },
  content: { padding: metrics.spacing, paddingBottom: 100 },
  sessionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: metrics.spacing },
  time: { width: 70, color: palette.muted, marginTop: 6 },
  sessionCard: {
    flex: 1,
    borderRadius: metrics.radius,
    padding: metrics.spacing,
  },
  sessionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessionTitle: { ...typography.title, fontSize: 18 },
  duration: { color: palette.muted },
  tag: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { color: palette.text, fontWeight: '600' },
  placeholder: {
    marginTop: 4,
    alignItems: 'center',
    padding: metrics.spacing,
    backgroundColor: palette.card,
    borderRadius: metrics.radius,
  },
  placeholderText: { color: palette.muted },
  fab: {
    position: 'absolute',
    right: metrics.spacing,
    bottom: metrics.spacing,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...metrics.shadow,
  },
});

export default TeacherScheduleScreen;
