import React, { useState } from 'react';
import { Image, TouchableOpacity, Alert, TextInput } from "react-native";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { NavigationProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { RootStackParamList } from '../App';


const backImage = require("../assets/backImage.png");

interface SignupProps {
  navigation: NavigationProp<RootStackParamList>;
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 36px;
  font-weight: bold;
  color: orange;
  align-self: center;
  padding-bottom: 24px;
`;

const StyledInput = styled.TextInput`
  background-color: #F6F7FB;
  height: 58px;
  margin-bottom: 20px;
  font-size: 16px;
  border-radius: 10px;
  padding: 12px;
`;

const BackImage = styled.Image`
  width: 100%;
  height: 340px;
  position: absolute;
  top: 0;
  resize-mode: cover;
`;

const WhiteSheet = styled.View`
  width: 100%;
  height: 75%;
  position: absolute;
  bottom: 0;
  background-color: #fff;
  border-top-left-radius: 60px;
`;

const Form = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  margin-horizontal: 30px;
`;

const Button = styled(TouchableOpacity)`
  background-color: #f57c00;
  height: 58px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;

const ButtonText = styled.Text`
  font-weight: bold;
  color: #fff;
  font-size: 18px;
`;

const Footer = styled.View`
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
  align-self: center;
`;

const FooterText = styled.Text`
  color: gray;
  font-weight: 600;
  font-size: 14px;
`;

const FooterLink = styled(TouchableOpacity)``;

const FooterLinkText = styled.Text`
  color: #f57c00;
  font-weight: 600;
  font-size: 14px;
`;

export default function Signup({ navigation }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onHandleSignup = () => {
    if (email !== '' && password !== '') {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => console.log('Signup success'))
        .catch((err) => Alert.alert("Login error", err.message));
    }
  };
  
  return (
    <Container>
      <BackImage source={backImage} />
      <WhiteSheet />
      <Form>
        <Title>Sign Up</Title>
        <StyledInput
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text: string) => setEmail(text)}
        />
        <StyledInput
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text: string) => setPassword(text)}
        />
        <Button onPress={onHandleSignup}>
          <ButtonText>Sign Up</ButtonText>
        </Button>
        <Footer>
          <FooterText>Don't have an account? </FooterText>
          <FooterLink onPress={() => navigation.navigate("Login")}>
            <FooterLinkText>Log In</FooterLinkText>
          </FooterLink>
        </Footer>
      </Form>
    </Container>
  );
}
