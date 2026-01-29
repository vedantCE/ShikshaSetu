import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRoute } from '@react-navigation/native';

export const QuizScreen = ({ navigation }: any) => {
  const route = useRoute<any>();
  const { newStudentId } = route.params || {};
  const { selectStudent } = useAuth();

  const handleComplete = () => {
    if (newStudentId) selectStudent(newStudentId);
    Alert.alert('Quiz Complete!', 'Assessment saved. Starting personalized learning...');
    navigation.replace('ActivityHub');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Initial Assessment Quiz</Text>
      <Text style={styles.info}>(Replace this screen with your full quiz component)</Text>
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>Complete Quiz (Mock)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 16, color: '#666', marginBottom: 40, textAlign: 'center' },
  button: { backgroundColor: '#4A90E2', padding: 20, borderRadius: 12 },
  buttonText: { color: '#FFF', fontSize: 18 },
});