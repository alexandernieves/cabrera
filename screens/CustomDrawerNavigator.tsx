import React, { useState, useEffect, useRef } from 'react';
import { Switch, View, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';  
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Home from './Home'; 
import QRScreen from './QRScreen'; 
import InviteFriendsScreen from './InviteFriendsScreen'; 
import colors from '../colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();
type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Admin'>;

const avatarImages: { [key: number]: any } = {
  0: require('../assets/1.png'),
  1: require('../assets/2.png'),
  2: require('../assets/3.png'),
  3: require('../assets/4.png'),
  4: require('../assets/5.png'),
  5: require('../assets/6.png'),
  6: require('../assets/7.png'),
  7: require('../assets/8.png'),
  8: require('../assets/9.png'),
  9: require('../assets/10.png'),
};


interface DecodedToken {
  id: number;
  email: string;
  name?: string;
  role: string;
  exp: number;
  iat: number;
}

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
  const [isLanguageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const navigation = useNavigation<AdminScreenNavigationProp>();
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null); 


  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const heightAnim = useRef(new Animated.Value(0)).current;

    // Cargar el avatar almacenado desde AsyncStorage
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const storedAvatar = await AsyncStorage.getItem('selectedAvatar');
        if (storedAvatar !== null) {
          setSelectedAvatar(JSON.parse(storedAvatar));
        }
      } catch (error) {
        console.error('Error al cargar el avatar:', error);
      }
    };

    loadAvatar();
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          const decoded = decodeJWT(token);
          setUsername(decoded?.name || 'User');
          setEmail(decoded?.email || '');
        }
      } catch (error) {
        console.log('Error al obtener el token:', error);
      }
    };

    getUserData();
  }, [props]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error al hacer logout:', error);
    }
  };

  const toggleLanguageMenu = () => {
    if (isLanguageMenuOpen) {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setLanguageMenuOpen(false));
    } else {
      setLanguageMenuOpen(true);
      Animated.timing(heightAnim, {
        toValue: 80,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const changeLanguage = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    
    <DrawerContentScrollView {...props}>
  
      <DrawerHeader>
          {selectedAvatar !== null ? (
            <AvatarImage source={avatarImages[selectedAvatar]} />
          ) : (
            <Ionicons name="person" size={60} color="#002368" />
          )}
             <UserInfo>
          <UsernameText>Hi, {username}</UsernameText>
          <EmailText>{email}</EmailText>
        </UserInfo>
      </DrawerHeader>

      <DrawerItemContainer>        
        <DrawerItemStyled onPress={() => props.navigation.navigate("InviteFriendsScreen")}>
          <IconContainer>
            <FontAwesome name="user" size={24} color={colors.primary} />
          </IconContainer>
          <DrawerLabel>Invite Friends</DrawerLabel>
          <ArrowIcon name="chevron-right" size={24} color={colors.primary} />
        </DrawerItemStyled>

        <DrawerItemStyled onPress={() => props.navigation.navigate("QRScreen")}>
          <IconContainer>
            <FontAwesome name="qrcode" size={24} color={colors.primary} />
          </IconContainer>
          <DrawerLabel>Share QR</DrawerLabel>
          <ArrowIcon name="chevron-right" size={24} color={colors.primary} />
        </DrawerItemStyled>
      </DrawerItemContainer>

      <DrawerItemContainer >
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

        {/* Menú de idioma */}
        <DrawerItemStyled onPress={toggleLanguageMenu}>
          <IconContainer>
            <FontAwesome name="globe" size={24} color={colors.primary} />
          </IconContainer>
          <DrawerLabel>Language</DrawerLabel>
          <ArrowIcon name={isLanguageMenuOpen ? 'chevron-up' : 'chevron-down'} size={24} color={colors.primary} />
        </DrawerItemStyled>

        {/* Submenú de idiomas con animación */}
        {isLanguageMenuOpen && (
          <Animated.View style={{ height: heightAnim, overflow: 'hidden', paddingLeft: 20 }}>
            <SubMenuItem onPress={() => changeLanguage('English')}>
              <Flag source={require('../assets/usa.png')} />
              <SubMenuLabel>English</SubMenuLabel>
              {selectedLanguage === 'English' && <CheckIcon name="check" size={20} color={colors.primary} />}
            </SubMenuItem>
            {/* <SubMenuItem onPress={() => changeLanguage('Spanish')}>
              <Flag source={require('../assets/spain.png')} />
              <SubMenuLabel>Spanish</SubMenuLabel>
              {selectedLanguage === 'Spanish' && <CheckIcon name="check" size={20} color={colors.primary} />}
            </SubMenuItem> */}
          </Animated.View>
        )}

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
      <Drawer.Screen name="QRScreen" component={QRScreen} /> 
      <Drawer.Screen name="InviteFriendsScreen" component={InviteFriendsScreen} /> 

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



const AvatarImage = styled.Image`
  width: 70px;
  height: 70px;
  margin-right:20px;
  border-radius: 50px;
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

const SubMenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
`;

const Flag = styled.Image`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const SubMenuLabel = styled.Text`
  font-size: 16px;
  color: ${colors.primary};
`;

const CheckIcon = styled(Entypo)`
  margin-left: auto;
  padding-right: 15px; /* Añadir margen a la derecha del check */
`;

const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #002368;
  padding: 15px;
  border-radius: 10px;
  margin: 20px 20px 0 20px; /* Deja margen inferior al botón */
  position: absolute;
  bottom: 0px; /* Posición al final del contenedor */
  left: 0;
  right: 0;
`;

const LogoutButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-left: 10px;
`;

export default CustomDrawerContent;
