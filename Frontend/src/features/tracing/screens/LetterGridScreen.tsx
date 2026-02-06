import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import { ALPHABET } from '../constants/Alphabet';
import { getProgress, BaseProgress } from '../storage/progressStore';

type LetterGridScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LetterGrid'>;
};

export const LetterGridScreen: React.FC<LetterGridScreenProps> = ({
  navigation,
}) => {
  const [progress, setProgress] = useState<BaseProgress[]>([]);

  const loadProgress = async () => {
    const data = await getProgress('letters');
    setProgress(data);
  };

  useEffect(() => {
    loadProgress();

    // Refresh progress every time user returns to this screen
    const unsubscribe = navigation.addListener('focus', loadProgress);
    return unsubscribe;
  }, [navigation]);

  const getStars = (letter: string): number => {
    return progress.find(p => p.item === letter)?.stars || 0;
  };

  // Sequential unlocking: First letter is always unlocked, 
  // each subsequent letter unlocks only if the previous letter has stars > 0
  const isUnlocked = (letter: string): boolean => {
    const sequence = ALPHABET;
    const firstItem = sequence[0];

    // First item is always unlocked
    if (letter === firstItem) {
      return true;
    }

    // Find the previous item in the sequence
    const currentIndex = sequence.indexOf(letter);
    if (currentIndex <= 0) {
      return false; // Invalid or not found
    }

    const previousItem = sequence[currentIndex - 1];
    const previousStars = getStars(previousItem);

    // Unlock only if previous item has been completed (stars > 0)
    return previousStars > 0;
  };

  const renderLetter = ({ item }: { item: string }) => {
    const unlocked = isUnlocked(item);
    const stars = getStars(item);

    return (
      <TouchableOpacity
        style={[styles.letterBox, !unlocked && styles.locked]}
        onPress={() =>
          unlocked &&
          navigation.navigate('Tracing', { letter: item })
        }
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