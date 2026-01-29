import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const DashboardScreen = ({ navigation }: any) => {
  const { user, students, currentStudent, addStudent, selectStudent, logout } = useAuth();

  useEffect(() => {
    if (user?.role === 'teacher' && students.length === 0) {
      addStudent({ id: '1', name: 'Aarav', age: 8, disorder: 'ASD' });
      addStudent({ id: '2', name: 'Isha', age: 7, disorder: 'ADHD' });
      addStudent({ id: '3', name: 'Rohan', age: 9, disorder: 'Intellectual Disability' });
    }
  }, [user, students.length]);

  const handleStudentPress = (id: string) => {
    selectStudent(id);
    navigation.navigate('ActivityHub');
  };

  const title = user?.role === 'parent' 
    ? `Home Dashboard${user.name ? `, ${user.name}` : ''}` 
    : 'School Dashboard (Teacher)';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {students.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No children added yet. Start by adding one!</Text>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleStudentPress(item.id)}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.age && <Text>Age: {item.age}</Text>}
              {item.disorder && <Text>Focus: {item.disorder}</Text>}
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddStudent')}>
        <Text style={styles.buttonText}>+ Add New Child/Student</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={() => { logout(); navigation.replace('Landing'); }}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#4A90E2' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666' },
  card: { backgroundColor: '#E3F2FD', padding: 20, borderRadius: 12, marginVertical: 8 },
  cardTitle: { fontSize: 20, fontWeight: 'bold' },
  addButton: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  logout: { backgroundColor: '#999', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});