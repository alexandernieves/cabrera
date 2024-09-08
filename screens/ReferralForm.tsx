// ReferralForm.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styled from 'styled-components/native';
import colors from '../colors';

const ReferralForm: React.FC = () => {
  return (
    <Container>
      <Title>Your reference, our best treatment</Title>
      
      <InputLabel>First Name</InputLabel>
      <StyledInput placeholder="Enter your first name" />
      
      <InputLabel>Last Name</InputLabel>
      <StyledInput placeholder="Enter your last name" />
      
      <InputLabel>Phone number</InputLabel>
      <StyledInput placeholder="+###" keyboardType="phone-pad" />
      
      <InputLabel>E-mail</InputLabel>
      <StyledInput placeholder="Enter your email" keyboardType="email-address" />
      
      <SubmitButton>
        <SubmitButtonText>{">"}</SubmitButtonText>
      </SubmitButton>
    </Container>
  );
};

export default ReferralForm;

// Estilos personalizados
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 20px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.primary};
  text-align: center;
  margin-bottom: 20px;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  color: ${colors.primary};
  align-self: flex-start;
  margin-top: 10px;
`;

const StyledInput = styled.TextInput`
  width: 100%;
  height: 40px;
  border: 1px solid ${colors.primary};
  border-radius: 10px;
  margin-top: 5px;
  padding-left: 10px;
  background-color: white;
`;

const SubmitButton = styled.TouchableOpacity`
  margin-top: 20px;
  width: 60px;
  height: 60px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  border-radius: 30px;
`;

const SubmitButtonText = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
`;
