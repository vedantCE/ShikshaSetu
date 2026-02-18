import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, metrics, typography } from '../../../theme/design';

const Row = ({ label, value, onChange }: any) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Switch value={value} onValueChange={onChange} thumbColor={value ? palette.primary : '#ccc'} />
  </View>
);

const TeacherSettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Sarah Johnson</Text>
          <Text style={styles.meta}>Grade 4 • Room 202</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Preferences</Text>
          <Row label="Push Notifications" value={notifications} onChange={setNotifications} />
          <Row label="Auto Sync Data" value={autoSync} onChange={setAutoSync} />
          <Row label="Insights & Analytics" value={analytics} onChange={setAnalytics} />
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
  title: { ...typography.title, marginBottom: 6 },
  subtitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  meta: { color: palette.muted, marginTop: 2 },
  row: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: { color: palette.text, fontSize: 16, fontWeight: '600' },
});

export default TeacherSettingsScreen;
