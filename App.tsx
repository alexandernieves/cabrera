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
import PreloaderCircle from './components/PreloaderCircle';  // Importa el PreloaderCircle

export type RootStackParamList = {
  welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ConfirmCode: undefined;
  Home: undefined;
  Chat: undefined;
  NoInternet: undefined;
  Success: { nextScreen: string }; // Asegurarse de que Success acepta un parámetro
  PreloaderCircle: { nextScreen: keyof RootStackParamList }; // Incluye el tipo del parámetro nextScreen
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
        <Stack.Navigator
          initialRouteName="welcome"
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.FadeFromBottomAndroid,  // Configura la transición de desvanecido
          }}
        >
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
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="ConfirmCode"
            component={ConfirmCode} // Registro de la nueva pantalla ConfirmCode
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
          <Stack.Screen
            name="Success"
            component={SuccessAnimation} // Registra la vista de éxito aquí
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="PreloaderCircle"
            component={PreloaderCircle} // Registra la vista del PreloaderCircle
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
