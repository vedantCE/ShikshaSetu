import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTIES: { key: Difficulty; label: string; desc: string; icon: string; colors: string[] }[] = [
    {
        key: 'easy',
        label: 'Easy',
        desc: 'Addition only (1–20)',
        icon: 'emoticon-happy-outline',
        colors: ['#10B981', '#34D399'],
    },
    {
        key: 'medium',
        label: 'Medium',
        desc: 'Add & Subtract (1–50)',
        icon: 'emoticon-neutral-outline',
        colors: ['#F59E0B', '#FBBF24'],
    },
    {
        key: 'hard',
        label: 'Hard',
        desc: 'Add, Sub & Multiply',
        icon: 'emoticon-cool-outline',
        colors: ['#EF4444', '#F87171'],
    },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DifficultyCard = ({
    item,
    selected,
    onSelect,
    index,
}: {
    item: typeof DIFFICULTIES[0];
    selected: boolean;
    onSelect: () => void;
    index: number;
}) => {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View entering={FadeInDown.delay(index * 150).springify()}>
            <AnimatedPressable
                onPress={onSelect}
                onPressIn={() => {
                    scale.value = withSpring(0.96);
                }}
                onPressOut={() => {
                    scale.value = withSpring(1);
                }}
                style={[animStyle]}
            >
                <LinearGradient
                    colors={item.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.card,
                        selected && styles.cardSelected,
                    ]}
                >
                    <View style={styles.cardContent}>
                        <Icon name={item.icon} size={40} color="#FFF" />
                        <View style={styles.cardText}>
                            <Text style={styles.cardLabel}>{item.label}</Text>
                            <Text style={styles.cardDesc}>{item.desc}</Text>
                        </View>
                        {selected && (
                            <View style={styles.checkCircle}>
                                <Icon name="check" size={20} color="#FFF" />
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </AnimatedPressable>
        </Animated.View>
    );
};

const DifficultySelectScreen = ({ navigation }: any) => {
    const [selected, setSelected] = useState<Difficulty>('easy');

    const handleStart = () => {
        navigation.replace('TugOfWarGame', { difficulty: selected });
    };

    return (
        <SafeAreaView style={styles.root}>
            <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </Pressable>
                <Text style={styles.title}>Tug of War</Text>
                <Text style={styles.subtitle}>Choose your difficulty</Text>
            </Animated.View>

            <View style={styles.cardsContainer}>
                {DIFFICULTIES.map((item, index) => (
                    <DifficultyCard
                        key={item.key}
                        item={item}
                        selected={selected === item.key}
                        onSelect={() => setSelected(item.key)}
                        index={index}
                    />
                ))}
            </View>

            <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.bottomContainer}>
                <Pressable onPress={handleStart} style={styles.startButton}>
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.startGradient}
                    >
                        <Icon name="sword-cross" size={22} color="#FFF" />
                        <Text style={styles.startText}>Start Game</Text>
                    </LinearGradient>
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F6F8FB',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
    },
    cardsContainer: {
        flex: 1,
        paddingHorizontal: 20,
        gap: 16,
        justifyContent: 'center',
    },
    card: {
        borderRadius: 20,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    cardSelected: {
        borderWidth: 3,
        borderColor: '#FFF',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    cardText: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
    },
    cardDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
        fontWeight: '500',
    },
    checkCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    startButton: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    startGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    startText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
});

export default DifficultySelectScreen;
