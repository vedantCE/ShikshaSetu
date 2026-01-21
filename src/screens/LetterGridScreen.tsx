import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { ALPHABET } from '../constants/Alphabet';
import { getProgress, LetterProgress } from '../storage/progressStore';

type LetterGridScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LetterGrid'>;
};

export const LetterGridScreen: React.FC<LetterGridScreenProps> = ({
  navigation,
}) => {
  const [progress, setProgress] = useState<LetterProgress[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const data = await getProgress();
    setProgress(data);
  };

  const isUnlocked = (letter: string): boolean => {
    return progress.some(p => p.letter === letter && p.unlocked);
  };

  const getStars = (letter: string): number => {
    return progress.find(p => p.letter === letter)?.stars || 0;
  };

  const renderLetter = ({ item }: { item: string }) => {
    const unlocked = isUnlocked(item);
    const stars = getStars(item);

    return (
      <TouchableOpacity
        style={[styles.letterBox, !unlocked && styles.locked]}
        onPress={() => unlocked && navigation.navigate('Tracing', { letter: item })}
        disabled={!unlocked}
      >
        <Text style={[styles.letter, !unlocked && styles.lockedText]}>
          {item}
        </Text>
        {unlocked && stars > 0 && (
          <Text style={styles.stars}>{'⭐'.repeat(stars)}</Text>
        )}
        {!unlocked && <Text style={styles.lockIcon}>🔒</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Letter</Text>
      <FlatList
        data={ALPHABET}
        renderItem={renderLetter}
        keyExtractor={item => item}
        numColumns={4}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  grid: {
    paddingBottom: 20,
  },
  letterBox: {
    flex: 1,
    aspectRatio: 1,
    margin: 8,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locked: {
    backgroundColor: '#CCC',
  },
  letter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  lockedText: {
    color: '#999',
  },
  stars: {
    fontSize: 12,
    marginTop: 4,
  },
  lockIcon: {
    fontSize: 16,
    marginTop: 4,
  },
});
