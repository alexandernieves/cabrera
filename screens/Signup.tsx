import React, { useState, useRef, useEffect } from "react";
import { 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Animated, 
  ActivityIndicator 
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

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
  color: #fff; /* Texto blanco */
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
  color: #E91E63; /* Color del link */
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const buttonWidth = useRef(new Animated.Value(300)).current;
  const buttonHeight = useRef(new Animated.Value(58)).current;
  const borderRadius = useRef(new Animated.Value(10)).current;

  const emailShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;
  const nameShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (signupSuccess) {
      Animated.parallel([
        Animated.timing(buttonWidth, {
          toValue: 58,
          duration: 300,
          useNativeDriver: false,
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
        navigation.navigate('Success', {
          nextScreen: 'Home', // Nombre de la pantalla destino
        });
      });
    }
  }, [signupSuccess]);

  useEffect(() => {
    if (emailError || passwordError || nameError) {
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

      Animated.sequence([
        Animated.timing(nameShake, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(nameShake, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(nameShake, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(nameShake, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [emailError, passwordError, nameError]);

  const onHandleSignUp = () => {
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

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Signup success');
        setIsLoading(false);
        setSignupSuccess(true);
      })
      .catch((err) => {
        console.error("Signup error", err.message);
        setIsLoading(false);
        Alert.alert("Signup error", err.message);
      });
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
          onChangeText={(text: string) => setName(text)}
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
          onChangeText={(text: string) => setEmail(text)}
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
          ) : signupSuccess ? (
            <Ionicons name="checkmark" size={30} color="white" />
          ) : (
            <RoundedButtonText>Sign Up</RoundedButtonText>
          )}
        </RoundedButton>
      </ButtonContainer>
    </>
  );
}
