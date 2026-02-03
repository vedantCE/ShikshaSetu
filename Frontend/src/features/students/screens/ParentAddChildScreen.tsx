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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ParentAddChildScreen = ({ navigation }:any) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);

  const handleAdd = () => {
    if (!name) {
      Alert.alert('Error', 'Please enter child name');
      return;
    }
    Alert.alert('Success 🎉', `${name} added!`);
    navigation.replace('ActivityHub');
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

      <TextInput placeholder="Child Name *" value={name} onChangeText={setName} style={styles.input} />

      <Pressable style={styles.submitButton} onPress={handleAdd}>
        <Text style={styles.submitText}>Create & Start Learning</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f6f8f8' },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 32 },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarText: { marginTop: 12, color: '#6c2bee', fontSize: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: { backgroundColor: '#6c2bee', padding: 18, borderRadius: 30, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default ParentAddChildScreen;