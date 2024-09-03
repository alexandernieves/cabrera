import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';
import Home from './screens/Home';
import Chat from './screens/Chat';
import ImagePreloader from './components/ImagePreloader';
import NoInternet from './screens/NoInternet';
import ForgotPassword from './screens/ViewReset/ForgotPassword';
import ConfirmCode from './screens/ViewReset/ConfirmCode'; 
import SuccessAnimation from './components/SuccessAnimation';
import PreloaderCircle from './components/PreloaderCircle';
import { CustomDrawerNavigator } from './screens/menu/CustomDrawerNavigator'; // Ajusta la ruta según tu estructura de carpetas

export type RootStackParamList = {
  welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ConfirmCode: undefined;
  Home: undefined;
  Chat: undefined;
  NoInternet: undefined;
  Success: { nextScreen: string };
  PreloaderCircle: { nextScreen: keyof RootStackParamList };
};

const Stack = createStackNavigator<RootStackParamList>();

function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      }}
    >
      <Stack.Screen
        name="welcome"
        component={Welcome}
      />
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
      />
      <Stack.Screen
        name="ConfirmCode"
        component={ConfirmCode}
      />
      <Stack.Screen
        name="Home"
        component={Home}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
      />
      <Stack.Screen
        name="Success"
        component={SuccessAnimation}
      />
      <Stack.Screen
        name="PreloaderCircle"
        component={PreloaderCircle}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isPreloading, setIsPreloading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

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
        <CustomDrawerNavigator />
      )}
    </NavigationContainer>
  );
}
