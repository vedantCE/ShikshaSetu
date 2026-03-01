
import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ImageBackground,
    Dimensions,
    Image,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    FadeInDown,
} from 'react-native-reanimated';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/RootNavigator';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ActivityHub'>;
};

type FeatureItem = {
    id: string;
    title: string;
    subtitle: string;
    image: any;
    screen: keyof RootStackParamList | null;
    color: string;
    locked: boolean;
};

const features: FeatureItem[] = [
    {
        id: '1',
        title: 'Shape Tracing',
        subtitle: 'Learn to draw shapes',
        image: require('../assets/Activityhub/shapes.png'),
        screen: 'ShapeGrid',
        color: '#E3F2FD',
        locked: false,
    },
    {
        id: '2',
        title: '3D Learning',
        subtitle: 'Explore 3D Objects',
        image: require('../assets/Activityhub/more_icon.png'), // Using existing more_icon as placeholder
        screen: 'Object3DHome',
        color: '#EDE9FE',
        locked: false,
    },
    {
        id: '3',
        title: 'Logic Puzzles',
        subtitle: 'Boost your brain',
        image: require('../assets/Activityhub/numbers_icon.png'), // Placeholder
        screen: null,
        color: '#FFEBEE',
        locked: true,
    },
    {
        id: '4',
        title: 'Color Mixing',
        subtitle: 'Discover colors',
        image: require('../assets/Activityhub/alphabets_icon.png'), // Placeholder
        screen: null,
        color: '#FFF3E0',
        locked: true,
    },
];

const FeatureCard = ({ item, index, navigation }: { item: FeatureItem; index: number; navigation: any }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify()}
            style={[styles.featureWrapper, animatedStyle]}
        >
            <Pressable
                onPress={() => {
                    if (!item.locked && item.screen) {
                        navigation.navigate(item.screen as any);
                    }
                }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.featureCard, { backgroundColor: item.color }]}
            >
                <Image source={item.image} style={styles.featureIcon} resizeMode="contain" />
                {item.locked && (
                    <View style={styles.lockedOverlay}>
                        <Icon name="lock" size={24} color="rgba(0,0,0,0.3)" />
                    </View>
                )}
            </Pressable>
            <Text style={styles.featureTitle} numberOfLines={1}>{item.title}</Text>
        </Animated.View>
    );
};


export const MoreFeaturesScreen = ({ navigation }: Props) => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

            <FlatList
                data={features}
                renderItem={({ item, index }) => (
                    <FeatureCard item={item} index={index} navigation={navigation} />
                )}
                keyExtractor={(item) => item.id}
                numColumns={3}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#FFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 40,
    },
    row: {
        justifyContent: 'flex-start',
        gap: 10,
        marginBottom: 20,
    },
    featureWrapper: {
        alignItems: 'center',
        width: (width - 40) / 3, // Match ActivityHub spacing
    },
    featureCard: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    featureIcon: {
        width: '100%',
        height: '100%',
        borderRadius: 22,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    lockedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
