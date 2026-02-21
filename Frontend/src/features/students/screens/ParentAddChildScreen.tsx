import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';
import { createChild } from '../../auth/services/studentApi';

const ParentAddChildScreen = ({ navigation }: any) => {
  const { user, addStudent, selectStudent } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [avatar] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = async () => {
    if (!name || !age || !password) {
      Alert.alert('Error', 'Please enter name, age and password');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Please log in again');
      return;
    }

    const parsedAge = Number(age);
    if (Number.isNaN(parsedAge) || parsedAge <= 0) {
      Alert.alert('Error', 'Please enter a valid age');
      return;
    }

    try {
      setIsSaving(true);
      const child = await createChild(user.token, {
        student_name: name,
        age: parsedAge,
        password,
      });

      addStudent({
        id: String(child.student_id),
        name: child.student_name,
        age: child.age,
        disorder: child.disorder_type,
      });
      selectStudent(String(child.student_id));

      Alert.alert(
        'Success',
        `${child.student_name} added successfully.\n\nTake disorder assessment now?`,
        [
          {
            text: 'Take Assessment Quiz',
            onPress: () =>
              navigation.navigate('AssessmentQuizHome', {
                studentId: String(child.student_id),
              }),
          },
          {
            text: 'Skip to Activities',
            onPress: () => navigation.replace('ActivityHub'),
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to add child');
    } finally {
      setIsSaving(false);
    }
  };

  const pickAvatar = () => {
    Alert.alert('Avatar', 'Pick child photo (implement image picker)');
    // setAvatar('https://via.placeholder.com/120');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Child</Text>

      <Pressable style={styles.avatarContainer} onPress={pickAvatar}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Icon name="camera-plus" size={50} color="#888" />
        )}
        <Text style={styles.avatarText}>Tap to add photo</Text>
      </Pressable>

      <TextInput placeholder="Child Name *" 
      value={name} onChangeText={setName} 
      style={styles.input}
      placeholderTextColor="#94a3b8"
      />
      <TextInput
        placeholder="Age *"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#94a3b8"
      />
      <TextInput
        placeholder="Child Password *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#94a3b8"
      />

      <Pressable style={styles.submitButton} onPress={handleAdd} disabled={isSaving}>
        <Text style={styles.submitText}>{isSaving ? 'Creating...' : 'Create & Start Learning'}</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f6f8f8' },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 32 },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarText: { marginTop: 12, color: '#1B337F', fontSize: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#000000',
  },
  submitButton: { backgroundColor: '#1B337F', padding: 18, borderRadius: 30, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default ParentAddChildScreen;
