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
import { palette, metrics, typography } from '../../../theme/design';
import { useAuth } from '../../auth/context/AuthContext';
import { createChild } from '../../auth/services/studentApi';
import { launchCamera, launchImageLibrary, type ImagePickerResponse } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import LoaderScreen from '../../../components/LoaderScreen';
import { useDeferredLoader } from '../../../utils/useDeferredLoader';

const TeacherAddStudentScreen = ({ navigation }: any) => {
  const { user, addStudent } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [disorder, setDisorder] = useState('Unknown');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const showSavingLoader = useDeferredLoader(isSaving);

  const handleAdd = async () => {
    const errors: string[] = [];
    if (!name.trim()) errors.push('Name');
    if (!age.trim()) errors.push('Age');
    if (!password.trim()) errors.push('Password');
    if (errors.length) {
      Alert.alert('Missing fields', errors.join(', '));
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Please log in again');
      return;
    }

    try {
      setIsSaving(true);
      const child = await createChild(user.token, {
        student_name: name.trim(),
        age: Number(age),
        password,
        imageUri: avatar,
        disorder_type: disorder,
      });

      addStudent({
        id: String(child.student_id),
        name: child.student_name,
        age: child.age,
        disorder: child.disorder_type || disorder.trim(),
        avatar: child.image_url || undefined,
      });

      Alert.alert(
        'Success 🎉',
        `${name} added successfully!\n\nWould you like to take a disorder assessment quiz?`,
        [
          {
            text: 'Take Assessment Quiz',
            onPress: () => navigation.navigate('AssessmentQuizHome', {
              studentId: String(child.student_id),
            }),
          },
          {
            text: 'Skip to Activities',
            onPress: () => navigation.replace('ActivityHub'),
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to add student');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Failed to pick image');
      return;
    }
    const uri = response.assets?.[0]?.uri;
    if (uri) setAvatar(uri);
  };

  const pickAvatar = () => {
    Alert.alert('Select Photo', 'Choose a source', [
      {
        text: 'Camera',
        onPress: () =>
          launchCamera(
            { mediaType: 'photo', quality: 0.7, maxWidth: 400, maxHeight: 400 },
            handlePickerResponse,
          ),
      },
      {
        text: 'Gallery',
        onPress: () =>
          launchImageLibrary(
            { mediaType: 'photo', quality: 0.7, maxWidth: 400, maxHeight: 400 },
            handlePickerResponse,
          ),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  if (showSavingLoader) {
    return <LoaderScreen text="Preparing your fun learning experience..." />;
  }

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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={disorder}
            onValueChange={(val) => setDisorder(val)}
            style={styles.picker}
            dropdownIconColor={palette.muted}
          >
            <Picker.Item label="Select Disorder" value="Unknown" />
            <Picker.Item label="ADHD" value="ADHD" />
            <Picker.Item label="Autism" value="Autism" />
            <Picker.Item label="Dyslexia" value="Dyslexia" />
          </Picker>
        </View>
        <TextInput
          placeholder="Password *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          placeholder="Parents Contact No"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          placeholder="Parents Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          multiline
          placeholderTextColor="#94a3b8"
        />

        <Pressable style={styles.submitButton} onPress={handleAdd} disabled={isSaving}>
          <Text style={styles.submitText}>{isSaving ? 'Creating...' : 'Create Student'}</Text>
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
  pickerContainer: {
    backgroundColor: palette.card,
    borderRadius: metrics.radius,
    marginBottom: metrics.spacing,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  picker: {
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
