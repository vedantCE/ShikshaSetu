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
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { palette, metrics, typography } from '../../../theme/design';
import { useAuth } from '../../auth/context/AuthContext';

const TeacherAddStudentScreen = ({ navigation }: any) => {
  const { addStudent } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [disorder, setDisorder] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [avatar] = useState<string | null>(null); // Will hold image URI

  const handleAdd = () => {
    const errors: string[] = [];
    if (!name.trim()) errors.push('Name');
    if (!age.trim()) errors.push('Age');
    if (!disorder.trim()) errors.push('Disorder');
    if (!password.trim()) errors.push('Password');
    if (errors.length) {
      Alert.alert('Missing fields', errors.join(', '));
      return;
    }

    const newId = Date.now().toString();
    addStudent({
      id: newId,
      name: name.trim(),
      age: Number(age),
      disorder: disorder.trim(),
    });

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
      { cancelable: false },
    );
  };

  const pickAvatar = () => {
    // TODO: Use expo-image-picker or react-native-image-picker
    Alert.alert('Avatar', 'Pick student photo (implement image picker)');
    // Example placeholder
    // setAvatar(''); // dummy URI
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add New Student</Text>

        <Pressable style={styles.avatarContainer} onPress={pickAvatar}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Icon name="camera-plus" size={50} color={palette.muted} />
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
  root: { flex: 1, backgroundColor: palette.background },
  container: {
    flex: 1,
    padding: metrics.spacing,
    backgroundColor: palette.background,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: metrics.spacing * 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: metrics.spacing * 1.5,
  },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarText: { marginTop: 12, color: palette.primary, fontSize: 16 },
  input: {
    backgroundColor: palette.card,
    borderRadius: metrics.radius,
    padding: metrics.spacing,
    marginBottom: metrics.spacing,
    fontSize: 16,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.text,
  },
  submitButton: {
    backgroundColor: palette.primary,
    padding: metrics.spacing + 2,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: metrics.spacing,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default TeacherAddStudentScreen;
