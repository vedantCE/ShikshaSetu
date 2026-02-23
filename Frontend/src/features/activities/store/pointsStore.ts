import AsyncStorage from '@react-native-async-storage/async-storage';

const POINTS_KEY = '@total_points';

/**
 * Get current total points from AsyncStorage.
 */
export const getPoints = async (): Promise<number> => {
    try {
        const val = await AsyncStorage.getItem(POINTS_KEY);
        return val ? parseInt(val, 10) : 0;
    } catch (e) {
        console.warn('Failed to get points:', e);
        return 0;
    }
};

/**
 * Add points to the current total and persist to AsyncStorage.
 */
export const addPoints = async (amount: number): Promise<number> => {
    try {
        const current = await getPoints();
        const newTotal = current + amount;
        await AsyncStorage.setItem(POINTS_KEY, String(newTotal));
        return newTotal;
    } catch (e) {
        console.warn('Failed to add points:', e);
        return 0;
    }
};

/**
 * Reset points to zero (useful for testing / logout).
 */
export const resetPoints = async (): Promise<void> => {
    try {
        await AsyncStorage.setItem(POINTS_KEY, '0');
    } catch (e) {
        console.warn('Failed to reset points:', e);
    }
};
