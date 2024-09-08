import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';
import Home from './screens/Home';
import Admin from './screens/Admin';
import Chat from './screens/Chat';
import ImagePreloader from './components/ImagePreloader';
import NoInternet from './screens/NoInternet';
import ForgotPassword from './screens/ViewReset/ForgotPassword';
import ConfirmCode from './screens/ViewReset/ConfirmCode';
import SuccessAnimation from './components/SuccessAnimation';
import PreloaderCircle from './components/PreloaderCircle';
import { CustomDrawerNavigator } from './screens/CustomDrawerNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ConfirmCode: undefined;
  Home: undefined;
  Chat: undefined;
  NoInternet: undefined;
  Admin: undefined;  
  Success: { nextScreen: string };
  PreloaderCircle: { nextScreen: keyof RootStackParamList };
  DrawerNavigator: undefined;  // Añadimos el Drawer al Stack
};

const Stack = createStackNavigator<RootStackParamList>();

function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"  // Puedes cambiar a "welcome" si lo prefieres
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
      <Stack.Screen name="DrawerNavigator" component={CustomDrawerNavigator} /> 
      {/* Anidamos el Drawer Navigator aquí */}
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Success" component={SuccessAnimation} />
      <Stack.Screen name="PreloaderCircle" component={PreloaderCircle} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isPreloading, setIsPreloading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1])); 
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setIsAuthenticated(true); // Usuario autenticado
          } else {
            await AsyncStorage.clear();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verificando la autenticación:', error);
        setIsAuthenticated(false);
      }
      setIsPreloading(false);
    };

    checkAuthentication();
  }, []);

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
      ) : isAuthenticated ? (
        <CustomDrawerNavigator />  
      ) : (
        <MainStackNavigator /> 
      )}
    </NavigationContainer>
  );
}
