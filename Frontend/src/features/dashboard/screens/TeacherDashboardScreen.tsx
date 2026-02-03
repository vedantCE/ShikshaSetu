import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';

const dummyStudents = [
  {
    id: '1',
    name: 'Aarav Sharma',
    age: 8,
    disorder: 'Autism Spectrum',
    avatar: require('../assets/Homescreen/puzzleGame.png'), // Replace with your avatar assets.png
  },
  {
    id: '2',
    name: 'Isha Patel',
    age: 7,
    disorder: 'ADHD',
    avatar: require('../assets/Homescreen/puzzleGame.png'),
  },
  // Add more dummy students
];

const TeacherDashboardScreen = ({ navigation }:any) => {
  const { user } = useAuth(); // Gets teacher info

  const renderStudent = ({ item }:any) => (
    <Pressable
      style={styles.studentCard}
      onPress={() => {
        // Later: setCurrentStudent(item) in AuthContext
        navigation.navigate('ActivityHub');
      }}
    >
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetail}>Age: {item.age}</Text>
        <Text style={styles.studentDetail}>Disorder: {item.disorder}</Text>
      </View>
      <Icon name="chevron-right" size={28} color="#888" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Students</Text>
        <Text style={styles.subtitle}>Hello, {user?.name || 'Teacher'}!</Text>
      </View>

      <FlatList
        data={dummyStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No students yet. Add one!</Text>}
      />

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('TeacherAddStudent')}
      >
        <Icon name="plus" size={32} color="#fff" />
        <Text style={styles.addText}>Add New Student</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8f8' },
  header: { padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#120d1b' },
  subtitle: { fontSize: 18, color: '#666', marginTop: 8 },
  list: { paddingHorizontal: 20 },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  studentInfo: { flex: 1, marginLeft: 16 },
  studentName: { fontSize: 20, fontWeight: '700' },
  studentDetail: { fontSize: 15, color: '#666', marginTop: 4 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 50 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6c2bee',
    margin: 20,
    padding: 16,
    borderRadius: 30,
    elevation: 5,
  },
  addText: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 12 },
});

export default TeacherDashboardScreen;