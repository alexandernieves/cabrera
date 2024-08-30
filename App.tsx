import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';
import Home from './screens/Home';
import Chat from './screens/Chat';
import ImagePreloader from './components/ImagePreloader';
import NoInternet from './screens/NoInternet';

export type RootStackParamList = {
  welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Chat: undefined;
  NoInternet: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isPreloading, setIsPreloading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  const handlePreloaderFinish = () => {
    setIsPreloading(false);
  };

  return (
    <NavigationContainer>
      {isPreloading ? (
        <ImagePreloader
          onFinish={() => {
            setIsPreloading(false);
            if (!isConnected) {
              setIsConnected(false);
            }
          }}
        />
      ) : !isConnected ? (
        <NoInternet onRetry={() => setIsPreloading(true)} /> 
      ) : (
        <Stack.Navigator initialRouteName="welcome">
          <Stack.Screen
            name="welcome"
            component={Welcome}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Home"
            component={Home}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
