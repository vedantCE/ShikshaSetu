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

const dummyStudents = [
  {
    id: '1',
    name: 'Aarav',
    age: 8,
    disorder: 'Autism Spectrum',
    avatar: require('../assets/Homescreen/puzzleGame.png'),
  },
  {
    id: '2',
    name: 'Priya',
    age: 7,
    disorder: 'ADHD',
    avatar: require('../assets/Homescreen/puzzleGame.png'),
  },
  {
    id: '3',
    name: 'Rohan',
    age: 9,
    disorder: 'ID',
    avatar: require('../assets/Homescreen/coLlearning.png'),
  },
];

const TeacherDashboardScreen = ({ navigation }:any) => {
  const { user } = useAuth();

  const renderStudent = ({ item }:any) => (
    <Pressable
      style={styles.profileCard}
      onPress={() => {
        navigation.navigate('ActivityHub');
      }}
    >
      <View style={styles.avatarContainer}>
        <Image source={item.avatar} style={styles.avatar} />
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
        <Icon name="plus" size={48} color="#A0A0A0" />
      </View>
      <Text style={styles.addProfileText}>Add Profile</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LiveClock />
        <Text style={styles.title}>Who is learning today?</Text>
      </View>

      <FlatList
        data={[...dummyStudents, { id: 'add' }]}
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
    backgroundColor: '#F0F2F5',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginTop: 8,
  },
  grid: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: '#000',
  },
  addProfileCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    padding: 20,
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
    color: '#A0A0A0',
  },
});

export default TeacherDashboardScreen;