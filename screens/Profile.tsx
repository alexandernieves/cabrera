// Profile.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import colors from '../colors';

const Profile: React.FC = () => {
  return (
    <Container>
      <Header />
      <ProfileInfo>
        <AvatarIcon>
          <FontAwesome name="user" size={80} color={colors.primary} />
        </AvatarIcon>
        <ProfileName>Alex Storm</ProfileName>
        <ProfileEmail>alexstorm@email.com</ProfileEmail>
        <ProfilePhone>+### ##########</ProfilePhone>
        <ProfileLocation>Municipality</ProfileLocation>
      </ProfileInfo>

      <StatsContainer>
        <ReferralsCount>
          <FontAwesome name="users" size={40} color={colors.primary} />
          <CountText>11</CountText>
          <LabelText>Total Referrals</LabelText>
        </ReferralsCount>
      </StatsContainer>

      <MenuOptions>
        <MenuOption>
          <MenuIconContainer>
            <FontAwesome name="pencil" size={20} color={colors.primary} />
          </MenuIconContainer>
          <MenuText>Edit Profile</MenuText>
          <ArrowIcon>
            <FontAwesome name="angle-right" size={20} color={colors.primary} />
          </ArrowIcon>
        </MenuOption>

        <MenuOption>
          <MenuIconContainer>
            <FontAwesome name="cog" size={20} color={colors.primary} />
          </MenuIconContainer>
          <MenuText>Settings</MenuText>
          <ArrowIcon>
            <FontAwesome name="angle-right" size={20} color={colors.primary} />
          </ArrowIcon>
        </MenuOption>

        <MenuOption>
          <MenuIconContainer>
            <FontAwesome name="sign-out" size={20} color={colors.primary} />
          </MenuIconContainer>
          <MenuText>Log Out</MenuText>
          <ArrowIcon>
            <FontAwesome name="angle-right" size={20} color={colors.primary} />
          </ArrowIcon>
        </MenuOption>
      </MenuOptions>
    </Container>
  );
};

export default Profile;

// Estilos personalizados
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
`;

const Header = styled.View`
  width: 100%;
  height: 100px;
  background-color: ${colors.primary};
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const ProfileInfo = styled.View`
  align-items: center;
  margin-top: -50px;
`;

const AvatarIcon = styled.View`
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 50px;
`;

const ProfileName = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.primary};
  margin-top: 10px;
`;

const ProfileEmail = styled.Text`
  font-size: 16px;
  color: #555;
  margin-top: 5px;
`;

const ProfilePhone = styled.Text`
  font-size: 16px;
  color: #555;
  margin-top: 5px;
`;

const ProfileLocation = styled.Text`
  font-size: 16px;
  color: #555;
  margin-top: 5px;
`;

const StatsContainer = styled.View`
  margin-top: 20px;
  align-items: center;
`;

const ReferralsCount = styled.View`
  align-items: center;
`;

const CountText = styled.Text`
  font-size: 40px;
  font-weight: bold;
  color: ${colors.primary};
  margin-top: 5px;
`;

const LabelText = styled.Text`
  font-size: 16px;
  color: ${colors.primary};
  margin-top: 5px;
`;

const MenuOptions = styled.View`
  width: 100%;
  padding: 20px;
`;

const MenuOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const MenuIconContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 40px;
`;

const MenuText = styled.Text`
  font-size: 18px;
  color: ${colors.primary};
  flex: 1;
`;

const ArrowIcon = styled.View`
  width: 40px;
  align-items: center;
  justify-content: center;
`;
