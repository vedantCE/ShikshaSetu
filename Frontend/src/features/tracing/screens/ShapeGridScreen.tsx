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
import { SHAPES } from '../constants/Shapes';
import { getProgress, BaseProgress } from '../storage/progressStore';

type ShapeGridScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ShapeGrid'>;
};

export const ShapeGridScreen: React.FC<ShapeGridScreenProps> = ({
    navigation,
}) => {
    const [progress, setProgress] = useState<BaseProgress[]>([]);

    const loadProgress = async () => {
        const data = await getProgress('shapes');
        setProgress(data);
    };

    useEffect(() => {
        loadProgress();
        const unsubscribe = navigation.addListener('focus', loadProgress);
        return unsubscribe;
    }, [navigation]);

    const getStars = (shape: string): number => {
        return progress.find(p => p.item === shape)?.stars || 0;
    };

    // Sequential unlocking: First shape is always unlocked, 
    // each subsequent shape unlocks only if the previous shape has stars > 0
    const isUnlocked = (shape: string): boolean => {
        const sequence = SHAPES;
        const firstItem = sequence[0];

        // First item is always unlocked
        if (shape === firstItem) {
            return true;
        }

        // Find the previous item in the sequence
        const currentIndex = sequence.indexOf(shape);
        if (currentIndex <= 0) {
            return false; // Invalid or not found
        }

        const previousItem = sequence[currentIndex - 1];
        const previousStars = getStars(previousItem);

        // Unlock only if previous item has been completed (stars > 0)
        return previousStars > 0;
    };

    const renderShape = ({ item }: { item: string }) => {
        const unlocked = isUnlocked(item);
        const stars = getStars(item);
        const displayName = item.charAt(0).toUpperCase() + item.slice(1);

        return (
            <TouchableOpacity
                style={[styles.shapeBox, !unlocked && styles.locked]}
                onPress={() =>
                    unlocked &&
                    navigation.navigate('Tracing', { category: 'shapes', item })
                }
                disabled={!unlocked}
            >
                <Text style={[styles.shapeText, !unlocked && styles.lockedText]}>
                    {displayName}
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
            <Text style={styles.title}>Choose a Shape</Text>
            <FlatList
                data={SHAPES}
                renderItem={renderShape}
                keyExtractor={item => item}
                numColumns={3} // 3 columns look better for shapes
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
    shapeBox: {
        flex: 1,
        aspectRatio: 1,
        margin: 12,
        backgroundColor: '#9C27B0', // Purple theme
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locked: {
        backgroundColor: '#CCC',
    },
    shapeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
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