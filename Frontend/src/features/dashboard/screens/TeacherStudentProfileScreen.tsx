import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';
import { palette, metrics, typography } from '../../../theme/design';

const TeacherStudentProfileScreen = ({ route }: any) => {
  const { students } = useAuth();
  const id = route?.params?.id as string | undefined;
  const student = students.find(s => s.id === id) || students[0] || { name: 'Student', age: 10 };

  const focuses = [
    { label: 'Focus & Attention', value: 0.7 },
    { label: 'Social Communication', value: 0.5 },
    { label: 'Task Initiation', value: 0.35 },
  ];

  const observations = [
    { id: '1', text: 'Had a great group activity today. Showed improved turn-taking.' },
    { id: '2', text: 'Struggled slightly with transitions. Improved with visual schedule.' },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            {student.avatar ? (
              <Image source={student.avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>
                  {student.name?.[0]?.toUpperCase() || 'S'}
                </Text>
              </View>
            )}
            <View style={styles.flexOne}>
              <Text style={styles.title}>{student.name}</Text>
              <Text style={styles.subtitle}>Grade • 4  |  Room • 202</Text>
            </View>
            <Pressable style={styles.iconBtn}>
              <Icon name="dots-horizontal" size={20} color={palette.muted} />
            </Pressable>
          </View>
          <View style={styles.actionsRow}>
            <Pressable style={styles.action}>
              <Icon name="pencil" size={18} color={palette.primary} />
              <Text style={styles.actionText}>Edit Profile</Text>
            </Pressable>
            <Pressable style={styles.action}>
              <Icon name="camera" size={18} color={palette.primary} />
              <Text style={styles.actionText}>Snapshot</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Focus Areas</Text>
          {focuses.map(f => (
            <View key={f.label} style={styles.progressRow}>
              <Text style={styles.progressLabel}>{f.label}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${f.value * 100}%` }]} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Observations</Text>
          {observations.map(o => (
            <View key={o.id} style={styles.obsItem}>
              <View style={styles.obsDot} />
              <Text style={styles.obsText}>{o.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.background },
  content: { padding: metrics.spacing },
  card: {
    backgroundColor: palette.card,
    borderRadius: metrics.radius,
    padding: metrics.spacing,
    marginBottom: metrics.spacing,
    ...metrics.shadow,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5EDFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarFallbackText: { color: palette.primary, fontWeight: '800', fontSize: 18 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.title },
  subtitle: { ...typography.subtitle, marginTop: 4 },
  flexOne: { flex: 1 },
  actionsRow: { flexDirection: 'row', gap: metrics.spacing, marginTop: metrics.spacing },
  action: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#F8FAFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  actionText: { color: palette.primary, fontWeight: '700' },
  cardTitle: { ...typography.title, fontSize: 18, marginBottom: 8 },
  progressRow: { marginTop: 10 },
  progressLabel: { color: palette.muted, marginBottom: 6, fontWeight: '600' },
  progressTrack: {
    height: 10,
    backgroundColor: '#EEF2F7',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: { height: 10, backgroundColor: palette.primary, borderRadius: 8 },
  obsItem: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },
  obsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.success,
    marginTop: 8,
    marginRight: 8,
  },
  obsText: { color: palette.text, flex: 1 },
});

export default TeacherStudentProfileScreen;
