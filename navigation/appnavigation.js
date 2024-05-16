import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TopTabNavigator from '../screens/TopTabNavigator';
import Settings from '../screens/Settings';
import Profile from '../screens/Profile';
import ListServers from '../screens/ListServers';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home2" component={TopTabNavigator} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ListServers" component={ListServers} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
