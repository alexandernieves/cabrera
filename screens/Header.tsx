// Header.tsx
import React from 'react';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import colors from '../colors';

// Logo e ícono de QR
const logoCabrera = require("../assets/cabrera.png");

const Header: React.FC = () => {
  const navigation = useNavigation();

  return (
    <HeaderContainer>
      {/* Botón de Menú */}
      <MenuButton onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Entypo name="menu" size={30} color={colors.primary} />
      </MenuButton>

      {/* Logo */}
      <Logo source={logoCabrera} resizeMode="contain" />

      {/* Botón de QR */}
      <QRCodeButton onPress={() => console.log("QR Code pressed")}>
        <FontAwesome name="qrcode" size={30} color={colors.primary} />
      </QRCodeButton>
    </HeaderContainer>
  );
};

export default Header;

// Estilos personalizados
const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
`;

const Logo = styled.Image`
  width: 150px;
  height: 40px;
`;

const MenuButton = styled.TouchableOpacity``;

const QRCodeButton = styled.TouchableOpacity``;
