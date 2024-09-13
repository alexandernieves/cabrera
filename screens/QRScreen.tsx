import React from 'react';
import { TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import Header from './Header';

const QRContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

const AvatarContainer = styled.View`
  width: 100px;
  height: 100px;
  background-color: #F6F7FB;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const AvatarImage = styled(Ionicons)`
  font-size: 60px;
  color: #002368;
`;

const QRName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #002368;
  margin-bottom: 5px;
`;

const QRSubtitle = styled.Text`
  font-size: 16px;
  color: #888;
  margin-bottom: 20px;
`;

const QRCodeContainer = styled.View`
  width: 200px;
  height: 200px;
  background-color: #F6F7FB;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const QRCodeImage = styled.Image`
  width: 150px;
  height: 150px;
`;

const ActionButton = styled(TouchableOpacity)`
  width: 90%;
  background-color: #002368;
  border-radius: 10px;
  padding: 15px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  flex-direction: row;
`;

const ActionButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
`;

const QRScreen: React.FC = ({ navigation }: any) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />

      <QRContainer>
        <AvatarContainer>
          <AvatarImage name="person" />
        </AvatarContainer>
        <QRName>Alex Storm</QRName>
        <QRSubtitle>Scan my Contact Number</QRSubtitle>

        <QRCodeContainer>
          <QRCodeImage source={require('../assets/qr-code-placeholder.png')} />
        </QRCodeContainer>

        <ActionButton>
          <Ionicons name="image-outline" size={24} color="#fff" />
          {/* Cambié el texto aquí */}
          <ActionButtonText>Generate QR</ActionButtonText>
        </ActionButton>

        <ActionButton>
          <Ionicons name="scan-outline" size={24} color="#fff" />
          <ActionButtonText>Scan QR</ActionButtonText>
        </ActionButton>

        <TouchableOpacity style={{ marginTop: 20 }} onPress={navigateToHome}>
          <Ionicons name="home-outline" size={28} color="#002368" />
        </TouchableOpacity>
      </QRContainer>
    </SafeAreaView>
  );
};

export default QRScreen;
