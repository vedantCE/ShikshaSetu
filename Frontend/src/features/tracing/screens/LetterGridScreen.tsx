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
import { getProgress, initializeProgress, BaseProgress } from '../storage/progressStore';
import { useAuth } from '../../auth/context/AuthContext';
import LoaderScreen from '../../../components/LoaderScreen';

type LetterGridScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LetterGrid'>;
};

export const LetterGridScreen: React.FC<LetterGridScreenProps> = ({
  navigation,
}) => {
  const [progress, setProgress] = useState<BaseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentStudent, user } = useAuth();
  const progressScope = String(currentStudent?.id || user?.user_id || 'guest');

  const loadProgress = async () => {
    setIsLoading(true);
    try {
      console.log('[LetterGrid] loading progress', {
        category: 'letters',
        progressScope,
      });
      await initializeProgress('letters', progressScope);
      const data = await getProgress('letters', progressScope);
      setProgress(data);
      console.log('[LetterGrid] progress loaded', {
        category: 'letters',
        progressScope,
        completed: data.filter(i => i.stars > 0).length,
        total: data.length,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();

    const unsubscribe = navigation.addListener('focus', loadProgress);
    return unsubscribe;
  }, [navigation, progressScope]);

  const getStars = (letter: string): number => {
    return progress.find(p => p.item === letter)?.stars || 0;
  };

  // Sequential unlocking: first letter is unlocked, then each next requires prior stars.
  const isUnlocked = (letter: string): boolean => {
    const firstItem = ALPHABET[0];

    if (letter === firstItem) {
      return true;
    }

    const currentIndex = ALPHABET.indexOf(letter);
    if (currentIndex <= 0) {
      return false;
    }

    const previousItem = ALPHABET[currentIndex - 1];
    const previousStars = getStars(previousItem);
    return previousStars > 0;
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
        <Text style={[styles.letter, !unlocked && styles.lockedText]}>{item}</Text>
        {unlocked && stars > 0 && <Text style={styles.stars}>{'⭐'.repeat(stars)}</Text>}
        {!unlocked && <Text style={styles.lockIcon}>🔒</Text>}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoaderScreen text="Loading tracing progress..." />;
  }

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
