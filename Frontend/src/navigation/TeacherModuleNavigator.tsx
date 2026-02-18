import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TeacherDashboardScreen from '../features/dashboard/screens/TeacherDashboardScreen';
import TeacherStudentsScreen from '../features/dashboard/screens/TeacherStudentsScreen';
import TeacherStudentProfileScreen from '../features/dashboard/screens/TeacherStudentProfileScreen';
import TeacherScheduleScreen from '../features/dashboard/screens/TeacherScheduleScreen';
import TeacherAssignmentsScreen from '../features/dashboard/screens/TeacherAssignmentsScreen';
import TeacherSettingsScreen from '../features/dashboard/screens/TeacherSettingsScreen';
import { palette } from '../theme/design';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TeacherTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen
        name="TchHome"
        component={TeacherDashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="home-variant" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="TchStudents"
        component={TeacherStudentsScreen}
        options={{
          title: 'Students',
          tabBarIcon: ({ color, size }) => <Icon name="account-group" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="TchSchedule"
        component={TeacherScheduleScreen}
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, size }) => <Icon name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="TchAssign"
        component={TeacherAssignmentsScreen}
        options={{
          title: 'Assignments',
          tabBarIcon: ({ color, size }) => <Icon name="book-open-variant" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="TchSettings"
        component={TeacherSettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Icon name="cog" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const TeacherModuleNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TeacherTabs" component={TeacherTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="TeacherStudentProfile"
        component={TeacherStudentProfileScreen}
        options={{ title: 'Student Profile' }}
      />
    </Stack.Navigator>
  );
};

export default TeacherModuleNavigator;