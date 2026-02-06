import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ImageBackground,
  Dimensions,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import { useAuth } from '../../auth/context/AuthContext';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ActivityHub'>;
};

type ActivityItem = {
  id: string;
  title: string;
  image: any;
  screen: 'LetterGrid' | 'NumberGrid' | 'ShapeGrid' | null;
  disabled: boolean;
};

const foundational: ActivityItem[] = [
  {
    id: '1',
    title: 'ABC & Letters',
    image: require('../assets/Activityhub/abc.png'),
    screen: 'LetterGrid' as const,
    disabled: false,
  },
  {
    id: '2',
    title: 'Numbers & Maths',
    image: require('../assets/Activityhub/number.jpg'),
    screen: 'NumberGrid' as const,
    disabled: false,
  },
  {
    id: '3',
    title: 'Shapes & Lines',
    image: require('../assets/Activityhub/shapes.png'),
    screen: 'ShapeGrid' as const,
    disabled: false,
  },
];

const lifeSkills: ActivityItem[] = [
  {
    id: '4',
    title: 'Stories & Feelings',
    image: require('../assets/Activityhub/stories.png'),
    screen: null,
    disabled: true,
  },
  {
    id: '5',
    title: 'Talking in Real Life',
    image: require('../assets/Activityhub/talking.png'),
    screen: null,
    disabled: true,
  },
];

export const ActivityHubScreen = ({ navigation }: Props) => {
  const { currentStudent } = useAuth();

  const renderCard = ({ item }: { item: ActivityItem }) => (
    <Pressable
      onPress={() => {
        if (item.screen && !item.disabled) {
          navigation.navigate(item.screen as any);
        }
      }}
      disabled={item.disabled}
      style={({ pressed }) => [
        styles.card,
        pressed && !item.disabled && { transform: [{ scale: 0.95 }] },
      ]}
    >
      <ImageBackground source={item.image} style={styles.cardImage} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
          locations={[0.4, 1]}
          style={styles.overlay}
        >
          <View style={styles.cardContent}>
            {item.disabled && <Text style={styles.comingSoon}>Coming Soon</Text>}
            <Text style={styles.cardText}>{item.title}</Text>
          </View>
        </LinearGradient>

        {item.disabled && <View style={styles.disabledOverlay} />}
      </ImageBackground>
    </Pressable>
  );

  return (
    // Choose Activity ma uper ni side bov sapce aavti hati atle edges add kari safe area view ma 
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}   // Space for bottom tab bar
        showsVerticalScrollIndicator={false}            // Optional: cleaner look
      >
        {/* Header */}
        {/* <View style={styles.header}>
        <Icon name="cog-outline" size={28} color="#666" />
        <Text style={styles.headerTitle}>Learn</Text>
        <View style={{ width: 28 }} />
      </View> */}

        {/* Main Title */}
        <Text style={styles.mainTitle}>
          Choose Activity {currentStudent ? `for ${currentStudent.name}` : ''}
        </Text>

        {/* Foundational */}
        <Text style={styles.sectionTitle}>Foundational</Text>
        <Text style={styles.sectionSub}>
          Academic basics through visual play
        </Text>

        <FlatList
          data={foundational}
          renderItem={renderCard}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
          bounces={false}                    //removes bounce
        />

        {/* Life Skills */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
          Life Skills
        </Text>
        <Text style={styles.sectionSub}>
          Connecting with the world around us
        </Text>

        <FlatList
          data={lifeSkills}
          renderItem={renderCard}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
          bounces={false}                    //removes bounce
        />
      </ScrollView>
      {/* Bottom Tab Bar */}
      <View style={styles.bottomBar}>
        <Tab icon="home-outline" label="Home" />
        <Tab icon="book-open-variant" label="Learn" active />
        <Tab icon="calendar-clock" label="Routine" />
        <Tab icon="account-outline" label="Profile" />
      </View>
    </SafeAreaView>
  );
};

const Tab = ({ icon, label, active }: any) => (
  <View style={styles.tabItem}>
    <Icon
      name={icon}
      size={26}
      color={active ? '#13b6ec' : '#999'}
    />
    <Text
      style={[
        styles.tabLabel,
        active && { color: '#13b6ec', fontWeight: '700' },
      ]}
    >
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8f8' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111618',
    marginVertical: 12,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginHorizontal: 20,
    color: '#111618',
  },

  sectionSub: {
    fontSize: 14,
    color: '#777',
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 2,
  },

  listContent: {
    paddingHorizontal: 16,
  },

  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },

  card: {
    width: (width - 48) / 2, // Responsive 2-column with padding
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },

  cardImage: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },

  cardContent: {
    padding: 20,
  },

  cardText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  comingSoon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.95,
  },

  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 10,
  },

  tabItem: {
    alignItems: 'center',
    gap: 4,
  },

  tabLabel: {
    fontSize: 11,
    color: '#999',
  },
});