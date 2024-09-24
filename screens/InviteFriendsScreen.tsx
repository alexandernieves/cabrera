import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import Header from './Header'; // Importamos el Header

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #fff;
`;

const Button = styled.TouchableOpacity`
  width: 90%;
  background-color: #002368;
  border-radius: 10px;
  padding: 15px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  flex-direction: row;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
`;

const ReferralCodeContainer = styled.View`
  width: 90%;
  border-width: 1px;
  border-color: #002368;
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
`;

const ReferralCodeText = styled.Text`
  font-size: 16px;
  color: #002368;
  font-weight: bold;
`;

const CopyButton = styled.TouchableOpacity`
  padding: 5px 10px;
  border-width: 1px;
  border-color: #002368;
  border-radius: 5px;
  margin-top: 10px;
`;

const CopyButtonText = styled.Text`
  font-size: 14px;
  color: #002368;
  font-weight: bold;
`;

const IconRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 30px;
`;

const IconItem = styled.View`
  justify-content: center;
  align-items: center;
`;

const IconText = styled.Text`
  margin-top: 10px;
  font-size: 14px;
  color: #002368;
  font-weight: bold;
`;

const HomeButtonContainer = styled.View`
  position: absolute;
  bottom: 20px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const InviteFriendsScreen: React.FC = ({ navigation }: any) => {
  useLayoutEffect(() => {
    // Desactivamos el header predeterminado
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const shareLink = async () => {
    try {
      const result = await Share.share({
        message: 'Invite your friends using this link: https://www.example.com',
        url: 'https://www.example.com',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ', result.activityType);
        } else {
          console.log('Link shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />

      <Container>
        <IconRow>
          <IconItem>
            <Ionicons name="person-add-outline" size={50} color="#002368" />
            <IconText>Invite Friends</IconText>
          </IconItem>
          <Ionicons name="arrow-forward-outline" size={24} color="#002368" />
          <IconItem>
            <Ionicons name="people-outline" size={50} color="#002368" />
            <IconText>Friends Come Onboard</IconText>
          </IconItem>
          <Ionicons name="arrow-forward-outline" size={24} color="#002368" />
          <IconItem>
            <Ionicons name="card-outline" size={50} color="#002368" />
            <IconText>Get Credits</IconText>
          </IconItem>
        </IconRow>

        <ReferralCodeContainer>
          <ReferralCodeText>Your referral Code</ReferralCodeText>
          <ReferralCodeText>##########</ReferralCodeText>
          <CopyButton>
            <CopyButtonText>Copy Code</CopyButtonText>
          </CopyButton>
        </ReferralCodeContainer>

        {/* Botón de compartir usando WhatsApp */}
        <Button onPress={shareLink}>
          <Ionicons name="logo-whatsapp" size={24} color="#fff" />
          <ButtonText>Invite Friends</ButtonText>
        </Button>

        {/* Botón de compartir con opción de QR o enlace */}
        <Button onPress={shareLink}>
          <Ionicons name="share-outline" size={24} color="#fff" />
          <ButtonText>Share Link</ButtonText>
        </Button>

        {/* Icono de Home centrado en la parte inferior */}
        <HomeButtonContainer>
          <TouchableOpacity onPress={navigateToHome}>
            <Ionicons name="home-outline" size={28} color="#002368" />
          </TouchableOpacity>
        </HomeButtonContainer>
      </Container>
    </SafeAreaView>
  );
};

export default InviteFriendsScreen;
