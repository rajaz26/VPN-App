import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Profile from './Profile';
import Settings from './Settings';
import HomeScreen from './HomeScreen';
import ListServers from './ListServers';

import { COLORS } from '../assets/theme';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const tabIcons = {
  Home: 'home',
  List: 'list', 
  Settings: 'settings',
  Profile: 'person',
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor:'#292B3A'}}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icon = tabIcons[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableWithoutFeedback key={route.key} onPress={onPress}>
            <View
              style={{
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical:15,
                backgroundColor:'#292B3A', 
              }}
            >
              <Ionicons
                name={isFocused ? icon : `${icon}-outline`}
                size={24}
                color={isFocused ? "#F4C11E" : 'white'}
              />
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

const TopTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      tabBarPosition="bottom"
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="List" component={ListServers} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TopTabNavigator;
