import React, { useState, useEffect } from 'react';
import { Switch, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';  // Asegúrate de importar el tipo RootStackParamList
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Home from './Home'; 
import colors from '../colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();
type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Admin'>;

// Definir el tipo de token decodificado
interface DecodedToken {
  id: number;
  email: string;
  name?: string;
  role: string;
  exp: number;
  iat: number;
}

// Función para decodificar JWT con JavaScript nativo
function decodeJWT(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1]; 
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decodificando el JWT", error);
    return null;
  }
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigation = useNavigation<AdminScreenNavigationProp>();

  // Estados para almacenar el nombre de usuario y el correo
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Obtener el token de AsyncStorage y decodificarlo
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          const decoded = decodeJWT(token); // Usar la función nativa para decodificar el token
          
          // Asignar el nombre y el correo electrónico del token decodificado
          setUsername(decoded?.name || 'User');  // Usar "User" si no hay nombre
          setEmail(decoded?.email || '');        // Email debe estar siempre en el token
        }
      } catch (error) {
        console.log('Error al obtener el token:', error);
      }
    };

    getUserData();
  }, [props]); // Ejecutar el efecto cada vez que cambien las props para asegurarse de obtener nuevos datos

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      // Eliminar el token de AsyncStorage al hacer logout
      await AsyncStorage.removeItem('jwtToken');
      
      // Redirigir al login
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error al hacer logout:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader>
        <ProfileImage source={{ uri: 'https://example.com/user_profile_image.png' }} />
        <UserInfo>
          {/* Mostrar el nombre y el correo real del usuario */}
          <UsernameText>Hi, {username}</UsernameText>
          <EmailText>{email}</EmailText>
        </UserInfo>
      </DrawerHeader>

      <DrawerItemContainer>
        <DrawerItemStyled onPress={() => props.navigation.navigate("Profile")}>
          <IconContainer>
            <FontAwesome name="user" size={24} color={colors.primary} />
          </IconContainer>
          <DrawerLabel>My Profile</DrawerLabel>
          <ArrowIcon name="chevron-right" size={24} color={colors.primary} />
        </DrawerItemStyled>
        
        <DrawerItemStyled onPress={() => props.navigation.navigate("Home")}>
          <IconContainer>
            <FontAwesome name="users" size={24} color={colors.primary} />
          </IconContainer>
          <DrawerLabel>Invite Friends</DrawerLabel>
          <ArrowIcon name="chevron-right" size={24} color={colors.primary} />
        </DrawerItemStyled>
      </DrawerItemContainer>

      <Separator />

      <DrawerItemContainer>
        <DrawerItemStyled>
          <IconContainer>
            <MaterialIcons name="notifications" size={24} color={colors.primary} />
          </IconContainer>
          <DrawerLabel>Notifications</DrawerLabel>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            style={{ marginLeft: 'auto' }}
          />
        </DrawerItemStyled>

        <DrawerItemStyled onPress={() => props.navigation.navigate("Home")}>
          <IconContainer>
            <FontAwesome name="globe" size={24} color={colors.primary} />
          </IconContainer>
          <DrawerLabel>Language</DrawerLabel>
          <ArrowIcon name="chevron-right" size={24} color={colors.primary} />
        </DrawerItemStyled>

        <DrawerItemStyled onPress={() => props.navigation.navigate("Settings")}>
          <IconContainer>
            <FontAwesome name="cog" size={24} color={colors.primary} />
          </IconContainer>
          <DrawerLabel>Settings</DrawerLabel>
          <ArrowIcon name="chevron-right" size={24} color={colors.primary} />
        </DrawerItemStyled>
      </DrawerItemContainer>

      <LogoutButton onPress={handleLogout}>
        <FontAwesome name="sign-out" size={24} color="#fff" />
        <LogoutButtonText>Log Out</LogoutButtonText>
      </LogoutButton>
    </DrawerContentScrollView>
  );
}

export function CustomDrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Home} />
      <Drawer.Screen name="Settings" component={Home} />
    </Drawer.Navigator>
  );
}

// Estilos personalizados
const DrawerHeader = styled.View`
  padding: 20px;
  flex-direction: row;
  align-items: center;
  background-color: ${colors.lightGray};
`;

const ProfileImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 15px;
`;

const UserInfo = styled.View`
  flex-direction: column;
`;

const UsernameText = styled.Text`
  font-size: 18px;
  color: ${colors.primary};
  font-weight: bold;
`;

const EmailText = styled.Text`
  font-size: 14px;
  color: ${colors.gray};
`;

const DrawerItemContainer = styled.View`
  margin-top: 10px;
`;

const DrawerItemStyled = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  margin-bottom: 10px;
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  background-color: #F0F0F0;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const DrawerLabel = styled.Text`
  font-size: 16px;
  color: ${colors.primary};
  margin-left: 15px;
  flex: 1;
`;

const ArrowIcon = styled(Entypo)`
  margin-left: auto;
`;

const Separator = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray};
  margin-vertical: 10px;
`;

const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #002368;
  padding: 15px;
  border-radius: 10px;
  margin: 20px;
`;

const LogoutButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-left: 10px;
`;
