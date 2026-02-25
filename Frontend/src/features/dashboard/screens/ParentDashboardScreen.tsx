import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { useAuth } from '../../auth/context/AuthContext';

const { width } = Dimensions.get('window');

const ParentDashboardScreen = ({ navigation }: any) => {
  const { user, students, selectStudent } = useAuth();

  const showProfile = () => {
    Alert.alert(
      'Parent Profile',
      `Name: ${user?.name || 'Parent'}\nEmail: ${user?.email || 'parent@example.com'}\nContact: +91 98765 43210\nAddress: Ahmedabad, Gujarat`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Add Child button */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Pressable
          style={styles.addChildBtn}
          onPress={() => navigation.navigate('ParentAddChild')}
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addChildText}>Add Child</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.appIcon}>
            <Icon name="baby-face-outline" size={36} color="#fff" />
          </View>
        </View>

        {/* Welcome Title */}
        <Text style={styles.welcomeTitle}>Welcome to Kids Manager</Text>

        {/* Cards Row */}
        <View style={styles.cardsRow}>
          {/* Child Cards */}
          {students && students.length > 0 ? (
            students.map((item: any) => (
              <Pressable
                key={item.id}
                style={styles.childCard}
                onPress={() => {
                  selectStudent(item.id);
                  navigation.navigate('ActivityHub');
                }}
              >
                <View style={styles.childCardInner}>
                  <Image
                    source={require('../assets/Homescreen/student.png')}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.cardLabel}>{item.name || 'Child'}</Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.emptyText}>No children yet. Tap "Add Child" to get started!</Text>
          )}

          {/* Parent Card */}
          <Pressable style={[styles.parentCard]} onPress={showProfile}>
            <View style={styles.parentCardInner}>
              <Image
                source={require('../assets/Homescreen/parent.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.cardLabel, styles.parentLabel]}>Parent</Text>
          </Pressable>
        </View>

        {/* Lottie Animation */}
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('../assets/Homescreen/family.json')}
            autoPlay
            loop
            speed={0.8}
            style={styles.lottie}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const CARD_SIZE = width * 0.40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerLeft: {
    flex: 1,
  },
  addChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B337F',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#1B337F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addChildText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 6,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  iconContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#1B337F',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#1B337F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 28,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  childCard: {
    alignItems: 'center',
    width: CARD_SIZE,
  },
  childCardInner: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 24,
    backgroundColor: '#D4ECFC',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: '#B8DFFB',
  },
  cardAvatar: {
    width: CARD_SIZE * 0.65,
    height: CARD_SIZE * 0.65,
    borderRadius: CARD_SIZE * 0.325,
  },
  cardAvatarFallback: {
    backgroundColor: '#E8F4FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: CARD_SIZE * 0.99,
    height: CARD_SIZE * 1.0,
    borderRadius: 30
  },
  parentCard: {
    alignItems: 'center',
    width: CARD_SIZE,
  },
  parentCardInner: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 24,
    backgroundColor: '#1B337F',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#1B337F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: '#64B5F6',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 10,
    textAlign: 'center',
  },
  parentLabel: {
    fontWeight: '800',
    color: '#1B337F',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#6B7280',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  lottieContainer: {
    width: width * 0.9,
    height: width * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});

export default ParentDashboardScreen;
