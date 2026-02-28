import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@shikshasetu:favorites';
const LEARNED_KEY = '@shikshasetu:learned';

export const getFavorites = async (): Promise<string[]> => {
    try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

export const saveFavorite = async (modelId: string): Promise<void> => {
    try {
        const favorites = await getFavorites();
        if (!favorites.includes(modelId)) {
            const newFavorites = [...favorites, modelId];
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        }
    } catch (error) {
        console.error('Error saving favorite:', error);
    }
};

export const removeFavorite = async (modelId: string): Promise<void> => {
    try {
        const favorites = await getFavorites();
        const newFavorites = favorites.filter((id) => id !== modelId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
};

export const isFavorite = async (modelId: string): Promise<boolean> => {
    const favorites = await getFavorites();
    return favorites.includes(modelId);
};

// Learned items functions
export const getLearnedItems = async (): Promise<string[]> => {
    try {
        const learned = await AsyncStorage.getItem(LEARNED_KEY);
        return learned ? JSON.parse(learned) : [];
    } catch (error) {
        console.error('Error getting learned items:', error);
        return [];
    }
};

export const saveLearnedItem = async (modelId: string): Promise<void> => {
    try {
        const learned = await getLearnedItems();
        if (!learned.includes(modelId)) {
            const newLearned = [...learned, modelId];
            await AsyncStorage.setItem(LEARNED_KEY, JSON.stringify(newLearned));
        }
    } catch (error) {
        console.error('Error saving learned item:', error);
    }
};

export const removeLearnedItem = async (modelId: string): Promise<void> => {
    try {
        const learned = await getLearnedItems();
        const newLearned = learned.filter((id) => id !== modelId);
        await AsyncStorage.setItem(LEARNED_KEY, JSON.stringify(newLearned));
    } catch (error) {
        console.error('Error removing learned item:', error);
    }
};

export const isLearned = async (modelId: string): Promise<boolean> => {
    const learned = await getLearnedItems();
    return learned.includes(modelId);
};
