import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';
import ForgotPassword from './screens/ViewReset/ForgotPassword';
import ConfirmCode from './screens/ViewReset/ConfirmCode';
import Admin from './screens/Admin';
import Home from './screens/Home'; // Asegúrate de importar correctamente tu componente
import Chat from './screens/Chat';
import ImagePreloader from './components/ImagePreloader';
import NoInternet from './screens/NoInternet';
import SuccessAnimation from './components/SuccessAnimation';
import PreloaderCircle from './components/PreloaderCircle';
import { CustomDrawerNavigator } from './screens/CustomDrawerNavigator';  // Asegúrate que este sea un componente

export type RootStackParamList = {
  Welcome: undefined; 
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ConfirmCode: undefined;
  Admin: undefined;
  Home: undefined;
  Chat: undefined;
  NoInternet: undefined;
  SuccessAnimation: { nextScreen: string };
  Success: { nextScreen: string };
  PreloaderCircle: { nextScreen: keyof RootStackParamList };
  DrawerNavigator: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
      <Stack.Screen name="DrawerNavigator" component={CustomDrawerNavigator} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="SuccessAnimation" component={SuccessAnimation} />
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
          // Verificar si el token es válido llamando al servidor
          const response = await axios.post('http://192.168.1.100:3000/verifyToken', { token });  // Asegúrate de usar la IP correcta
          if (response.data.valid) {
            setIsAuthenticated(true); // El token es válido, el usuario sigue autenticado
          } else {
            await AsyncStorage.clear();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false); // No hay token en AsyncStorage
        }
      } catch (error) {
        console.error('Error verificando la autenticación:', error);
        setIsAuthenticated(false);
      }
      setIsPreloading(false); // Termina el estado de precarga
    };

    checkAuthentication();
  }, []);

  return (
    <NavigationContainer>
      {isPreloading ? (
        <ImagePreloader onFinish={() => setIsPreloading(false)} />
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
