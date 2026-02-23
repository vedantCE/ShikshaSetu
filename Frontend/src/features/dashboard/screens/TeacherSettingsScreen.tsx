import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { palette, metrics, typography } from '../../../theme/design';
import { useAuth } from '../../auth/context/AuthContext';

const Row = ({ label, value, onChange }: any) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Switch value={value} onValueChange={onChange} thumbColor={value ? palette.primary : '#ccc'} />
  </View>
);

const TeacherSettingsScreen = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>{user?.name || 'Teacher'}</Text>
          <Text style={styles.meta}>{user?.email || 'teacher@school.com'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Preferences</Text>
          <Row label="Push Notifications" value={notifications} onChange={setNotifications} />
          <Row label="Auto Sync Data" value={autoSync} onChange={setAutoSync} />
          <Row label="Insights & Analytics" value={analytics} onChange={setAnalytics} />
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={22} color="#FFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    borderRadius: metrics.radius,
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default TeacherSettingsScreen;
