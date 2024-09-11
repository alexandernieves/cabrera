import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
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

// Definir estilos primero
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002368',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  filterText: {
    fontSize: 16,
    color: '#002368',
  },
  referralsList: {
    paddingVertical: 20,
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F6F7FB',
    borderRadius: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  referralInfo: {
    flexDirection: 'column',
  },
  referralName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002368',
  },
  referralStatus: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
    color: '#fff',
  },
  booked: {
    backgroundColor: '#4CAF50',
  },
  pending: {
    backgroundColor: '#FFC107',
  },
  closed: {
    backgroundColor: '#2196F3',
  },
  lost: {
    backgroundColor: '#F44336',
  },
  pagination: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#002368',
    fontSize: 12,
  },
});

// Después de definir los estilos, creamos el mapeo de status
const statusStyles: Record<string, any> = {
  booked: styles.booked,
  pending: styles.pending,
  closed: styles.closed,
  lost: styles.lost,
};

export default function Referrals() {

  const [selectedFilter, setSelectedFilter] = useState('All Referrals');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); 

  const filters = ['All Referrals', 'Booked', 'Pending', 'Closed', 'Lost'];

  const applyFilter = (filter: string) => {
    setSelectedFilter(filter);
  };

  const filteredData = referralsData.filter((referral) => {
    if (selectedFilter === 'All Referrals') return true;
    return referral.status === selectedFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Referrals</Text>
        <Ionicons name="filter-outline" size={24} color="#002368" />
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>{selectedFilter}</Text>
        <Ionicons name="chevron-down-outline" size={20} color="#002368" />
      </View>

      <ScrollView contentContainerStyle={styles.referralsList}>
        {filteredData.map((referral, index) => (
          <View key={index} style={styles.referralCard}>
            <Image source={referral.avatar} style={styles.avatar} />
            <View style={styles.referralInfo}>
              <Text style={styles.referralName}>{referral.name}</Text>
              {/* Usa el mapeo de estado para aplicar el estilo correcto */}
              <Text style={[styles.referralStatus, statusStyles[referral.status.toLowerCase()]]}>
                {referral.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        <Text>1 - 2</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={28} color="#002368" />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="add-outline" size={28} color="#002368" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="person-outline" size={28} color="#002368" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

