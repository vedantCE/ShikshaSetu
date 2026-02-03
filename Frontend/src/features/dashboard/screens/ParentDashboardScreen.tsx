import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';

const dummyChildren = [
  {
    id: '1',
    name: 'My Child Aarav',
    avatar: require('../assets/Homescreen/puzzleGame.png'),
  },
  // Add more
];

const ParentDashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  const showProfile = () => {
    Alert.alert(
      'Parent Profile',
      `Name: ${user?.name || 'Parent'}\nEmail: ${user?.email || 'parent@example.com'}\nContact: +91 98765 43210\nAddress: Ahmedabad, Gujarat`
    );
  };

  const renderChild = ({ item }: any) => (
    <Pressable
      style={styles.childCard}
      onPress={() => navigation.navigate('ActivityHub')}
    >
      <Image source={item.avatar} style={styles.avatar} />
      <Text style={styles.childName}>{item.name}</Text>
      <Icon name="chevron-right" size={28} color="#888" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Children</Text>
        <Pressable onPress={showProfile}>
          <Icon name="account-circle" size={44} color="#6c2bee" />
        </Pressable>
      </View>

      <FlatList
        data={dummyChildren}
        renderItem={renderChild}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No children yet. Add one!</Text>}
      />

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('ParentAddChild')}
      >
        <Icon name="plus" size={32} color="#fff" />
        <Text style={styles.addText}>Add Child</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#120d1b' },
  list: { paddingHorizontal: 20 },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  childName: { flex: 1, marginLeft: 20, fontSize: 20, fontWeight: '700' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 50 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6c2bee',
    margin: 20,
    padding: 16,
    borderRadius: 30,
    elevation: 5,
  },
  addText: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 12 },
});

export default ParentDashboardScreen;