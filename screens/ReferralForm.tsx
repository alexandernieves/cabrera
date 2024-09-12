import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styled from 'styled-components/native';
import colors from '../colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Importar navegación
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App'; // Importar el tipo de navegación

// Definir el tipo de navegación
type ReferralFormNavigationProp = StackNavigationProp<RootStackParamList, 'ReferralForm'>;

// Decodificar el JWT
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
  const navigation = useNavigation<ReferralFormNavigationProp>(); // Usar navegación tipada

  const nextStep = () => {
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const saveReferral = async () => {
    try {
      // Obtener el token JWT almacenado
      const token = await AsyncStorage.getItem('jwtToken');
  
      if (!token) {
        Alert.alert('Error', 'No se encontró un token, por favor inicie sesión.');
        return;
      }
  
      // Decodificar el token JWT para obtener el id del usuario autenticado
      const decoded = decodeJWT(token);
  
      if (!decoded || !decoded.id) {
        Alert.alert('Error', 'No se pudo obtener el ID del usuario autenticado.');
        return;
      }
  
      // Redirigir a la animación de carga
      navigation.navigate('PreloaderCircle', { nextScreen: 'SuccessAnimation' });
  
      // Enviar los datos al servidor
      const response = await fetch('http://localhost:3000/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,  // Incluir el token en el encabezado
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          email: email,
          vehicle_status: vehicleStatus,
          vehicle_brand: vehicleBrand,
          vehicle_model: vehicleModel,
          referred_by_user_id: decoded.id, // Usar el id del usuario autenticado
          status: 'Pending',  // Definir el estado del referido
        }),
      });
  
      if (response.ok) {
        // Limpiar los inputs
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setEmail('');
        setVehicleStatus('');
        setVehicleBrand('');
        setVehicleModel('');
        setStep(1); // Resetear el formulario
  
        // Navegar a la animación de éxito
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
          />

          <InputLabel>Last Name</InputLabel>
          <StyledInput 
            placeholder="Enter your last name" 
            value={lastName} 
            onChangeText={setLastName} 
          />

          <InputLabel>Phone number</InputLabel>
          <StyledInput 
            placeholder="+###" 
            keyboardType="phone-pad" 
            value={phoneNumber} 
            onChangeText={setPhoneNumber} 
          />

          <InputLabel>E-mail</InputLabel>
          <StyledInput 
            placeholder="Enter your email" 
            keyboardType="email-address" 
            value={email} 
            onChangeText={setEmail} 
          />

          <SubmitButton onPress={nextStep}>
            <SubmitButtonText>{">"}</SubmitButtonText>
          </SubmitButton>
        </>
      ) : (
        <>
          <InputLabel>Vehicle Status</InputLabel>
          <StyledInput 
            placeholder="Select Vehicle Status" 
            value={vehicleStatus} 
            onChangeText={setVehicleStatus} 
          />

          <InputLabel>Vehicle Brand</InputLabel>
          <StyledInput 
            placeholder="Select Vehicle Brand" 
            value={vehicleBrand} 
            onChangeText={setVehicleBrand} 
          />

          <InputLabel>Vehicle Model</InputLabel>
          <StyledInput 
            placeholder="Select Vehicle Model" 
            value={vehicleModel} 
            onChangeText={setVehicleModel} 
          />

          <ButtonContainer>
            <BackButton onPress={prevStep}>
              <SubmitButtonText>{"<"}</SubmitButtonText>
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

const SubmitButtonText = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
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
