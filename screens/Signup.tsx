import React, { useState, useRef, useEffect } from "react";
import { 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Animated 
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

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

const RoundedButton = styled.TouchableOpacity`
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
  font-size: 18px; /* Tamaño de la fuente */
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const emailShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;
  const nameShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (emailError) {
      triggerShake(emailShake);
    }
    if (passwordError) {
      triggerShake(passwordShake);
    }
    if (nameError) {
      triggerShake(nameShake);
    }
  }, [emailError, passwordError, nameError]);

  const triggerShake = (shakeAnim: Animated.Value | Animated.ValueXY) => {
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

  const onHandleSignUp = () => {
    let isValid = true;

    setEmailError(false);
    setPasswordError(false);
    setNameError(false);

    if (name === "") {
      setNameError(true);
      isValid = false;
    }

    if (email === "") {
      setEmailError(true);
      isValid = false;
    }

    if (password === "") {
      setPasswordError(true);
      isValid = false;
    }

    if (!acceptedTerms) {
      alert("You must accept the terms and conditions to sign up.");
      return;
    }

    if (isValid) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => console.log('Signup success'))
        .catch((err) => Alert.alert("Signup error", err.message));
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
        <RoundedButton onPress={onHandleSignUp}>
          <RoundedButtonText>Sign Up</RoundedButtonText>
        </RoundedButton>
      </ButtonContainer>
    </>
  );
}
