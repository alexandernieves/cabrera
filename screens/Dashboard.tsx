import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator, Alert } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import colors from '../colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard: React.FC = () => {
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [pendingReferrals, setPendingReferrals] = useState(0); // Estado para referidos pendientes
  const [loading, setLoading] = useState(true);

  // Función para obtener el total de referidos desde el backend
  useEffect(() => {
    const fetchTotalReferrals = async () => {
      try {
        // Obtener el token almacenado en AsyncStorage
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          Alert.alert('Error', 'No se encontró un token, por favor inicie sesión.');
          return;
        }

        // Realizar la solicitud al backend usando el token almacenado para el total de referidos
        const response = await fetch('http://localhost:3000/referrals/count', {
          headers: {
            Authorization: `${token}`, // Enviar el token en los encabezados
          },
        });

        const data = await response.json();
        if (response.ok) {
          setTotalReferrals(data.totalReferrals);
        } else if (data.message === "jwt expired") {
          Alert.alert('Error', 'La sesión ha expirado, por favor inicie sesión nuevamente.');
        } else {
          Alert.alert('Error', data.message || 'Error al obtener los referidos.');
        }
      } catch (error) {
        console.error('Error fetching total referrals:', error);
        Alert.alert('Error', 'Error al obtener los referidos.');
      } finally {
        setLoading(false);
      }
    };

    const fetchPendingReferrals = async () => {
      try {
        // Obtener el token almacenado en AsyncStorage
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          Alert.alert('Error', 'No se encontró un token, por favor inicie sesión.');
          return;
        }

        // Realizar la solicitud al backend para los referidos pendientes
        const response = await fetch('http://localhost:3000/referrals/count-pending', {
          headers: {
            Authorization: `${token}`, // Enviar el token en los encabezados
          },
        });

        const data = await response.json();
        if (response.ok) {
          setPendingReferrals(data.pendingReferrals);
        } else if (data.message === "jwt expired") {
          Alert.alert('Error', 'La sesión ha expirado, por favor inicie sesión nuevamente.');
        } else {
          Alert.alert('Error', data.message || 'Error al obtener los referidos pendientes.');
        }
      } catch (error) {
        console.error('Error fetching pending referrals:', error);
        Alert.alert('Error', 'Error al obtener los referidos pendientes.');
      }
    };

    fetchTotalReferrals();
    fetchPendingReferrals(); // Llamada para obtener los referidos pendientes
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ReferralContainer>
        <ReferralBoxLarge>
          <BoxTitle>Total Referrals</BoxTitle>
          <BoxIconAndValue>
            <FontAwesome name="users" size={50} color={colors.primary} />
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <BoxValue>{totalReferrals === 0 ? "0" : totalReferrals}</BoxValue>
            )}
          </BoxIconAndValue>
        </ReferralBoxLarge>

        <RowContainer>
          <ReferralBoxSquare>
            <SmallBoxTitle>Booked</SmallBoxTitle>
            <BoxIconAndValue>
              <FontAwesome name="check-circle" size={50} color={colors.primary} />
              <SmallBoxValue>0</SmallBoxValue>
            </BoxIconAndValue>
          </ReferralBoxSquare>

          <ReferralBoxSquare>
            <SmallBoxTitle>Pending</SmallBoxTitle>
            <BoxIconAndValue>
              <FontAwesome name="hourglass-half" size={50} color={colors.primary} />
              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <SmallBoxValue>{pendingReferrals}</SmallBoxValue> // Mostrar el número de referidos pendientes
              )}
            </BoxIconAndValue>
          </ReferralBoxSquare>
        </RowContainer>

        <RowContainer>
          <ReferralBoxSquare>
            <SmallBoxTitle>Closed</SmallBoxTitle>
            <BoxIconAndValue>
              <FontAwesome name="smile-o" size={50} color={colors.primary} />
              <SmallBoxValue>0</SmallBoxValue>
            </BoxIconAndValue>
          </ReferralBoxSquare>

          <ReferralBoxSquare>
            <SmallBoxTitle>Lost</SmallBoxTitle>
            <BoxIconAndValue>
              <FontAwesome name="frown-o" size={50} color={colors.primary} />
              <SmallBoxValue>0</SmallBoxValue>
            </BoxIconAndValue>
          </ReferralBoxSquare>
        </RowContainer>
      </ReferralContainer>
    </ScrollView>
  );
};

export default Dashboard;

// Estilos personalizados
const ReferralContainer = styled.View`
  padding: 20px;
  flex-grow: 1;
`;

const ReferralBoxLarge = styled.View`
  background-color: #f6f6f6;
  padding: 20px;
  margin-bottom: 30px;
  height: 150px;
  border-radius: 30px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const BoxTitle = styled.Text`
  font-size: 18px;
  color: ${colors.primary};
`;

const BoxIconAndValue = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BoxValue = styled.Text`
  font-size: 50px;
  font-weight: bold;
  color: ${colors.primary};
  margin-left: 10px;
`;

const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ReferralBoxSquare = styled.View`
  flex: 1;
  background-color: #f6f6f6;
  padding: 40px;
  margin: 10px;
  border-radius: 20px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const SmallBoxTitle = styled.Text`
  font-size: 18px;
  color: ${colors.primary};
  margin-bottom: 10px;
`;

const SmallBoxValue = styled.Text`
  font-size: 40px;
  font-weight: bold;
  color: ${colors.primary};
  margin-left: 10px;
`;
