import AsyncStorage from '@react-native-async-storage/async-storage';

// Base interface for progress items
export interface BaseProgress {
  item: string;
  stars: number;
  unlocked: boolean;
}

// Legacy support for letter-based progress
export interface LetterProgress {
  letter: string;
  stars: number;
  unlocked: boolean;
}

// Storage keys for different categories
const STORAGE_KEYS = {
  letters: '@alphabet_progress',
  numbers: '@numbers_progress',
  shapes: '@shapes_progress',
};

// Get progress for a specific category
export const getProgress = async (category: string = 'letters'): Promise<BaseProgress[]> => {
  try {
    const key = STORAGE_KEYS[category as keyof typeof STORAGE_KEYS] || STORAGE_KEYS.letters;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save progress for a specific category and item
export const saveProgress = async (
  category: string,
  item: string,
  stars: number
): Promise<void> => {
  try {
    const progress = await getProgress(category);
    const index = progress.findIndex(p => p.item === item);

    if (index >= 0) {
      progress[index].stars = Math.max(progress[index].stars, stars);
    } else {
      progress.push({ item, stars, unlocked: true });
    }

    // Unlock next item in sequence
    const sequences: { [key: string]: string[] } = {
      letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      shapes: ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart'],
    };

    const sequence = sequences[category] || [];
    const currentIndex = sequence.indexOf(item);

    if (currentIndex >= 0 && currentIndex < sequence.length - 1 && stars > 0) {
      const nextItem = sequence[currentIndex + 1];
      const nextIndex = progress.findIndex(p => p.item === nextItem);
      if (nextIndex < 0) {
        progress.push({ item: nextItem, stars: 0, unlocked: true });
      }
    }

    const key = STORAGE_KEYS[category as keyof typeof STORAGE_KEYS] || STORAGE_KEYS.letters;
    await AsyncStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

// Initialize progress for a category
export const initializeProgress = async (category: string = 'letters'): Promise<void> => {
  const progress = await getProgress(category);
  if (progress.length === 0) {
    const firstItems: { [key: string]: string } = {
      letters: 'A',
      numbers: '0',
      shapes: 'circle',
    };

    const firstItem = firstItems[category] || firstItems.letters;
    const key = STORAGE_KEYS[category as keyof typeof STORAGE_KEYS] || STORAGE_KEYS.letters;

    await AsyncStorage.setItem(
      key,
      JSON.stringify([{ item: firstItem, stars: 0, unlocked: true }])
    );
  }
};