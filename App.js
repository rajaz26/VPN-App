import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Appnavigation from './navigation/appnavigation';
import { Provider } from 'react-redux';
import { store } from './store'; 
import 'react-native-reanimated'
import 'react-native-gesture-handler'

export default function App() {
  return (
    <NavigationContainer >
      <Appnavigation />
    </NavigationContainer>

  );
}

