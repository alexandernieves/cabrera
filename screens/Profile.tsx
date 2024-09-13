import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import colors from '../colors';
import { RootStackParamList } from '../App';  
import { StackNavigationProp } from '@react-navigation/stack';

type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Admin'>;

// Lista de imágenes de avatar
const avatarImages = [
  require('../assets/1.png'),
  require('../assets/2.png'),
  require('../assets/3.png'),
  require('../assets/4.png'),
  require('../assets/5.png'),
  require('../assets/6.png'),
  require('../assets/7.png'),
  require('../assets/8.png'),
  require('../assets/9.png'),
  require('../assets/10.png')
];

const Profile: React.FC = () => {
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<AdminScreenNavigationProp>();


  // Función para desloguear al usuario
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      navigation.navigate('Login'); // Redirigir al Login.tsx
    } catch (error) {
      console.log('Error al hacer logout:', error);
    }
  };

  // Función para abrir el modal
  const openModal = () => {
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Función para seleccionar un avatar
  const selectAvatar = (index: number) => {
    setSelectedAvatar(index);
  };

  // Función para guardar el avatar seleccionado
  const saveAvatar = async () => {
    try {
      if (selectedAvatar !== null) {
        await AsyncStorage.setItem('selectedAvatar', JSON.stringify(selectedAvatar));
        Alert.alert('Avatar guardado', 'El avatar ha sido guardado exitosamente.');
        closeModal(); // Cerrar el modal después de guardar
      } else {
        Alert.alert('Error', 'Por favor selecciona un avatar antes de guardar.');
      }
    } catch (error) {
      console.error('Error al guardar el avatar:', error);
      Alert.alert('Error', 'No se pudo guardar el avatar.');
    }
  };

  // Función para cargar el avatar guardado
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

  // Función para obtener el total de referidos desde el backend
  const fetchTotalReferrals = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', 'No se encontró un token, por favor inicie sesión.');
        return;
      }

      const response = await fetch('http://localhost:3000/referrals/count', {
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTotalReferrals(data.totalReferrals);
      } else if (data.message === "jwt expired") {
        Alert.alert('Error', 'La sesión ha expirado, por favor inicie sesión nuevamente.');
      } else {
        Alert.alert('Error', data.message || 'Error al obtener los referidos.');
      }
    } catch (error) {
      console.error('Error fetching total referrals:', error);
      Alert.alert('Error', 'Error al obtener los referidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvatar(); // Cargar el avatar cuando se monta el componente
    fetchTotalReferrals();
  }, []);

  return (
    <Container>
      <Header>
      </Header>
      <ProfileInfo>
        <AvatarContainer>
          <AvatarImage source={selectedAvatar !== null ? avatarImages[selectedAvatar] : require('../assets/default.png')} />
          <EditIcon onPress={openModal}>
            <Ionicons name="pencil" size={20} color="#fff" />
          </EditIcon>
        </AvatarContainer>
        <ProfileName>Alex Storm</ProfileName>
        <ProfileEmail>alexstorm@email.com</ProfileEmail>
      </ProfileInfo>

      <StatsContainer>
        <ReferralsCount>
          <Ionicons name="people" size={40} color={colors.primary} />
          {loading ? (
            <CountText>Cargando...</CountText>
          ) : (
            <CountText>{totalReferrals}</CountText>
          )}
          <LabelText>Total Referrals</LabelText>
        </ReferralsCount>
      </StatsContainer>

      <MenuOptions>
        <MenuOption onPress={handleLogout}>
          <MenuIconContainer>
            <Ionicons name="log-out" size={20} color={colors.primary} />
          </MenuIconContainer>
          <MenuText>Log Out</MenuText>
          <ArrowIcon>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </ArrowIcon>
        </MenuOption>
      </MenuOptions>

      {/* Modal para seleccionar el avatar */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <ModalContainer>
          <ModalContent>
            <ModalTitle>Selecciona un avatar</ModalTitle>
            <ImageGrid>
              {avatarImages.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => selectAvatar(index)}>
                  <AvatarOption source={image} style={selectedAvatar === index ? { borderColor: colors.primary, borderWidth: 2 } : {}} />
                </TouchableOpacity>
              ))}
            </ImageGrid>
            <SaveButton onPress={saveAvatar}>
              <SaveButtonText>Guardar Avatar</SaveButtonText>
            </SaveButton>
            <CloseButton onPress={closeModal}>
              <CloseButtonText>Cerrar</CloseButtonText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
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
  justify-content: center;
  align-items: flex-end;
  padding-right: 20px;
`;

const ProfileInfo = styled.View`
  align-items: center;
  margin-top: -50px;
`;

const AvatarContainer = styled.View`
  width: 100px;
  height: 100px;
  position: relative;
  margin-bottom: 10px;
`;

const AvatarImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #f6f6f6;
`;

const EditIcon = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${colors.primary};
  width: 30px;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
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

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ImageGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const AvatarOption = styled.Image`
  width: 80px;
  height: 80px;
  margin: 10px;
  border-radius: 10px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const CloseButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
`;

const CloseButtonText = styled.Text`
  color: white;
  font-size: 16px;
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
