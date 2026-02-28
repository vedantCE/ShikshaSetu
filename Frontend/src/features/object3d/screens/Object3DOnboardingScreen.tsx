import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Object3DParamList } from '../types';
import { COLORS, SIZES, SPACING } from '../constants/theme';

const { width, height } = Dimensions.get('window');

type OnboardingScreenNavigationProp = NativeStackNavigationProp<Object3DParamList, 'Object3DOnboarding'>;

const Object3DOnboardingScreen = () => {
    const navigation = useNavigation<OnboardingScreenNavigationProp>();

    const handleStart = async () => {
        try {
            await AsyncStorage.setItem('@shikshasetu:onboarding_seen', 'true');
            navigation.replace('Object3DHome', {});
        } catch (error) {
            console.error('Error saving onboarding state:', error);
            navigation.replace('Object3DHome', {});
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.animationContainer}>
                <LottieView
                    source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_m6cu9zlb.json' }}
                    autoPlay
                    loop
                    style={styles.animation}
                />
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.appName}>ShikshaSetu</Text>
                <Text style={styles.title}>Discover & Learn with 3D!</Text>
                <Text style={styles.subtitle}>
                    Explore amazing 3D objects and learn about the world around you through interactive visualization
                </Text>

                <View style={styles.highlights}>
                    <Text style={styles.highlightText}> Interactive 3D Models</Text>
                    <Text style={styles.highlightText}> Audio Learning</Text>
                    <Text style={styles.highlightText}> Save Favorites</Text>
                </View>

                <TouchableOpacity onPress={handleStart} activeOpacity={0.8}>
                    <LinearGradient
                        colors={COLORS.primaryGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Start Exploring</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    animationContainer: {
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundLight,
    },
    animation: {
        width: width * 0.8,
        height: width * 0.8,
    },
    contentContainer: {
        flex: 1,
        padding: SPACING.l,
        alignItems: 'center',
        justifyContent: 'center',
    },
    appName: {
        fontSize: SIZES.h2,
        fontWeight: '700',
        color: COLORS.textDark,
        marginBottom: SPACING.s,
    },
    title: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: SPACING.m,
    },
    subtitle: {
        fontSize: SIZES.body,
        color: COLORS.textGray,
        textAlign: 'center',
        marginBottom: SPACING.l,
        paddingHorizontal: SPACING.m,
    },
    highlights: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: SPACING.s,
        marginBottom: SPACING.xl,
    },
    highlightText: {
        fontSize: SIZES.small,
        color: COLORS.textDark,
        backgroundColor: COLORS.lightPurple,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        overflow: 'hidden',
    },
    button: {
        width: width - SPACING.xl * 2,
        height: 56,
        borderRadius: 28,
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
        fontSize: SIZES.body,
        fontWeight: 'bold',
    },
});

export default Object3DOnboardingScreen;
