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
import { NUMBERS } from '../constants/Numbers';
import { getProgress, initializeProgress, BaseProgress } from '../storage/progressStore';
import { useAuth } from '../../auth/context/AuthContext';
import LoaderScreen from '../../../components/LoaderScreen';

type NumberGridScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'NumberGrid'>;
};

export const NumberGridScreen: React.FC<NumberGridScreenProps> = ({
    navigation,
}) => {
    const [progress, setProgress] = useState<BaseProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { currentStudent, user } = useAuth();
    const progressScope = String(currentStudent?.id || user?.user_id || 'guest');

    const loadProgress = async () => {
        setIsLoading(true);
        try {
            console.log('[NumberGrid] loading progress', {
                category: 'numbers',
                progressScope,
            });
            await initializeProgress('numbers', progressScope);
            const data = await getProgress('numbers', progressScope);
            setProgress(data);
            console.log('[NumberGrid] progress loaded', {
                category: 'numbers',
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

    if (isLoading) {
        return <LoaderScreen text="Loading tracing progress..." />;
    }

    const getStars = (num: string): number => {
        return progress.find(p => p.item === num)?.stars || 0;
    };

    // Sequential unlocking: First number is always unlocked, 
    // each subsequent number unlocks only if the previous number has stars > 0
    const isUnlocked = (num: string): boolean => {
        const sequence = NUMBERS;
        const firstItem = sequence[0];

        // First item is always unlocked
        if (num === firstItem) {
            return true;
        }

        // Find the previous item in the sequence
        const currentIndex = sequence.indexOf(num);
        if (currentIndex <= 0) {
            return false; // Invalid or not found
        }

        const previousItem = sequence[currentIndex - 1];
        const previousStars = getStars(previousItem);

        // Unlock only if previous item has been completed (stars > 0)
        return previousStars > 0;
    };

    const renderNumber = ({ item }: { item: string }) => {
        const unlocked = isUnlocked(item);
        const stars = getStars(item);

        return (
            <TouchableOpacity
                style={[styles.numberBox, !unlocked && styles.locked]}
                onPress={() =>
                    unlocked &&
                    navigation.navigate('Tracing', { category: 'numbers', item })
                }
                disabled={!unlocked}
            >
                <Text style={[styles.numberText, !unlocked && styles.lockedText]}>
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
            <Text style={styles.title}>Choose a Number</Text>
            <FlatList
                data={NUMBERS}
                renderItem={renderNumber}
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
    numberBox: {
        flex: 1,
        aspectRatio: 1,
        margin: 8,
        backgroundColor: '#FF9800', // Orange theme for numbers
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locked: {
        backgroundColor: '#CCC',
    },
    numberText: {
        fontSize: 48,
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