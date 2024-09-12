import React, { useState, useEffect, useRef } from 'react';
import { ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { RootStackParamList } from '../App'; // Importa tu lista de rutas tipadas

const referralsData = [
  { name: 'Nayib', status: 'Booked', avatar: require('../assets/1.png') },
  { name: 'Trump', status: 'Booked', avatar: require('../assets/2.png') },
  { name: 'Ali', status: 'Pending', avatar: require('../assets/3.png') },
  { name: 'Brown', status: 'Pending', avatar: require('../assets/4.png') },
  { name: 'Charles', status: 'Pending', avatar: require('../assets/5.png') },
  { name: 'Ralf', status: 'Pending', avatar: require('../assets/6.png') },
  { name: 'Wind', status: 'Closed', avatar: require('../assets/7.png') },
  { name: 'Milner', status: 'Lost', avatar: require('../assets/8.png') },
  { name: 'Mr Lee', status: 'Lost', avatar: require('../assets/9.png') },
  { name: 'Peter', status: 'Booked', avatar: require('../assets/10.png') },
];

// Styled Components
const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-vertical: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #002368;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const FilterText = styled.Text`
  font-size: 16px;
  color: #002368;
`;

const ReferralsList = styled.ScrollView`
  padding-vertical: 20px;
`;

const ReferralCard = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: #f6f7fb;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 15px;
`;

const ReferralInfo = styled.View`
  flex-direction: column;
`;

const ReferralName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #002368;
`;

interface BadgeProps {
  bgColor: string;
  textColor: string;
}

const BadgeContainer = styled.View<BadgeProps>`
  margin-top: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: ${(props: { bgColor: any; }) => props.bgColor};
  border: 1px solid ${(props: { textColor: any; }) => props.textColor};
`;

const BadgeText = styled.Text<BadgeProps>`
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: ${(props: { textColor: any; }) => props.textColor};
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled.TouchableOpacity`
  padding: 10px;
`;

const PageCircle = styled(Animated.View)<{ isActive: boolean }>`
  margin: 0 5px;
  padding: 10px;
  width: 35px;
  height: 35px;
  border-radius: 50px;
  background-color: ${(props: { isActive: any; }) => (props.isActive ? '#002368' : 'transparent')};
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
`;

const PageNumber = styled.Text<{ isActive: boolean }>`
  font-size: 16px;
  font-weight: ${(props: { isActive: any; }) => (props.isActive ? 'bold' : 'normal')};
  color: ${(props: { isActive: any; }) => (props.isActive ? '#fff' : '#002368')};
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-vertical: 20px;
  border-top-width: 1px;
  border-top-color: #ccc;
`;

const FooterButton = styled.TouchableOpacity`
  align-items: center;
`;

const FooterButtonText = styled.Text`
  color: #002368;
  font-size: 12px;
`;

// Mapeo de colores para los badges
const statusColors: Record<string, { bgColor: string; textColor: string }> = {
  booked: { bgColor: '#E0F2E9', textColor: '#4CAF50' },
  pending: { bgColor: '#FFF8E1', textColor: '#FFC107' },
  closed: { bgColor: '#E3F2FD', textColor: '#2196F3' },
  lost: { bgColor: '#FFEBEE', textColor: '#F44336' },
};

export default function Referrals() {
  const [selectedFilter, setSelectedFilter] = useState('All Referrals');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Hasta 5 referidos por página

  // Para la animación de paginación
  const paginationAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Iniciar la animación cuando cambia la página
    Animated.timing(paginationAnimation, {
      toValue: currentPage,
      duration: 300,
      useNativeDriver: false, // Para asegurarse de que la animación de estilo funcione correctamente
    }).start();
  }, [currentPage]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const filters = ['All Referrals', 'Booked', 'Pending', 'Closed', 'Lost'];

  const applyFilter = (filter: string) => {
    setSelectedFilter(filter);
  };

  const filteredData = referralsData.filter((referral) => {
    if (selectedFilter === 'All Referrals') return true;
    return referral.status === selectedFilter;
  });

  // Función para calcular el total de páginas
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Obtener los datos para la página actual
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Referrals</Title>
        <Ionicons name="filter-outline" size={24} color="#002368" />
      </Header>

      <FilterContainer>
        <FilterText>{selectedFilter}</FilterText>
        <Ionicons name="chevron-down-outline" size={20} color="#002368" />
      </FilterContainer>

      <ReferralsList>
        {currentData.map((referral, index) => (
          <ReferralCard key={index}>
            <Avatar source={referral.avatar} />
            <ReferralInfo>
              <ReferralName>{referral.name}</ReferralName>
              <BadgeContainer
                bgColor={statusColors[referral.status.toLowerCase()].bgColor}
                textColor={statusColors[referral.status.toLowerCase()].textColor}
              >
                <BadgeText
                  bgColor={statusColors[referral.status.toLowerCase()].bgColor}
                  textColor={statusColors[referral.status.toLowerCase()].textColor}
                >
                  {referral.status}
                </BadgeText>
              </BadgeContainer>
            </ReferralInfo>
          </ReferralCard>
        ))}
      </ReferralsList>

      {/* Paginación */}
      <PaginationContainer>
        <PaginationButton onPress={handlePreviousPage} disabled={currentPage === 1}>
          <Ionicons name="chevron-back-outline" size={24} color={currentPage === 1 ? '#ccc' : '#002368'} />
        </PaginationButton>

        {/* Animación de la paginación */}
        {[...Array(totalPages)].map((_, index) => (
          <PageCircle key={index} isActive={index + 1 === currentPage}>
            <PageNumber isActive={index + 1 === currentPage}>
              {index + 1}
            </PageNumber>
          </PageCircle>
        ))}

        <PaginationButton onPress={handleNextPage} disabled={currentPage === totalPages}>
          <Ionicons name="chevron-forward-outline" size={24} color={currentPage === totalPages ? '#ccc' : '#002368'} />
        </PaginationButton>
      </PaginationContainer>

      <Footer>
        <FooterButton onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={28} color="#002368" />
          <FooterButtonText>Home</FooterButtonText>
        </FooterButton>
        <FooterButton>
          <Ionicons name="add-outline" size={28} color="#002368" />
          <FooterButtonText>Add</FooterButtonText>
        </FooterButton>

        <FooterButton>
          <Ionicons name="person-outline" size={28} color="#002368" />
          <FooterButtonText>Profile</FooterButtonText>
        </FooterButton>
      </Footer>
    </Container>
  );
}
