
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
        color: '#FFD166',
        locked: false,
    },
    {
        id: '2',
        title: 'Logic Puzzles',
        subtitle: 'Boost your brain power',
        image: require('../assets/Activityhub/number.jpg'), // Placeholder
        screen: null,
        color: '#06D6A0',
        locked: true,
    },
    {
        id: '3',
        title: 'Color Mixing',
        subtitle: 'Discover new colors',
        image: require('../assets/Activityhub/talking.png'), // Placeholder
        screen: null,
        color: '#EF476F',
        locked: true,
    },
    {
        id: '4',
        title: 'Story Time',
        subtitle: 'Listen to amazing stories',
        image: require('../assets/Activityhub/stories.png'),
        screen: null,
        color: '#118AB2',
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
            style={[styles.cardContainer, animatedStyle]}
        >
            <Pressable
                onPress={() => {
                    if (!item.locked && item.screen) {
                        navigation.navigate(item.screen);
                    }
                }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.card, { backgroundColor: item.color }]}
            >
                <LinearGradient
                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
                    style={styles.gradientOverlay}
                />

                <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                    </View>
                    <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
                </View>

                {item.locked && (
                    <View style={styles.lockedOverlay}>
                        <Icon name="lock" size={32} color="#FFF" />
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
};

export const MoreFeaturesScreen = ({ navigation }: Props) => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={28} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>More Activites</Text>
                <View style={{ width: 28 }} />
            </View>

            <FlatList
                data={features}
                renderItem={({ item, index }) => (
                    <FeatureCard item={item} index={index} navigation={navigation} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    cardContainer: {
        marginBottom: 20,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    card: {
        height: 120,
        borderRadius: 24,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    cardImage: {
        width: 80,
        height: 80,
    },
    lockedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
