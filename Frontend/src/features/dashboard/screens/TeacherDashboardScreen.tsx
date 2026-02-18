import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';
import LiveClock from '../../../components/LiveClock';
import { palette, metrics, typography } from '../../../theme/design';

const TeacherDashboardScreen = ({ navigation }:any) => {
  const { students, selectStudent, user } = useAuth();

  const renderStudent = ({ item }:any) => (
    <Pressable
      style={styles.profileCard}
      onPress={() => {
        selectStudent(item.id);
        navigation.navigate('ActivityHub');
      }}
    >
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={item.avatar} style={styles.avatar} />
        ) : (
          <Icon name="account-child" size={44} color={palette.primary} />
        )}
      </View>
      <Text style={styles.profileName}>{item.name}</Text>
    </Pressable>
  );

  const renderAddProfile = () => (
    <Pressable
      style={styles.addProfileCard}
      onPress={() => navigation.navigate('TeacherAddStudent')}
    >
      <View style={styles.addIconContainer}>
        <Icon name="plus" size={48} color={palette.muted} />
      </View>
      <Text style={styles.addProfileText}>Add Profile</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingTitle}>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name || 'Teacher'}</Text>
            <LiveClock />
          </View>
          <View style={styles.avatarSmall}>
            <Icon name="account-circle" size={40} color={palette.primary} />
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Icon name="account-group" size={22} color={palette.primary} />
            </View>
            <Text style={styles.statValue}>{students.length}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Icon name="calendar-clock" size={22} color={palette.primary} />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Today's Sessions</Text>
          </View>
        </View>
        <View style={styles.quickActions}>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('TeacherAddStudent')}>
            <Icon name="account-plus" size={22} color={palette.primary} />
            <Text style={styles.actionText}>Add Student</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('TchSchedule')}>
            <Icon name="calendar-multiselect" size={22} color={palette.primary} />
            <Text style={styles.actionText}>Generate Timetable</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => {}}>
            <Icon name="chart-line" size={22} color={palette.primary} />
            <Text style={styles.actionText}>View Analytics</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionTitle}>Who is learning today?</Text>
      </View>

      <FlatList
        data={[...students, { id: 'add' }]}
        renderItem={({ item }) =>
          item.id === 'add' ? renderAddProfile() : renderStudent({ item })
        }
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: metrics.spacing,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingTitle: { ...typography.title },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...metrics.shadow,
  },
  statsRow: {
    flexDirection: 'row',
    gap: metrics.spacing,
    marginTop: metrics.spacing,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: metrics.radius,
    padding: metrics.spacing,
    alignItems: 'flex-start',
    ...metrics.shadow,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.text,
  },
  statLabel: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: metrics.spacing,
    marginTop: metrics.spacing,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.card,
    borderRadius: metrics.radius,
    padding: metrics.spacing,
    ...metrics.shadow,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  sectionTitle: {
    ...typography.title,
    marginTop: metrics.spacing,
  },
  grid: {
    paddingHorizontal: metrics.spacing,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileCard: {
    width: '47%',
    backgroundColor: palette.card,
    borderRadius: metrics.radius + 6,
    padding: metrics.spacing,
    alignItems: 'center',
    ...metrics.shadow,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
  },
  addProfileCard: {
    width: '47%',
    backgroundColor: palette.card,
    borderRadius: metrics.radius + 6,
    borderWidth: 2,
    borderColor: palette.border,
    borderStyle: 'dashed',
    padding: metrics.spacing,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addProfileText: {
    fontSize: 16,
    fontWeight: '500',
    color: palette.muted,
  },
});

export default TeacherDashboardScreen;