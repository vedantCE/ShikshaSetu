import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Parent Screens
import ParentHomeScreen from '../features/dashboard/screens/ParentHomeScreen';
import LearningAnalyticsScreen from '../features/dashboard/screens/LearningAnalyticsScreen';
import ParentProfileScreen from '../features/dashboard/screens/ParentProfileScreen';
import SettingsScreen from '../features/dashboard/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const ParentModuleNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#1B337F',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F3F4F6',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="ParentHome"
                component={ParentHomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="ParentInsights"
                component={LearningAnalyticsScreen}
                options={{
                    tabBarLabel: 'Insights',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="poll" color={color} size={size} />
                    ),
                }}
            />
            {/* 
        Changing from Profile to Settings per second prompt:
        Actually, let's keep Settings on the tab bar and maybe profile is accessed from settings, 
        or we have a custom Profile tab. The user said: 
        "instead on clicking parent profile should open parenthomescreen"
        "clicking profile should open parentprofilescreen"
        Let's put Profile in the tab bar. 
      */}
            <Tab.Screen
                name="ParentProfile"
                component={ParentProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="ParentSettings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="cog-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default ParentModuleNavigator;
