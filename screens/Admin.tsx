import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';  // Asegúrate de importar el tipo RootStackParamList

// Define el tipo de navegación para Admin
type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Admin'>;

const Admin: React.FC = () => {
  const navigation = useNavigation<AdminScreenNavigationProp>();

  return (
    <Container>
      <Header>
        <HeaderText>Admin Dashboard</HeaderText>
      </Header>

      <Content>
        <SectionTitle>Welcome, Admin!</SectionTitle>
        <SectionDescription>
          This is your admin dashboard where you can manage users, referrals, and more.
        </SectionDescription>

        <AdminButton onPress={() => navigation.navigate('Login')}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
          <ButtonText>Log Out</ButtonText>
        </AdminButton>
      </Content>
    </Container>
  );
};

export default Admin;

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  align-items: center;
`;

const Header = styled.View`
  width: 100%;
  background-color: #002368;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const HeaderText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
`;

const Content = styled.View`
  flex: 1;
  padding: 20px;
  width: 100%;
  align-items: center;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #002368;
  margin-bottom: 10px;
`;

const SectionDescription = styled.Text`
  font-size: 16px;
  color: #555;
  text-align: center;
  margin-bottom: 20px;
`;

const AdminButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #002368;
  padding: 15px;
  width: 80%;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
`;
