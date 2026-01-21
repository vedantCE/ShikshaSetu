import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ABC Learn</Text>
      <Text style={styles.subtitle}>Alphabet Tracing</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LetterGrid')}
      >
        <Text style={styles.buttonText}>Start Learning</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
});
