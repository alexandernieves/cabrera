import React, { useEffect, useState } from "react";
import { View, Text, Image, Alert, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp, DrawerActions } from "@react-navigation/native";
import { Entypo } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { RootStackParamList } from "../App";
import colors from '../colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const catImageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        Alert.alert("Error", "No username found");
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
        <Image
          source={{ uri: catImageUrl }}
          style={{
            width: 40,
            height: 40,
            marginRight: 15,
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <Container>
      <WelcomeText>Hello, {username}</WelcomeText>
      <ChatButton onPress={() => navigation.navigate("Chat")}>
        <Entypo name="chat" size={24} color={colors.lightGray} />
      </ChatButton>
    </Container>
  );
};

export default Home;

// Estilos personalizados
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const WelcomeText = styled.Text`
  font-size: 24px;
  color: ${colors.primary};
  margin-bottom: 20px;
`;

const ChatButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  height: 50px;
  width: 50px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  shadow-color: ${colors.primary};
  shadow-offset: {
    width: 0px;
    height: 2px;
  };
  shadow-opacity: 0.9;
  shadow-radius: 8px;
  margin-right: 20px;
  margin-bottom: 50px;
`;

const MenuButton = styled(TouchableOpacity)`
  padding-left: 20px;
  padding-right: 20px;
`;

