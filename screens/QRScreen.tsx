import React, { useState } from 'react';
import { TouchableOpacity, SafeAreaView, Modal, View, Text, Share, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import Header from './Header';
import QRCode from 'react-native-qrcode-svg'; // Importamos la librería QR

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

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 80%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled(TouchableOpacity)`
  background-color: #002368;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
`;

const CloseButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const QRScreen: React.FC = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const shareLink = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this link: https://www.google.com',
        url: 'https://www.google.com', // URL a compartir
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartido con una actividad específica
          console.log('Shared with activity: ', result.activityType);
        } else {
          // Compartido sin actividad específica
          console.log('Link shared');
        }
      } else if (result.action === Share.dismissedAction) {
        // Cancelado
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
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

        {/* Botón para abrir el modal */}
        <ActionButton onPress={openModal}>
          <Ionicons name="image-outline" size={24} color="#fff" />
          <ActionButtonText>Generate QR</ActionButtonText>
        </ActionButton>

        {/* Botón para compartir el enlace */}
        <ActionButton onPress={shareLink}>
          <Ionicons name="share-outline" size={24} color="#fff" />
          <ActionButtonText>Share Link</ActionButtonText>
        </ActionButton>

        <TouchableOpacity style={{ marginTop: 20 }} onPress={navigateToHome}>
          <Ionicons name="home-outline" size={28} color="#002368" />
        </TouchableOpacity>
      </QRContainer>

      {/* Modal para mostrar el QR */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="fade"
      >
        <ModalContainer>
          <ModalContent>
            <Text style={{ marginBottom: 20, fontSize: 18, fontWeight: 'bold' }}>
              Scan this QR Code
            </Text>
            {/* Código QR que redirige a www.google.com */}
            <QRCode value="https://www.google.com" size={200} />
            
            {/* Botón para cerrar el modal */}
            <CloseButton onPress={closeModal}>
              <CloseButtonText>Close</CloseButtonText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </SafeAreaView>
  );
};

export default QRScreen;
