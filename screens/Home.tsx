import React, { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { useNavigation, NavigationProp, DrawerActions } from "@react-navigation/native";
import { Entypo, FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { RootStackParamList } from "../App";
import colors from '../colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReferralForm from './ReferralForm'; // Importamos el componente del formulario de referidos
import Dashboard from './Dashboard'; // Importamos el componente del dashboard
import Profile from './Profile'; // Importamos el componente del perfil

// Importamos el logo cabrera
const logoCabrera = require("../assets/cabrera.png");

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'referralForm', 'profile'
  const [fadeAnim] = useState(new Animated.Value(1)); // Valor de animación de opacidad

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        // Hacer algo con el username
      }
    };

    fetchUsername();

    navigation.setOptions({
      headerLeft: () => (
        <MenuButton onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Entypo name="menu" size={30} color={colors.primary} />
        </MenuButton>
      ),
      headerRight: () => (
        <QRCodeButton onPress={() => console.log("QR Code pressed")}>
          <FontAwesome name="qrcode" size={30} color={colors.primary} />
        </QRCodeButton>
      ),
      headerTitle: () => (
        <Logo source={logoCabrera} resizeMode="contain" />
      ),
    });
  }, [navigation]);

  const toggleView = (view: string) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActiveView(view); // Cambia a la vista correspondiente
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <Container>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'referralForm' && <ReferralForm />}
        {activeView === 'profile' && <Profile />}
      </Animated.View>

      {/* Menú de navegación inferior */}
      <BottomNavigation>
        <NavItem active={activeView === 'dashboard'} onPress={() => toggleView('dashboard')}>
          <NavItemContent>
            <FontAwesome name="home" size={18} color={activeView === 'dashboard' ? "#FFF" : colors.primary} />
            {activeView === 'dashboard' && <NavItemText active={true}>Home</NavItemText>}
          </NavItemContent>
        </NavItem>
        <NavItem active={activeView === 'referralForm'} onPress={() => toggleView('referralForm')}>
          <NavItemContent>
            <FontAwesome name="plus" size={18} color={activeView === 'referralForm' ? "#FFF" : colors.primary} />
            {activeView === 'referralForm' && <NavItemText active={true}>Add Refer</NavItemText>}
          </NavItemContent>
        </NavItem>
        <NavItem active={activeView === 'profile'} onPress={() => toggleView('profile')}>
          <NavItemContent>
            <FontAwesome name="user" size={18} color={activeView === 'profile' ? "#FFF" : colors.primary} />
            {activeView === 'profile' && <NavItemText active={true}>Profile</NavItemText>}
          </NavItemContent>
        </NavItem>
      </BottomNavigation>
    </Container>
  );
};

export default Home;

// Estilos personalizados
const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Logo = styled.Image`
  width: 150px;
  height: 40px;
`;

const MenuButton = styled.TouchableOpacity`
  padding-left: 20px;
`;

const QRCodeButton = styled.TouchableOpacity`
  padding-right: 20px;
`;

const BottomNavigation = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  background-color: #E0E0E0;
  border-top-width: 1px;
  border-top-color: #ccc;
  position: absolute;
  bottom: 20px;
  margin: 0 20px;
  border-radius: 30px;
  height: 60px;
  width: 90%;
`;

const NavItem = styled.TouchableOpacity<{ active?: boolean }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: ${(props: { active: any; }) => (props.active ? "#002368" : "transparent")};
  border-radius: 30px;
  transition: background-color 0.3s ease-in-out;
`;

const NavItemContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const NavItemText = styled.Text<{ active?: boolean }>`
  font-size: 12px;
  color: ${(props: { active: any; }) => (props.active ? "#FFF" : colors.primary)};
  font-weight: bold;
  margin-left: 8px;
  transition: opacity 0.3s ease-in-out;
  opacity: ${(props: { active: any; }) => (props.active ? 1 : 0)};
`;
