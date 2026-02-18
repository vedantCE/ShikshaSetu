import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';
import { palette, metrics, typography } from '../../../theme/design';

const statuses = ['active', 'progress', 'support'] as const;
const statusColor = {
  active: '#10B981',
  progress: '#F59E0B',
  support: '#EF4444',
};

const TeacherStudentsScreen = ({ navigation }: any) => {
  const { students } = useAuth();
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      students
        .map((s, idx) => ({
          ...s,
          status: statuses[idx % statuses.length],
        }))
        .filter(s =>
          s.name.toLowerCase().includes(query.trim().toLowerCase())
        ),
    [students, query]
  );

  const renderItem = ({ item }: any) => {
    const clr = statusColor[(item.status as keyof typeof statusColor) || 'active'];
    return (
    <Pressable
      style={styles.row}
      onPress={() => navigation.navigate('TeacherStudentProfile', { id: item.id })}
    >
      <View style={styles.avatarWrap}>
        {item.avatar ? (
          <Image source={item.avatar} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>
              {item.name?.[0]?.toUpperCase() || 'S'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>Age {item.age || '—'}</Text>
      </View>
      <View style={[styles.statusDot, { backgroundColor: clr }]} />
      <Icon name="chevron-right" size={22} color={palette.muted} />
    </Pressable>
  )};

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>My Students</Text>
      <View style={styles.search}>
        <Icon name="magnify" size={20} color={palette.muted} />
        <TextInput
          placeholder="Search students"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          placeholderTextColor={palette.muted}
        />
      </View>
      <Pressable
        onPress={() => navigation.navigate('TeacherAddStudent')}
        style={styles.addCard}
      >
        <View style={styles.addDashed}>
          <Icon name="account-plus" size={26} color={palette.muted} />
          <Text style={styles.addText}>Add New Student</Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.background },
  listContent: { paddingBottom: 40 },
  header: { padding: metrics.spacing },
  title: { ...typography.title, marginBottom: metrics.spacing },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    paddingHorizontal: metrics.spacing,
    borderRadius: metrics.radius,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    color: palette.text,
  },
  addCard: { marginTop: metrics.spacing },
  addDashed: {
    borderWidth: 2,
    borderColor: palette.border,
    borderStyle: 'dashed',
    backgroundColor: palette.card,
    borderRadius: metrics.radius,
    padding: metrics.spacing,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { color: palette.muted, marginTop: 6, fontWeight: '600' },
  row: {
    marginHorizontal: metrics.spacing,
    marginTop: metrics.spacing,
    backgroundColor: palette.card,
    borderRadius: metrics.radius,
    padding: metrics.spacing,
    flexDirection: 'row',
    alignItems: 'center',
    ...metrics.shadow,
  },
  avatarWrap: { marginRight: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5EDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: { color: palette.primary, fontWeight: '700' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: palette.text },
  meta: { color: palette.muted, marginTop: 2 },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
});

export default TeacherStudentsScreen;
