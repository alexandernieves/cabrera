import React, { useState, useRef, useEffect } from "react";
import { 
  Text, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Animated, 
  StatusBar,
  ImageBackground,
  StyleSheet,
  View
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Signup from "./Signup";

const googleIcon = require("../assets/google.png");
const facebookIcon = require("../assets/facebook.png");
const background = require("../assets/volante_ford.jpg");

interface LoginProps {
  navigation: NavigationProp<ParamListBase>;
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
  background-color: #002368; /* Color de fondo azul oscuro */
  border-radius: 30px; /* Bordes redondeados */
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

export default function Login({ navigation }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const sliderAnimation = useRef(new Animated.Value(0)).current;
  const buttonWidth = useRef(new Animated.Value(300)).current;
  const buttonHeight = useRef(new Animated.Value(58)).current;
  const borderRadius = useRef(new Animated.Value(10)).current;

  const emailShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loginSuccess) {
      Animated.parallel([
        Animated.timing(buttonWidth, {
          toValue: 58,
          duration: 300,
          useNativeDriver: false, // Es necesario utilizar false para mantener la animación de ancho
        }),
        Animated.timing(buttonHeight, {
          toValue: 58,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(borderRadius, {
          toValue: 29,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // Navegar al preloader y pasar la pantalla de destino
        navigation.navigate('PreloaderCircle', {
          nextScreen: 'Home', // Nombre de la pantalla destino
        });
      });
    }
  }, [loginSuccess]);

  useEffect(() => {
    if (emailError || passwordError) {
      Animated.sequence([
        Animated.timing(emailShake, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emailShake, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emailShake, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emailShake, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.timing(passwordShake, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(passwordShake, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(passwordShake, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(passwordShake, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [emailError, passwordError]);

  const onHandleLogin = () => {
    setEmailError(false);
    setPasswordError(false);

    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("Login success");
          setLoginSuccess(true);
        })
        .catch((err) => {
          console.log("Login error Firebase:", err.message);

          if (err.code === 'auth/invalid-email') {
            setEmailError(true);
          } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.message.includes('auth/invalid-login-credentials')) {
            setEmailError(true);
            setPasswordError(true);
          } else {
            console.log("Otro error de login:", err.message);
          }
        });
    } else {
      if (email === "") setEmailError(true);
      if (password === "") setPasswordError(true);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const shakeStyle = (shakeAnim: Animated.Value) => ({
    transform: [{ translateX: shakeAnim }],
  });

  const switchToLogin = () => {
    setIsLogin(true);
    Animated.timing(sliderAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const switchToSignUp = () => {
    setIsLogin(false);
    Animated.timing(sliderAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const sliderPosition = sliderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  const SocialButtonComponent = () => (
    <>
      <SocialButton>
        <Image source={googleIcon} style={{ width: 20, height: 20, marginRight: 5 }} />
        <Text style={{ fontSize: 14 }}>Continue with Google</Text>
      </SocialButton>
      <SocialButton>
        <Image source={facebookIcon} style={{ width: 20, height: 20, marginRight: 5 }} />
        <Text style={{ fontSize: 14 }}>Continue with Facebook</Text>
      </SocialButton>
    </>
  );

  return (
    <ImageBackground source={background} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CurvedContainer>
        <Logo source={require('../assets/cabrera.png')} />
      </CurvedContainer>
      <Card>
        <ButtonOptionContainer>
          <AnimatedSlider style={{ left: sliderPosition }} />

          <ButtonOption onPress={switchToLogin}>
            <Text style={{ color: isLogin ? "#fff" : "#000", fontWeight: "bold" }}>Log in</Text>
          </ButtonOption>

          <ButtonOption onPress={switchToSignUp}>
            <Text style={{ color: !isLogin ? "#fff" : "#000", fontWeight: "bold" }}>Sign Up</Text>
          </ButtonOption>
        </ButtonOptionContainer>

        {isLogin ? (
          <>
            <SocialButtonComponent />
            <InputContainer style={[emailError && { borderColor: 'red', borderWidth: 1.5 }, shakeStyle(emailShake)]}>
              <Icon name="mail-outline" size={24} color="#888" />
              <StyledInput
                placeholder="Enter email or username"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                value={email}
                onChangeText={(text: string) => setEmail(text)}
              />
            </InputContainer>
            {emailError && <Text style={{ color: 'red', bottom: 15, marginLeft: 10 }}>Invalid email or username</Text>}
            <InputContainer style={[passwordError && { borderColor: 'red', borderWidth: 1.5 }, shakeStyle(passwordShake)]}>
              <Icon name="lock-closed-outline" size={24} color="#888" />
              <StyledInput
                placeholder="Enter password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!passwordVisible}
                textContentType="password"
                value={password}
                onChangeText={(text: string) => setPassword(text)}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons
                  name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#888"
                  style={{ paddingHorizontal: 10 }}
                />
              </TouchableOpacity>
            </InputContainer>
            {passwordError && <Text style={{ color: 'red', bottom: 15, marginLeft: 10 }}>Invalid password</Text>}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
            </TouchableOpacity>
            <ButtonContainer>
              <RoundedButton 
                onPress={onHandleLogin} 
                style={[styles.animatedButton, { width: buttonWidth, height: buttonHeight, borderRadius }]}
              >
                {loginSuccess ? (
                  <Ionicons name="checkmark" size={30} color="white" />
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
          <TouchableOpacity onPress={isLogin ? switchToSignUp : switchToLogin}>
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
