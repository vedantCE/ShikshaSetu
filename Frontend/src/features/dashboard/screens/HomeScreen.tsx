import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../auth/context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const cards = [
  {
    id: '1',
    title: 'Visual Schedules',
    subtitle: 'Plan the day with pictures',
    image: require('../assets/Homescreen/visualSchedules.png'),
  },
  {
    id: '2',
    title: 'Puzzle Games',
    subtitle: 'Learn shapes and logic',
    image: require('../assets/Homescreen/puzzleGame.png'),
  },
  {
    id: '3',
    title: 'Co-Learning',
    subtitle: 'Guided activities together',
    image: require('../assets/Homescreen/coLlearning.png'),
  },
];

export const HomeScreen = ({ navigation }: any) => {
  const { setSelectedRole } = useAuth();

  const enterAsParent = () => {
    setSelectedRole('parent');
    navigation.navigate('ParentLogin');
  };

  const enterAsTeacher = () => {
    setSelectedRole('teacher');
    navigation.navigate('TeacherLogin');
  };

  const renderCard = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.appTitle}>ShikshaSetu</Text>

      {/* Welcome */}
      <Text style={styles.heading}>Let's start learning.</Text>
      <Text style={styles.subHeading}>Choose where you are today</Text>

      {/* Carousel */}
    <View style={styles.middleSection} >
  <FlatList
    data={cards}
    renderItem={renderCard}
    keyExtractor={(item) => item.id}
    horizontal
    showsHorizontalScrollIndicator={false}
    snapToInterval={260}
    decelerationRate="fast"
    contentContainerStyle={{ paddingHorizontal: 5 }}
  />

  <View style={styles.choiceContainer}>
    <TouchableOpacity style={styles.choiceCard} onPress={enterAsParent}>
       <Icon name="home-variant" size={32} color="#6c2bee" />
      <Text style={styles.choiceText}>At Home(Parent)</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.choiceCard, { marginTop: 20 }]}
      onPress={enterAsTeacher}
    >
       <Icon name="school" size={32} color="#6c2bee" />
      <Text style={styles.choiceText}>At School</Text>
    </TouchableOpacity>
  </View>
</View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingTop: 60,
  },

  appTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#6c2bee',
    marginBottom: 20,
  },

  heading: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: '#120d1b',
  },

  subHeading: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4A4A68',
    marginBottom: 30,
  },

  middleSection: {
    marginBottom: 30,
  },

  card: {
    width: 240,
    height: 320,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginRight: 20,
    overflow: 'hidden',
    elevation: 4,
  },
 

  cardImage: {
    width: '100%',
    height: 200,
  },

  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#120d1b',
  },

  cardSubtitle: {
    fontSize: 14,
    color: '#4A4A68',
    marginTop: 4,
    textAlign: 'center',
  },

  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 20,
    gap: 16,
  },

  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 22,
    alignItems: 'center',
    elevation: 4,
  },

  actionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#120d1b',
  },
  choiceContainer: {
  alignItems: 'center',
  marginTop: 30,
},

choiceCard: {
  width: '80%',
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  paddingVertical: 18,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  elevation: 4,
},

choiceText: {
  fontSize: 18,
  fontWeight: '700',
  color: '#120d1b',
},

iconText: {
  fontSize: 32,
  marginBottom: 8,
},

});