import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

import { Object3DParamList } from '../types';
import { DATA, ObjectItem } from '../constants/data';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import SearchBar from '../components/SearchBar';
import CategoryPills from '../components/CategoryPills';
import ImageCard from '../components/ImageCard';
import { getFavorites, saveFavorite, removeFavorite, getLearnedItems } from '../services/StorageService';

type HomeScreenNavigationProp = NativeStackNavigationProp<Object3DParamList, 'Object3DHome'>;
type HomeScreenRouteProp = RouteProp<Object3DParamList, 'Object3DHome'>;

const Object3DHomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const route = useRoute<HomeScreenRouteProp>();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [learnedItems, setLearnedItems] = useState<string[]>([]);
    const [isFavoritesOnly, setIsFavoritesOnly] = useState(false);

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 100);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        if (isFocused) {
            loadFavorites();
            loadLearnedItems();
        }
    }, [isFocused]);

    useEffect(() => {
        if (route.params?.filterFavorite !== undefined) {
            setIsFavoritesOnly(route.params.filterFavorite);
        }
    }, [route.params]);

    const loadFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs);
    };

    const loadLearnedItems = async () => {
        const learned = await getLearnedItems();
        setLearnedItems(learned);
    };

    const allItems = useMemo(() => {
        const items: ObjectItem[] = [];
        Object.keys(DATA).forEach((key) => {
            items.push(...DATA[key]);
        });
        return items;
    }, []);

    const filteredItems = useMemo(() => {
        if (debouncedSearchQuery) {
            return allItems.filter((item) =>
                item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            );
        }

        let items = allItems;

        if (isFavoritesOnly) {
            items = items.filter((item) => favorites.includes(item.modelId));
        } else if (selectedCategory !== 'All') {
            const categoryKey = selectedCategory.trim().toLowerCase();
            items = DATA[categoryKey] || [];
        }

        return items;
    }, [allItems, selectedCategory, debouncedSearchQuery, favorites, isFavoritesOnly]);

    const handleToggleFavorite = useCallback(async (modelId: string) => {
        setFavorites((prev) => {
            const isFav = prev.includes(modelId);
            if (isFav) {
                removeFavorite(modelId);
                return prev.filter((id) => id !== modelId);
            } else {
                saveFavorite(modelId);
                return [...prev, modelId];
            }
        });
    }, []);

    const handleNavigateDetail = useCallback(
        (item: ObjectItem) => {
            navigation.navigate('Object3DDetail', { item });
        },
        [navigation]
    );

    const getCategoryForItem = useCallback((item: ObjectItem): string => {
        for (const [category, items] of Object.entries(DATA)) {
            if (items.some((i) => i.modelId === item.modelId)) {
                return category;
            }
        }
        return 'all';
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: ObjectItem }) => (
            <ImageCard
                item={item}
                isFavorite={favorites.includes(item.modelId)}
                isLearned={learnedItems.includes(item.modelId)}
                onPress={() => handleNavigateDetail(item)}
                onToggleFavorite={() => handleToggleFavorite(item.modelId)}
                category={getCategoryForItem(item)}
            />
        ),
        [favorites, learnedItems, handleNavigateDetail, handleToggleFavorite, getCategoryForItem]
    );

    const keyExtractor = useCallback((item: ObjectItem) => item.modelId, []);

    const renderHeaderComponent = () => (
        <View style={[styles.header, { paddingTop: insets.top + SPACING.m }]}>
            <View>
                <Text style={styles.greeting}>Hi There!</Text>
                <Text style={styles.title}>Find Your 3D!</Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity
                    style={styles.favIconButton}
                    onPress={() => setIsFavoritesOnly(!isFavoritesOnly)}
                >
                    <Icon
                        name={isFavoritesOnly ? 'favorite' : 'favorite-border'}
                        size={28}
                        color={COLORS.textDark}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Object3DOnboarding')}
                    style={styles.infoButton}
                >
                    <Icon name="info-outline" size={28} color={COLORS.textDark} />
                </TouchableOpacity>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/150?u=shikshasetu' }}
                    style={styles.avatar}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            {renderHeaderComponent()}
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            <CategoryPills
                selectedCategory={isFavoritesOnly ? 'Favorites' : selectedCategory}
                onSelectCategory={(cat) => {
                    setIsFavoritesOnly(false);
                    setSelectedCategory(cat);
                }}
            />
            <FlatList
                data={filteredItems}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                initialNumToRender={6}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {isFavoritesOnly ? 'No favorites yet' : 'No items found'}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        marginBottom: SPACING.s,
    },
    greeting: {
        fontSize: SIZES.caption,
        color: COLORS.gray,
    },
    title: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    favIconButton: {
        position: 'relative',
    },
    infoButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLORS.heartRed,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    gridContainer: {
        paddingHorizontal: SPACING.m,
        paddingBottom: 80,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: SIZES.body,
        color: COLORS.textGray,
    },
});

export default Object3DHomeScreen;
