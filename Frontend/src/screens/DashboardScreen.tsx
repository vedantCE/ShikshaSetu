// import React, { useEffect } from 'react';
// import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
// import { useAuth } from '../context/AuthContext';

// export const DashboardScreen = ({ navigation }: any) => {
//   const { user, students, currentStudent, addStudent, selectStudent, logout } = useAuth();

//   useEffect(() => {
//     if (user?.role === 'teacher' && students.length === 0) {
//       addStudent({ id: '1', name: 'Aarav', age: 8, disorder: 'ASD' });
//       addStudent({ id: '2', name: 'Isha', age: 7, disorder: 'ADHD' });
//       addStudent({ id: '3', name: 'Rohan', age: 9, disorder: 'Intellectual Disability' });
//     }
//   }, [user, students.length]);

//   const handleStudentPress = (id: string) => {
//     selectStudent(id);
//     navigation.navigate('ActivityHub');
//   };

//   const title = user?.role === 'parent' 
//     ? `Home Dashboard${user.name ? `, ${user.name}` : ''}` 
//     : 'School Dashboard (Teacher)';

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{title}</Text>
//       {students.length === 0 ? (
//         <View style={styles.empty}>
//           <Text style={styles.emptyText}>No children added yet. Start by adding one!</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={students}
//           keyExtractor={item => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity style={styles.card} onPress={() => handleStudentPress(item.id)}>
//               <Text style={styles.cardTitle}>{item.name}</Text>
//               {item.age && <Text>Age: {item.age}</Text>}
//               {item.disorder && <Text>Focus: {item.disorder}</Text>}
//             </TouchableOpacity>
//           )}
//         />
//       )}
//       <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddStudent')}>
//         <Text style={styles.buttonText}>+ Add New Child/Student</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.logout} onPress={() => { logout(); navigation.replace('Landing'); }}>
//         <Text style={styles.buttonText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
//   title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#4A90E2' },
//   empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   emptyText: { fontSize: 18, color: '#666' },
//   card: { backgroundColor: '#E3F2FD', padding: 20, borderRadius: 12, marginVertical: 8 },
//   cardTitle: { fontSize: 20, fontWeight: 'bold' },
//   addButton: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
//   logout: { backgroundColor: '#999', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
//   buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
// });
import React, { useEffect } from 'react';
import {View,Text,TouchableOpacity,FlatList,StyleSheet,Image,} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import LiveClock from '../components/LiveClock';

export const DashboardScreen = ({ navigation }: any) => {
  const { user, students, addStudent, selectStudent, logout } = useAuth();

  useEffect(() => {
    if (user?.role === 'teacher' && students.length === 0) {
      addStudent({
        id: '1',
        name: 'Aarav',
        age: 8,
        disorder: 'ASD',
        avatar: require('../public/Avatar/avatar-1.png'),
      });
      addStudent({
        id: '2',
        name: 'Priya',
        age: 7,
        disorder: 'ADHD',
        avatar: require('../public/Avatar/avatar-2.png'),
      });
      addStudent({
        id: '3',
        name: 'Rohan',
        age: 9,
        disorder: 'ID',
        avatar: require('../public/Avatar/avatar-3.png'),
      });
    }
  }, []);

  const handleStudentPress = (id: string) => {
    selectStudent(id);
    navigation.navigate('ActivityHub');
  };

  const renderStudent = ({ item }: any) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => handleStudentPress(item.id)}
    >
      <View style={styles.avatarRing}>
        <Image source={item.avatar} style={styles.avatar} />
      </View>
      <Text style={styles.profileName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderAddProfile = () => (
    <TouchableOpacity
      style={styles.addCard}
      onPress={() => navigation.navigate('AddStudent')}
    >
      <View style={styles.addCircle}>
        <Icon name="plus" size={36} color="#6c2bee" />
      </View>
      <Text style={styles.addText}>Add Profile</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <Text style={styles.date}>Monday • 9:00 AM</Text> */}
        <LiveClock/>
        <Text style={styles.title}>Who is learning today?</Text>
      </View>

      {/* Grid */}
      <FlatList
        data={[...students, { id: 'add' }]}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) =>
          item.id === 'add' ? renderAddProfile() : renderStudent({ item })
        }
      />

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem}>
          <Icon name="information-outline" size={28} color="#888" />
          <Text style={styles.bottomText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomItem}>
          {/* <Icon name="school-outline" size={28} color="#888" /> */}
          <MaterialCommunityIcons name="school" size={28} color="#888"/>
          <Text style={styles.bottomText}>Class Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => {
            logout();
            navigation.replace('Landing');
          }}
        >
          <Icon name="logout" size={28} color="#888" />
          <Text style={styles.bottomText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f8',
  },

  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  date: {
    fontSize: 14,
    color: '#6c2bee',
    marginBottom: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#120d1b',
    textAlign: 'center',
  },

  grid: {
    paddingHorizontal: 12,
    paddingBottom: 120,
  },

  profileCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 2,
  },

  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: 'rgba(108,43,238,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#120d1b',
  },

  addCard: {
    flex: 1,
    margin: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  addText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  bottomItem: {
    alignItems: 'center',
  },

  bottomText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
});
