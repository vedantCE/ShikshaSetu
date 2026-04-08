import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const developers = [
  { name: 'Khushi Bhatt', image: require('../../assets/Homescreen/student.png') },
  { name: 'Pooja Lingayat', image: require('../../assets/Homescreen/student.png') },
  { name: 'Vednat Bhatt', image: require('../../assets/Homescreen/student.png') },
  { name: 'Dharm Gabani', image: require('../../assets/Homescreen/student.png') },
];

const mentor = {
  name: 'Prof. Ronak R Patel',
  image: require('../../assets/Homescreen/parent.png'),
};

const AboutUsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color="#1A1A2E" />
        </Pressable>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>APP VERSION</Text>
          <Text style={styles.versionText}>Version 2.4.1</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>TEAM</Text>
          <Text style={styles.teamText}>Team: Nuviq</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>DEVELOPERS</Text>
          <View style={styles.grid}>
            {developers.map((dev) => (
              <View key={dev.name} style={styles.memberCard}>
                <Image source={dev.image} style={styles.memberImage} />
                <Text style={styles.memberName}>{dev.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>MENTOR</Text>
          <View style={styles.mentorCard}>
            <Image source={mentor.image} style={styles.mentorImage} />
            <Text style={styles.mentorName}>{mentor.name}</Text>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  teamText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B337F',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  memberCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  memberImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  mentorCard: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: '#F8FAFF',
  },
  mentorImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E5E7EB',
    marginBottom: 10,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
});

export default AboutUsScreen;
