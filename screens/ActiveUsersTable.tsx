import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Icono de la flecha
import styled from 'styled-components/native';
import colors from '../colors'; // Asumiendo que tienes un archivo de colores
import { RootStackParamList } from '../App';

const ActiveUsersTable: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // Datos de ejemplo de usuarios activos
    const activeUsers = [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
        { id: 2, name: 'Michael Brown', email: 'michael@example.com', role: 'User' },
        { id: 3, name: 'Laura White', email: 'laura@example.com', role: 'User' },
    ];

    return (
        <Container>
            <Header>
                {/* Botón de retroceso */}
                <BackButton onPress={() => navigation.navigate('Admin')}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </BackButton>
                <HeaderText>Active Users</HeaderText>
            </Header>

            <ScrollView>
                <Table>
                    <TableHeader>
                        <TableHeaderText>ID</TableHeaderText>
                        <TableHeaderText>Name</TableHeaderText>
                        <TableHeaderText>Email</TableHeaderText>
                        <TableHeaderText>Role</TableHeaderText>
                    </TableHeader>

                    {activeUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                        </TableRow>
                    ))}
                </Table>
            </ScrollView>
        </Container>
    );
};

export default ActiveUsersTable;

// Estilos personalizados
const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const Header = styled.View`
  width: 100%;
  background-color: #002368;
  padding: 40px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  elevation: 4;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 20px;
  top: 45px;
`;

const HeaderText = styled.Text`
  color: #fff;
  font-size: 26px;
  font-weight: bold;
`;

const Table = styled.View`
  margin-top: 20px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
`;

const TableHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  background-color: #002368;
`;

const TableHeaderText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  flex: 1;
  text-align: center;
`;

const TableRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const TableCell = styled.Text`
  font-size: 14px;
  color: #555;
  flex: 1;
  text-align: center;
`;
