import AsyncStorage from '@react-native-async-storage/async-storage';

const POINTS_KEY = '@shikshasetu_points';

export const getPoints = async (): Promise<number> => {
    try {
        const pointsStr = await AsyncStorage.getItem(POINTS_KEY);
        if (pointsStr !== null) {
            return parseInt(pointsStr, 10);
        }
        return 0; // Default to 0 points if not found
    } catch (error) {
        console.error('Failed to fetch points from storage:', error);
        return 0;
    }
};

export const addPoints = async (amount: number): Promise<number> => {
    try {
        const currentPoints = await getPoints();
        const newTotal = currentPoints + amount;
        await AsyncStorage.setItem(POINTS_KEY, newTotal.toString());
        return newTotal;
    } catch (error) {
        console.error('Failed to add points to storage:', error);
        return 0;
    }
};
