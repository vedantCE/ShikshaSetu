import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, StatusBar, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Object3DParamList } from '../types';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import TTSService from '../services/TTSService';
import { isFavorite as checkFavorite, saveFavorite, removeFavorite, isLearned as checkLearned, saveLearnedItem, removeLearnedItem } from '../services/StorageService';

type DetailScreenRouteProp = RouteProp<Object3DParamList, 'Object3DDetail'>;

const { width, height } = Dimensions.get('window');
const SNAP_TOP = 120;
const SNAP_BOTTOM = height - 240;

const ThreeDViewer = memo(({ modelId }: { modelId: string }) => {
    const embedUrl = useMemo(() =>
        `https://sketchfab.com/models/${modelId}/embed?ui_infos=0&ui_help=0&ui_annotations=0&ui_watermark=0&ui_controls=1&preload=1&autostart=1`,
        [modelId]
    );

    return (
        <WebView
            source={{ uri: embedUrl }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            cacheEnabled={true}
            androidLayerType="hardware"
            renderToHardwareTextureAndroid={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="always"
            startInLoadingState={true}
            originWhitelist={['*']}
        />
    );
});

// Simple polyfill for requestIdleCallback in React Native
const requestIdle = (callback: any, options?: { timeout: number }) => {
    if (typeof (globalThis as any).requestIdleCallback !== 'undefined') {
        return (globalThis as any).requestIdleCallback(callback, options);
    }
    return setTimeout(callback, options?.timeout || 0);
};

const cancelIdle = (id: any) => {
    if (typeof (globalThis as any).cancelIdleCallback !== 'undefined') {
        return (globalThis as any).cancelIdleCallback(id);
    }
    return clearTimeout(id);
};

const Object3DDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<DetailScreenRouteProp>();
    const { item } = route.params;

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLearned, setIsLearned] = useState(false);
    const [show3D, setShow3D] = useState(false);

    const translateY = useRef(new Animated.Value(SNAP_BOTTOM)).current;
    const dragY = useRef(new Animated.Value(0)).current;
    const lastTranslateY = useRef(SNAP_BOTTOM);

    const sentences = useMemo(() => {
        return item.info.split('.').filter((s: string) => s.trim().length > 0).map((s: string) => s.trim() + '.');
    }, [item.info]);

    const infoPoints = useMemo(() => sentences.slice(1), [sentences]);
    const description = sentences[0];

    const panGesture = useMemo(() => Gesture.Pan()
        .runOnJS(true)
        .onBegin(() => {
            translateY.stopAnimation();
        })
        .onUpdate((event) => {
            dragY.setValue(event.translationY);
        })
        .onEnd((event) => {
            const { translationY, velocityY } = event;
            const currentPos = lastTranslateY.current + translationY;

            let target = SNAP_BOTTOM;
            if (velocityY < -500 || currentPos < height / 2) {
                target = SNAP_TOP;
            }

            Animated.spring(translateY, {
                toValue: target,
                useNativeDriver: true,
                velocity: velocityY,
                tension: 50,
                friction: 8
            }).start(() => {
                lastTranslateY.current = target;
                dragY.setValue(0);
            });
        }), [height]);

    const toggleCard = () => {
        const target = lastTranslateY.current === SNAP_TOP ? SNAP_BOTTOM : SNAP_TOP;
        Animated.spring(translateY, {
            toValue: target,
            useNativeDriver: true,
            tension: 50,
            friction: 8
        }).start(() => {
            lastTranslateY.current = target;
        });
    };

    const animatedTranslateY = Animated.add(translateY, dragY);

    useEffect(() => {
        loadFavoriteStatus();
        loadLearnedStatus();
        return () => TTSService.stop();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const id = requestIdle(
                () => setShow3D(true),
                { timeout: 600 }
            );
            return () => {
                cancelIdle(id);
            };
        }, [])
    );

    const loadFavoriteStatus = async () => {
        const status = await checkFavorite(item.modelId);
        setIsFavorite(status);
    };

    const loadLearnedStatus = async () => {
        const status = await checkLearned(item.modelId);
        setIsLearned(status);
    };

    const handleToggleFavorite = useCallback(async () => {
        if (isFavorite) {
            await removeFavorite(item.modelId);
            setIsFavorite(false);
        } else {
            await saveFavorite(item.modelId);
            setIsFavorite(true);
        }
    }, [isFavorite, item.modelId]);

    const handleMarkAsLearned = useCallback(async () => {
        if (isLearned) {
            await removeLearnedItem(item.modelId);
            setIsLearned(false);
        } else {
            await saveLearnedItem(item.modelId);
            setIsLearned(true);
        }
    }, [isLearned, item.modelId]);

    const handleSpeak = useCallback(() => {
        TTSService.speak(`${item.name}. ${item.info}`);
    }, [item.name, item.info]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Base Layer: Full-Screen WebView */}
            <View style={styles.viewerWrapper}>
                <View style={styles.viewerContainer}>
                    {show3D ? (
                        <ThreeDViewer modelId={item.modelId} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Icon name="cube-outline" size={60} color={COLORS.primary} />
                            <Text style={styles.loadingText}>Loading 3D Model...</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Overlays - On top of WebView but behind card if card is expanded */}
            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                <TouchableOpacity
                    style={[styles.overlayButtonLeft, { top: 50 }]}
                    onPress={handleBack}
                >
                    <Icon name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.overlayButtonRight, { top: 50 }]}>
                    <Icon name="ellipsis-vertical" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Foreground Layer: Collapsible Card */}
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[
                        styles.bottomCard,
                        {
                            transform: [{
                                translateY: animatedTranslateY.interpolate({
                                    inputRange: [SNAP_TOP, SNAP_BOTTOM],
                                    outputRange: [SNAP_TOP, SNAP_BOTTOM],
                                    extrapolate: 'clamp'
                                })
                            }]
                        }
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={toggleCard}
                        style={styles.dragHandleContainer}
                    >
                        <View style={styles.dragHandle} />
                    </TouchableOpacity>

                    <ScrollView
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <View style={styles.titleRow}>
                            <View style={styles.nameContainer}>
                                <Text style={styles.objectName}>{item.name}</Text>
                            </View>
                            <TouchableOpacity style={styles.speakerButton} onPress={handleSpeak}>
                                <Icon name="volume-medium" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.description}>
                            {description}
                        </Text>

                        {infoPoints.length > 0 && (
                            <View style={styles.learningSection}>
                                <Text style={styles.sectionTitle}>Learning Points</Text>
                                {infoPoints.map((point, index) => (
                                    <View key={index} style={styles.bulletItem}>
                                        <View style={styles.bullet} />
                                        <Text style={styles.bulletText}>{point}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <Text style={styles.footerText}>
                            Explore the object from all angles to understand its dimensions and features in detail.
                        </Text>

                        {/* In-content Action Row */}
                        <View style={styles.inContentActionRow}>
                            <TouchableOpacity style={styles.mainActionButton} activeOpacity={0.8} onPress={handleMarkAsLearned}>
                                <LinearGradient
                                    colors={COLORS.primaryGradient}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.buttonText}>{isLearned ? 'Mark as Unlearned' : 'Mark as Learned'}</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={handleToggleFavorite}
                            >
                                <Icon
                                    name={isFavorite ? 'heart' : 'heart-outline'}
                                    size={28}
                                    color={isFavorite ? COLORS.heartRed : '#A78BFA'}
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    mainContent: {
        flex: 1,
    },
    viewerWrapper: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    viewerContainer: {
        flex: 1,
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundLight,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.textGray,
        fontWeight: '500',
    },
    overlayButtonLeft: {
        position: 'absolute',
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayButtonRight: {
        position: 'absolute',
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomCard: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: height - SNAP_TOP,
        backgroundColor: COLORS.backgroundLight,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    dragHandleContainer: {
        width: '100%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#E5E7EB',
    },
    contentContainer: {
        paddingHorizontal: SPACING.l,
        paddingTop: 0,
        paddingBottom: 60,
    },
    inContentActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: SPACING.m,
        marginBottom: SPACING.l,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    objectName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    speakerButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    description: {
        fontSize: 16,
        color: COLORS.textGray,
        lineHeight: 24,
        marginBottom: SPACING.l,
    },
    learningSection: {
        marginBottom: SPACING.l,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: SPACING.m,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 12,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
    },
    bulletText: {
        fontSize: 16,
        color: COLORS.textGray,
    },
    footerText: {
        fontSize: 14,
        color: COLORS.gray,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    bottomRow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: SPACING.l,
        backgroundColor: COLORS.backgroundLight,
        alignItems: 'center',
        gap: 16,
    },
    mainActionButton: {
        flex: 1,
    },
    gradientButton: {
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    favoriteButton: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: COLORS.lightPurple,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
});

export default Object3DDetailScreen;
