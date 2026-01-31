// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   Pressable,
//   Dimensions,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient'; // <-- React Native CLI version
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../navigation/RootNavigator';
// import { useAuth } from '../context/AuthContext';

// type Props = {
//   navigation: NativeStackNavigationProp<RootStackParamList, 'ActivityHub'>;
// };

// const { width } = Dimensions.get('window');

// const ActivityHubScreen = ({ navigation }: Props) => {
//   const { currentStudent } = useAuth();

//   const activities = [
//     {
//       title: 'ABC Tracing',
//       emoji: '🔤',
//       image:
//         'https://img.freepik.com/free-vector/alphabet-tracing-template_23-2148774858.jpg',
//       screen: 'LetterGrid' as const,
//       disabled: false,
//     },
//     {
//       title: 'Numbers',
//       emoji: '🔢',
//       image:
//         'https://www.preschoolplayandlearn.com/wp-content/uploads/2024/10/traceable-numbers-worksheets.jpg',
//       screen: null,
//       disabled: true,
//     },
//     {
//       title: 'Lines',
//       emoji: '📏',
//       image:
//         'https://www.preschoolplayandlearn.com/wp-content/uploads/2024/01/tracing-lines-worksheets-for-3-year-olds.jpg',
//       screen: null,
//       disabled: true,
//     },
//     {
//       title: 'Shapes',
//       emoji: '🔺',
//       image:
//         'https://i2.wp.com/www.preschoolmom.com/wp-content/uploads/2019/06/FreeTracingShapeWorksheets.jpg',
//       screen: null,
//       disabled: true,
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.mainTitle}>
//         Choose Activity {currentStudent ? `for ${currentStudent.name}` : ''}
//       </Text>

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Foundational</Text>
//         <Text style={styles.sectionDesc}>Academic basics through visual play</Text>
//       </View>

//       <View style={styles.grid}>
//         {activities.map((activity, index) => (
//           <Pressable
//             key={index}
//             onPress={() => activity.screen && navigation.navigate(activity.screen)}
//             disabled={activity.disabled}
//             style={({ pressed }) => [
//               styles.cardContainer,
//               {
//                 transform: [{ scale: pressed && !activity.disabled ? 0.95 : 1 }],
//               },
//             ]}
//           >
//             <ImageBackground
//               source={{ uri: activity.image }}
//               style={styles.imageBackground}
//               resizeMode="cover"
//             >
//               <LinearGradient
//                 colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
//                 locations={[0.4, 1]}
//                 style={styles.gradient}
//               >
//                 <Text style={styles.cardTitle}>
//                   {activity.emoji} {activity.title}
//                 </Text>
//                 {activity.disabled && (
//                   <Text style={styles.comingSoon}>Coming Soon</Text>
//                 )}
//               </LinearGradient>

//               {activity.disabled && <View style={styles.disabledOverlay} />}
//             </ImageBackground>
//           </Pressable>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default ActivityHubScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f6f8f8',
//     paddingTop: 40,
//   },
//   mainTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#111618',
//     marginBottom: 24,
//     paddingHorizontal: 20,
//   },
//   sectionHeader: {
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#111618',
//   },
//   sectionDesc: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//   },
//   cardContainer: {
//     width: width * 0.48, // Responsive 2-column layout
//     aspectRatio: 4 / 3,
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginBottom: 20,
//   },
//   imageBackground: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   gradient: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     padding: 20,
//   },
//   cardTitle: {
//     color: '#FFF',
//     fontSize: 22,
//     fontWeight: 'bold',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   comingSoon: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 8,
//     opacity: 0.95,
//   },
//   disabledOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255,255,255,0.6)',
//   },
// });
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const foundational = [
  {
    id: '1',
    title: 'ABC & Letters',
    image: require('../public/Activityhub/abc.png'),
  },
  {
    id: '2',
    title: 'Numbers & Maths',
    image: require('../public/Activityhub/number.jpg'),
  },
  {
    id: '3',
    title: 'Shapes & Lines',
    image: require('../public/Activityhub/shapes.png'),
  },
];

const lifeSkills = [
  {
    id: '4',
    title: 'Stories & Feelings',
    image: require('../public/Activityhub/stories.png'),
  },
  {
    id: '5',
    title: 'Talking in Real Life',
    image: require('../public/Activityhub/talking.png'),
  },
];

export const ActivityHubScreen = () => {
  const renderCard = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <ImageBackground source={item.image} style={styles.cardImage}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.65)']}
          style={styles.overlay}
        />
        <Text style={styles.cardText}>{item.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View >
        {/* <Icon name="cog-outline" size={26} color="#111" />
        <Text style={styles.headerTitle}>Learn</Text>
        <View style={{ width: 26 }} /> */}
      </View>

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
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

      {/* Life Skills */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
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
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 120,
        }}
      />

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
      size={24}
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
    padding: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 20,
  },

  sectionSub: {
    fontSize: 13,
    color: '#777',
    marginHorizontal: 16,
    marginBottom: 12,
  },

  card: {
    flex: 1,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },

  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    padding: 12,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
