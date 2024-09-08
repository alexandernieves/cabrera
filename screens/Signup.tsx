import React, { useState, useRef, useEffect } from "react";
import { 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Animated, 
  ActivityIndicator 
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack'; 
import { RootStackParamList } from '../App'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Para manejar las peticiones al servidor

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
  border-radius: 100px;
`;

const TermsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 15px;
  margin-bottom: 15px;
  align-items: center;
`;

const TermsText = styled.Text`
  color: #555;
  font-size: 14px;
`;

const LinkText = styled.Text`
  color: #E91E63;
  font-size: 14px;
  text-decoration: underline;
  margin-left: 5px;
`;

const CustomCheckbox = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border-width: 2px;
  border-color: #002368;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

const CheckboxIcon = styled.View`
  width: 12px;
  height: 12px;
  background-color: #002368;
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 12px;
  margin-top: -15px;
  margin-bottom: 10px;
  margin-left: 12px;
`;

export default function Signup() { 
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buttonWidth = useRef(new Animated.Value(300)).current;
  const buttonHeight = useRef(new Animated.Value(58)).current;
  const borderRadius = useRef(new Animated.Value(10)).current;

  const emailShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;
  const nameShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (emailError || passwordError || nameError) {
      // Animación de error en campos si hay errores
      const shakeAnimation = (shakeAnim: Animated.Value) => {
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      };

      shakeAnimation(emailShake);
      shakeAnimation(passwordShake);
      shakeAnimation(nameShake);
    }
  }, [emailError, passwordError, nameError]);

  const onHandleSignUp = async () => {
    setEmailError(false);
    setPasswordError(false);
    setNameError(false);

    if (name === "") {
      setNameError(true);
      return;
    }

    if (email === "") {
      setEmailError(true);
      return;
    }

    if (password === "") {
      setPasswordError(true);
      return;
    }

    if (!acceptedTerms) {
      alert("You must accept the terms and conditions to sign up.");
      return;
    }

    setIsLoading(true);

    // Realizamos la petición al backend para crear el usuario
    try {
      const response = await axios.post('http://localhost:3000/signup', {
        name,
        email,
        password
      });

      if (response.data.message === 'Usuario registrado exitosamente') {
        await AsyncStorage.setItem('username', name);
        setIsLoading(false);
        Alert.alert("Registro exitoso", "El usuario ha sido registrado correctamente");
        navigation.replace('Login'); // Redirige al login después del registro
      } else {
        setIsLoading(false);
        Alert.alert("Error", "No se pudo registrar el usuario");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Signup error", error);
      Alert.alert("Signup error", "No se pudo registrar el usuario");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const CustomCheckboxComponent = () => (
    <CustomCheckbox onPress={() => setAcceptedTerms(!acceptedTerms)}>
      {acceptedTerms && <CheckboxIcon />}
    </CustomCheckbox>
  );

  const shakeStyle = (shakeAnim: Animated.Value) => ({
    transform: [{ translateX: shakeAnim }],
  });

  return (
    <>
      <InputContainer style={[nameError && { borderColor: 'red', borderWidth: 1.5 }, shakeStyle(nameShake)]}>
        <Icon name="person-outline" size={24} color="#888" />
        <StyledInput
          placeholder="Enter your name"
          autoCapitalize="none"
          autoFocus={true}
          value={name}
          onChangeText={setName}
        />
      </InputContainer>
      {nameError && <ErrorText>Name is required</ErrorText>}

      <InputContainer style={[emailError && { borderColor: 'red', borderWidth: 1.5 }, shakeStyle(emailShake)]}>
        <Icon name="mail-outline" size={24} color="#888" />
        <StyledInput
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
        />
      </InputContainer>
      {emailError && <ErrorText>Email is required</ErrorText>}

      <InputContainer style={[passwordError && { borderColor: 'red', borderWidth: 1.5 }, shakeStyle(passwordShake)]}>
        <Icon name="lock-closed-outline" size={24} color="#888" />
        <StyledInput
          placeholder="Create a password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!passwordVisible}
          textContentType="password"
          value={password}
          onChangeText={setPassword}
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
      {passwordError && <ErrorText>Password is required</ErrorText>}

      <TermsContainer>
        <CustomCheckboxComponent />
        <TermsText>I have read and accept</TermsText>
        <TouchableOpacity>
          <LinkText>the terms and conditions</LinkText>
        </TouchableOpacity>
        <TermsText> and </TermsText>
        <TouchableOpacity>
          <LinkText>privacy policies</LinkText>
        </TouchableOpacity>
      </TermsContainer>

      <ButtonContainer>
        <RoundedButton 
          onPress={onHandleSignUp} 
          style={{ width: buttonWidth, height: buttonHeight, borderRadius }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <RoundedButtonText>Sign Up</RoundedButtonText>
          )}
        </RoundedButton>
      </ButtonContainer>
    </>
  );
}
