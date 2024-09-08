import React, { useState } from 'react';
import { Switch, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';  // Asegúrate de importar el tipo RootStackParamList
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Home from './Home'; 
import colors from '../colors';

const Drawer = createDrawerNavigator();
type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigation = useNavigation<AdminScreenNavigationProp>();




  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader>
        <ProfileImage source={{ uri: 'https://example.com/user_profile_image.png' }} />
        <UserInfo>
          <UsernameText>Hi, Alex Storm</UsernameText>
          <EmailText>alexstorm@email.com</EmailText>
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

      <LogoutButton onPress={() => navigation.navigate('Login')}>
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
