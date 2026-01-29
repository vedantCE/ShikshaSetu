import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const TeacherLoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();

  const handleLogin = () => {
    if (email === 'teacher@example.com' && password === 'password') {
      setUser({ role: 'teacher', email });
      navigation.replace('Dashboard');
    } else {
      Alert.alert('Invalid Credentials', 'Use teacher@example.com / password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Login (School Mode)</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#4A90E2' },
  input: { backgroundColor: '#F0F8FF', padding: 15, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});