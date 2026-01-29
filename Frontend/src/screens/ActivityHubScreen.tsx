import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../context/AuthContext';
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ActivityHub'>;
};

const ActivityHubScreen = ({ navigation }: any) => {
  const { currentStudent } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Choose Activity {currentStudent ? `for ${currentStudent.name}` : ''}
      </Text>
      {/* ABC Tracing */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('LetterGrid')}
      >
        <Text style={styles.cardText}>🔤 ABC Tracing</Text>
      </TouchableOpacity>

      {/* Coming Soon (Disabled) */}
      <TouchableOpacity style={[styles.card, styles.disabled]}>
        <Text style={styles.cardText}>🔢 Numbers (Coming Soon)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.disabled]}>
        <Text style={styles.cardText}>📏 Lines (Coming Soon)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.disabled]}>
        <Text style={styles.cardText}>🔺 Shapes (Coming Soon)</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActivityHubScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  card: {
    backgroundColor: '#4A90E2',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
  },
  disabled: {
    backgroundColor: '#CCC',
  },
  cardText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});
