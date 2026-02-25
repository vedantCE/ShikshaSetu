import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    ViewToken,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'A Calm Space to Learn',
        description:
            'Learning should feel safe and simple. ShikshaSetu creates a structured, low-stimulation environment where every child can focus comfortably.',
        animation: require('../assets/Homescreen/Card1.json'),
    },
    {
        id: '2',
        title: 'Visual Routines That Guide',
        description:
            'Clear schedules, step-by-step lessons, and visual cues help children understand what comes next and build confidence every day.',
        animation: require('../assets/Homescreen/Card2.json'),
    },
    {
        id: '3',
        title: 'Small Steps. Big Progress.',
        description:
            'Celebrate achievements with gentle progress tracking designed for parents and teachers to support growth together.',
        animation: require('../assets/Homescreen/Card3.json'),
    },
];

export const OnboardingScreen = ({ navigation }: any) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index != null) {
                setCurrentIndex(viewableItems[0].index);
            }
        },
        [],
    );

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const swipeOpacity = useRef(new Animated.Value(0.75)).current;

    const handleNextPress = () => {
        navigation.navigate('ModeSelection');
    };

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(swipeOpacity, { toValue: 1, duration: 900, useNativeDriver: true }),
                Animated.timing(swipeOpacity, { toValue: 0.75, duration: 900, useNativeDriver: true }),
            ]),
        ).start();
    }, [swipeOpacity]);

    const renderSlide = ({ item }: { item: (typeof slides)[0] }) => (
        <View style={styles.slide}>
            <View style={styles.slideContent}>
                {/* Title */}
                <Text style={styles.title}>{item.title}</Text>

                {/* Description */}
                <Text style={styles.description}>{item.description}</Text>

                {/* Existing (foreground) animation below text */}
                <View style={styles.animationContainer}>
                    <LottieView
                        source={item.animation}
                        autoPlay
                        loop
                        speed={0.7}
                        style={styles.lottie}
                    />
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Full-screen background Lottie (base layer) */}
            <LottieView
                source={require('../assets/Homescreen/background.json')}
                autoPlay
                loop
                speed={0.6}
                style={styles.backgroundLottie}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Scrollable slide content */}
                <View style={styles.slideWrapper}>
                    <FlatList
                        ref={flatListRef}
                        data={slides}
                        renderItem={renderSlide}
                        keyExtractor={item => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                        getItemLayout={(_, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                    />
                </View>

                {/* Bottom section: dots + button */}
                <View style={styles.bottomSection}>
                    {/* Pagination Dots */}
                    <View style={styles.dotsRow}>
                        {slides.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentIndex === index ? styles.dotActive : styles.dotInactive,
                                ]}
                            />
                        ))}
                    </View>

                </View>

                {/* Swipe hint or Next button (bottom-right) */}
                {currentIndex === slides.length - 1 ? (
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNextPress}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <Animated.View style={[styles.swipeHintContainer, { opacity: swipeOpacity }]} pointerEvents="none">
                        <Text style={styles.swipeHintText}>Swipe →</Text>
                    </Animated.View>
                )}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },

    /* ---- Slide area (takes remaining space above bottom section) ---- */
    slideWrapper: {
        flex: 1,
    },
    slide: {
        width,
        flex: 1,
        alignItems: 'center',
        paddingTop: height * 0.03,
    },

    /* ---- Animation: dominant, ~48% of screen ---- */
    animationContainer: {
        width: width * 1.00,
        height: height * 0.50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },

    backgroundLottie: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
    },

    slideContent: {
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        paddingTop: height * 0.06,
    },

    /* ---- Typography ---- */
    title: {
        fontSize: 35,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 4,
        lineHeight: 40,
        letterSpacing: 0.3,
        paddingHorizontal: 32,
    },
    description: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 22,
        letterSpacing: 0.2,
        marginTop: 12,
        paddingHorizontal: 40,
    },

    /* ---- Bottom section (dots + button, pinned to bottom) ---- */
    bottomSection: {
        alignItems: 'center',
        paddingBottom: 40,
    },

    /* Pagination dots */
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    dotActive: {
        backgroundColor: '#FFFFFF',
        width: 26,
        height: 10,
        borderRadius: 5,
    },
    dotInactive: {
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
    },

    swipeHintContainer: {
        position: 'absolute',
        right: 24,
        bottom: 30,
        zIndex: 3,
    },
    swipeHintText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.75)',
    },
    nextButton: {
        position: 'absolute',
        right: 24,
        bottom: 30,
        zIndex: 3,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    nextButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
    },
});
