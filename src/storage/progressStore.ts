import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@alphabet_progress';

export interface LetterProgress {
  letter: string;
  stars: number;
  unlocked: boolean;
}

export const getProgress = async (): Promise<LetterProgress[]> => {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveProgress = async (
  letter: string,
  stars: number
): Promise<void> => {
  try {
    const progress = await getProgress();
    const index = progress.findIndex(p => p.letter === letter);

    if (index >= 0) {
      progress[index].stars = Math.max(progress[index].stars, stars);
    } else {
      progress.push({ letter, stars, unlocked: true });
    }

    // Unlock next letter
    const letterIndex = letter.charCodeAt(0) - 65;
    if (letterIndex < 25 && stars > 0) {
      const nextLetter = String.fromCharCode(66 + letterIndex);
      const nextIndex = progress.findIndex(p => p.letter === nextLetter);
      if (nextIndex < 0) {
        progress.push({ letter: nextLetter, stars: 0, unlocked: true });
      }
    }

    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

export const initializeProgress = async (): Promise<void> => {
  const progress = await getProgress();
  if (progress.length === 0) {
    await AsyncStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify([{ letter: 'A', stars: 0, unlocked: true }])
    );
  }
};
