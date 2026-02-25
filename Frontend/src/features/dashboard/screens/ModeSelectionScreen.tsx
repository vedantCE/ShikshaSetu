import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';

const { width, height } = Dimensions.get('window');

export const ModeSelectionScreen = ({ navigation }: any) => {
    const { setSelectedRole } = useAuth();

    const enterAsParent = () => {
        setSelectedRole('parent');
        navigation.navigate('ParentAuth');
    };

    const enterAsTeacher = () => {
        setSelectedRole('teacher');
        navigation.navigate('TeacherAuth');
    };

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

            {/* Header */}
            <Text style={styles.heading}>Choose Your Learning Space</Text>
            <Text style={styles.description}>Pick your space to begin with the right activities and routine</Text>
            {/* Mode Buttons */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.modeCard}
                    onPress={enterAsParent}
                    activeOpacity={0.85}
                >
                    <Icon name="home-variant" size={30} color="#4A90D9" />
                    <Text style={styles.modeText}>At Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.modeCard}
                    onPress={enterAsTeacher}
                    activeOpacity={0.85}
                >
                    <Icon name="school" size={30} color="#4A90D9" />
                    <Text style={styles.modeText}>At School</Text>
                </TouchableOpacity>
            </View>

            {/* Child Lottie Animation */}
            <View style={styles.animationContainer}>
                <LottieView
                    source={require('../assets/Homescreen/child.json')}
                    autoPlay
                    loop
                    speed={0.7}
                    style={styles.lottie}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
    },
    backgroundLottie: {
        ...StyleSheet.absoluteFill,
        zIndex: 0,
    },
    heading: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
        letterSpacing: 0.3,
        paddingHorizontal: 24,
        zIndex: 1,
        marginTop: height * 0.08,
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 30,
        paddingHorizontal: 32,
        zIndex: 1,
    },
    modeCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
    },
    modeText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        letterSpacing: 0.2,
    },
    description: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 22,
        letterSpacing: 0.2,
        marginTop: 12,
        marginBottom: 40,
        paddingHorizontal: 40,
    },
    animationContainer: {
        flex: 1,
        width: width * 0.85,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
});
