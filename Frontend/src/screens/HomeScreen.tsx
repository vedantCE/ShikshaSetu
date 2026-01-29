// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../navigation/RootNavigator';

// type HomeScreenProps = {
//   navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
// };

// export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Shiksha-Setu</Text>
//       <Text style={styles.subtitle}>An Educational Platform</Text>

//       {/* <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate('LetterGrid')}
//       >
//         <Text style={styles.buttonText}>Start Learning</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate('Login')}
//       >
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity> */}
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate('Register')}
//       >
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.button, { marginTop: 20 }]}
//         onPress={() => navigation.navigate('Login')}
//       >
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//   },
//   title: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#4A90E2',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 24,
//     color: '#666',
//     marginBottom: 40,
//   },
//   button: {
//     backgroundColor: '#4A90E2',
//     paddingHorizontal: 40,
//     paddingVertical: 16,
//     borderRadius: 12,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 20,
//     fontWeight: '600',
//   },
// });
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const HomeScreen = ({ navigation }: any) => {
  const { setUser } = useAuth();

  const enterAsParent = () => {
    setUser({ role: 'parent' });
    navigation.replace('Dashboard');
  };

  const enterAsTeacher = () => {
    navigation.navigate('TeacherLogin');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shiksha Setu</Text>
      <Text style={styles.subtitle}>Educational Platform for Special Needs</Text>
      <TouchableOpacity style={styles.button} onPress={enterAsParent}>
        <Text style={styles.buttonText}>At Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={enterAsTeacher}>
        <Text style={styles.buttonText}>School</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 40, fontWeight: 'bold', color: '#4A90E2', marginBottom: 10 },
  subtitle: { fontSize: 20, color: '#666', marginBottom: 50 },
  button: { backgroundColor: '#4A90E2', paddingHorizontal: 50, paddingVertical: 18, borderRadius: 12 },
  buttonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
});