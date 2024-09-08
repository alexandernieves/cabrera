import React, { useState, useRef } from "react";
import { 
  Text, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Animated, 
  StatusBar,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack'; 
import { RootStackParamList } from '../App'; 
import Signup from "./Signup";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const googleIcon = require("../assets/google.png");
const facebookIcon = require("../assets/facebook.png");
const background = require("../assets/volante_ford.jpg");

interface DecodedToken {
  role: string;
}

interface LoginProps {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}

const CurvedContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  background-color: #FFFFFF;
  border-bottom-left-radius: 300px;
  border-bottom-right-radius: 300px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const Logo = styled.Image`
  width: 250px;
  height: 60px;
  resize-mode: contain;
  margin-top: 50px;
`;

const Card = styled.View`
  width: 80%;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
`;

const ButtonOptionContainer = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: 20px;
  background-color: #BDBDBD;
  border-radius: 10px;
  padding: 5px;
  position: relative;
`;

const AnimatedSlider = styled(Animated.View)`
  position: absolute;
  top: 5px;
  left: 6px;
  right: 6px;
  width: 50%;
  height: 100%;
  background-color: #002368;
  border-radius: 10px;
`;

const ButtonOption = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-vertical: 15px;
  z-index: 1;
`;

const SocialButton = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 10px;
  padding: 5px;
  width: 100%;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-vertical: 10px;
  flex-direction: row;
  border: 1px solid #BDBDBD;
`;

const InputContainer = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  background-color: #F6F7FB;
  height: 58px;
  margin-bottom: 20px;
  border-radius: 10px;
  padding-horizontal: 12px;
`;

const StyledInput = styled(TextInput)`
  flex: 1;
  font-size: 16px;
`;

const Icon = styled(Ionicons)`
  padding-horizontal: 10px;
`;

const ButtonContainer = styled.View`
  align-items: center;
  margin-top: 10px;
  width: 100%;
`;

const RoundedButton = styled(Animated.createAnimatedComponent(TouchableOpacity))`
  background-color: #002368;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  margin-vertical: 10px;
`;

const RoundedButtonText = styled.Text`
  font-weight: bold;
  color: #fff;
  font-size: 18px;
  border-radius:100px;
`;

const Footer = styled.View`
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
  align-self: center;
`;

const FooterText = styled.Text`
  color: black;
  font-weight: 600;
  font-size: 14px;
`;

const SignUpText = styled.Text`
  color: #002368;
  font-weight: 600;
  font-size: 14px;
`;

const ForgotPasswordText = styled.Text`
  color: #002368;
  font-size: 14px;
  text-decoration: underline;
  align-self: flex-end;
`;

// Función para decodificar JWT sin dependencias externas
function decodeJWT(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1]; // Extraer la parte del payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Reemplazar caracteres de URL
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); // Convertir el payload a objeto JSON
  } catch (error) {
    console.error("Error al decodificar el JWT", error);
    return null;
  }
}

export default function Login({ navigation }: LoginProps) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const sliderAnimation = useRef(new Animated.Value(0)).current;

  // Función para manejar el login usando Axios
  const handleLogin = async () => {
    setEmailError(false);
    setPasswordError(false);

    if (email !== "" && password !== "") {
      setIsLoading(true);
      try {
        // Realizar petición con Axios
        const response = await axios.post('http://localhost:3000/login', {
          email,
          password
        });

        const data = response.data;

        if (data.token) {
          // Almacenar el token en AsyncStorage
          await AsyncStorage.setItem('jwtToken', data.token);

          // Obtener y verificar el token
          const token = await AsyncStorage.getItem('jwtToken');
          console.log("Token recibido:", token);  // Verifica que el token está siendo recibido

          // Decodificar el token para verificar el rol del usuario
          if (token) {
            const decodedToken = decodeJWT(token);  // Usamos la función de decodificación manual
            setIsLoading(false);

            if (decodedToken) {
              // Redirigir según el rol del usuario
              if (decodedToken.role === 'admin') {
                navigation.navigate('Admin'); // Redirigir a la pantalla de administrador
              } else {
                navigation.navigate('DrawerNavigator'); // Redirigir al DrawerNavigator en lugar de Home
              }
            } else {
              console.error("No se pudo decodificar el token");
            }
          } else {
            console.error("No se encontró el token");
          }
        } else {
          setIsLoading(false);
          Alert.alert('Error', 'Credenciales incorrectas');
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error al iniciar sesión', error);
        Alert.alert('Error', 'No se pudo iniciar sesión');
      }
    } else {
      if (email === "") setEmailError(true);
      if (password === "") setPasswordError(true);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <ImageBackground source={background} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CurvedContainer>
        <Logo source={require('../assets/cabrera.png')} />
      </CurvedContainer>
      <Card>
        <ButtonOptionContainer>
          <AnimatedSlider style={{ left: sliderAnimation }} />

          <ButtonOption onPress={() => setIsLogin(true)}>
            <Text style={{ color: isLogin ? "#fff" : "#000", fontWeight: "bold" }}>Log in</Text>
          </ButtonOption>

          <ButtonOption onPress={() => setIsLogin(false)}>
            <Text style={{ color: !isLogin ? "#fff" : "#000", fontWeight: "bold" }}>Sign Up</Text>
          </ButtonOption>
        </ButtonOptionContainer>

        {isLogin ? (
          <>
            <SocialButton>
              <Image source={googleIcon} style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 14 }}>Continue with Google</Text>
            </SocialButton>
            <SocialButton>
              <Image source={facebookIcon} style={{ width: 20, height: 20, marginRight: 5 }} />
              <Text style={{ fontSize: 14 }}>Continue with Facebook</Text>
            </SocialButton>
            <InputContainer style={emailError && { borderColor: 'red', borderWidth: 1.5 }}>
              <Icon name="mail-outline" size={24} color="#888" />
              <StyledInput
                placeholder="Enter email or username"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </InputContainer>
            <InputContainer style={passwordError && { borderColor: 'red', borderWidth: 1.5 }}>
              <Icon name="lock-closed-outline" size={24} color="#888" />
              <StyledInput
                placeholder="Enter password"
                autoCapitalize="none"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={24} color="#888" />
              </TouchableOpacity>
            </InputContainer>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
            </TouchableOpacity>
            <ButtonContainer>
              <RoundedButton onPress={handleLogin}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <RoundedButtonText>Log in</RoundedButtonText>
                )}
              </RoundedButton>
            </ButtonContainer>
          </>
        ) : (
          <Signup />
        )}

        <Footer>
          <FooterText>{isLogin ? "Don't have an account? " : "Already have an account? "}</FooterText>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <SignUpText>{isLogin ? "Sign Up" : "Log in"}</SignUpText>
          </TouchableOpacity>
        </Footer>
      </Card>
      <StatusBar barStyle="dark-content" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  animatedButton: {
    justifyContent: "center",
    alignItems: "center",
  }
});
