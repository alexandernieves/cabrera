import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

// Definir el tipo de navegación
type ReferralFormNavigationProp = StackNavigationProp<RootStackParamList, 'ReferralForm'>;

function decodeJWT(token: string): { id: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

const ReferralForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleStatus, setVehicleStatus] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [step, setStep] = useState(1);
  
  // Estados para las validaciones del primer paso
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [phoneNumberValid, setPhoneNumberValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  // Estados para las validaciones del segundo paso
  const [vehicleStatusValid, setVehicleStatusValid] = useState(true);
  const [vehicleBrandValid, setVehicleBrandValid] = useState(true);
  const [vehicleModelValid, setVehicleModelValid] = useState(true);

  const navigation = useNavigation<ReferralFormNavigationProp>();

  // Función para validar los campos del primer paso
  const validateFirstStepInputs = () => {
    let isValid = true;

    if (!firstName) {
      setFirstNameValid(false);
      isValid = false;
    } else {
      setFirstNameValid(true);
    }

    if (!lastName) {
      setLastNameValid(false);
      isValid = false;
    } else {
      setLastNameValid(true);
    }

    const phoneNumberRegex = /^[0-9]*$/;
    if (!phoneNumber || !phoneNumberRegex.test(phoneNumber)) {
      setPhoneNumberValid(false);
      isValid = false;
    } else {
      setPhoneNumberValid(true);
    }

    if (!email || !email.includes('@')) {
      setEmailValid(false);
      isValid = false;
    } else {
      setEmailValid(true);
    }

    return isValid;
  };

  // Función para validar los campos del segundo paso
  const validateSecondStepInputs = () => {
    let isValid = true;

    if (!vehicleStatus) {
      setVehicleStatusValid(false);
      isValid = false;
    } else {
      setVehicleStatusValid(true);
    }

    if (!vehicleBrand) {
      setVehicleBrandValid(false);
      isValid = false;
    } else {
      setVehicleBrandValid(true);
    }

    if (!vehicleModel) {
      setVehicleModelValid(false);
      isValid = false;
    } else {
      setVehicleModelValid(true);
    }

    return isValid;
  };

  const nextStep = () => {
    if (validateFirstStepInputs()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const saveReferral = async () => {
    if (!validateSecondStepInputs()) return;

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', 'No se encontró un token, por favor inicie sesión.');
        return;
      }
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.id) {
        Alert.alert('Error', 'No se pudo obtener el ID del usuario autenticado.');
        return;
      }

      navigation.navigate('PreloaderCircle', { nextScreen: 'SuccessAnimation' });

      const response = await fetch('http://localhost:3000/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          email: email,
          vehicle_status: vehicleStatus,
          vehicle_brand: vehicleBrand,
          vehicle_model: vehicleModel,
          referred_by_user_id: decoded.id,
          status: 'Pending',
        }),
      });

      if (response.ok) {
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setEmail('');
        setVehicleStatus('');
        setVehicleBrand('');
        setVehicleModel('');
        setStep(1);
        navigation.navigate('SuccessAnimation', { nextScreen: 'ReferralForm' });
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error saving referral:', error);
      Alert.alert('Error', 'Failed to save referral');
    }
  };

  return (
    <Container>
      <Title>Your reference, our best treatment</Title>

      {step === 1 ? (
        <>
          <InputLabel>First Name</InputLabel>
          <StyledInput 
            placeholder="Enter your first name" 
            value={firstName} 
            onChangeText={setFirstName} 
            style={{ borderColor: firstNameValid ? colors.primary : 'red' }}
          />
          {!firstNameValid && <ErrorText>First Name invalid</ErrorText>}

          <InputLabel>Last Name</InputLabel>
          <StyledInput 
            placeholder="Enter your last name" 
            value={lastName} 
            onChangeText={setLastName} 
            style={{ borderColor: lastNameValid ? colors.primary : 'red' }}
          />
          {!lastNameValid && <ErrorText>Last Name invalid</ErrorText>}

          <InputLabel>Phone number</InputLabel>
          <StyledInput 
            placeholder="+###" 
            keyboardType="phone-pad" 
            value={phoneNumber} 
            onChangeText={setPhoneNumber} 
            style={{ borderColor: phoneNumberValid ? colors.primary : 'red' }}
          />
          {!phoneNumberValid && <ErrorText>Phone number invalid (numbers only)</ErrorText>}

          <InputLabel>E-mail</InputLabel>
          <StyledInput 
            placeholder="Enter your email" 
            keyboardType="email-address" 
            value={email} 
            onChangeText={setEmail} 
            style={{ borderColor: emailValid ? colors.primary : 'red' }}
          />
          {!emailValid && <ErrorText>Email invalid (must include @)</ErrorText>}

          <SubmitButton onPress={nextStep}>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </SubmitButton>
        </>
      ) : (
        <>
          <InputLabel>Vehicle Status</InputLabel>
          <StyledInput 
            placeholder="Select Vehicle Status" 
            value={vehicleStatus} 
            onChangeText={setVehicleStatus} 
            style={{ borderColor: vehicleStatusValid ? colors.primary : 'red' }}
          />
          {!vehicleStatusValid && <ErrorText>Vehicle Status invalid</ErrorText>}

          <InputLabel>Vehicle Brand</InputLabel>
          <StyledInput 
            placeholder="Select Vehicle Brand" 
            value={vehicleBrand} 
            onChangeText={setVehicleBrand} 
            style={{ borderColor: vehicleBrandValid ? colors.primary : 'red' }}
          />
          {!vehicleBrandValid && <ErrorText>Vehicle Brand invalid</ErrorText>}

          <InputLabel>Vehicle Model</InputLabel>
          <StyledInput 
            placeholder="Select Vehicle Model" 
            value={vehicleModel} 
            onChangeText={setVehicleModel} 
            style={{ borderColor: vehicleModelValid ? colors.primary : 'red' }}
          />
          {!vehicleModelValid && <ErrorText>Vehicle Model invalid</ErrorText>}

          <ButtonContainer>
            <BackButton onPress={prevStep}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </BackButton>
            <SaveButton onPress={saveReferral}>
              <SaveButtonText>Save</SaveButtonText>
            </SaveButton>
          </ButtonContainer>
        </>
      )}
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

const ErrorText = styled.Text`
  color: red;
  font-size: 14px;
  margin-top: 5px;
  align-self: flex-start;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const BackButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  border-radius: 30px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  width: 100px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;
