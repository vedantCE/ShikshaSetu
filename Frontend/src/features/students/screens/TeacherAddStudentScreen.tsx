import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TeacherAddStudentScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [disorder, setDisorder] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState(null); // Will hold image URI

  const handleAdd = () => {
    if (!name || !age || !disorder || !password) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    // Show success and ask about quiz
    Alert.alert(
      'Success 🎉',
      `${name} added successfully!\n\nWould you like to take a disorder assessment quiz?`,
      [
        {
          text: 'Take Assessment Quiz',
          onPress: () => navigation.navigate('AssessmentQuizHome'),
        },
        {
          text: 'Skip to Activities',
          onPress: () => navigation.replace('ActivityHub'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  const pickAvatar = () => {
    // TODO: Use expo-image-picker or react-native-image-picker
    Alert.alert('Avatar', 'Pick student photo (implement image picker)');
    // Example placeholder
    // setAvatar(''); // dummy URI
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f8f8' }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add New Student</Text>

        <Pressable style={styles.avatarContainer} onPress={pickAvatar}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Icon name="camera-plus" size={50} color="#888" />
          )}
          <Text style={styles.avatarText}>Tap to add photo</Text>
        </Pressable>

        <TextInput
          placeholder="Student Name *"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Age *"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Disorder Type *"
          value={disorder}
          onChangeText={setDisorder}
          style={styles.input}
        />
        <TextInput
          placeholder="Password *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Parents Contact No"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          placeholder="Parents Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          multiline
        />

        <Pressable style={styles.submitButton} onPress={handleAdd}>
          <Text style={styles.submitText}>Create Student</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f6f8f8' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 32,
  },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarText: { marginTop: 12, color: '#1B337F', fontSize: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#000000',
  },
  submitButton: {
    backgroundColor: '#1B337F',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default TeacherAddStudentScreen;
