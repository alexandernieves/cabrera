import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';

export default function Chat() {

  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  const onSignOut = async () => {
    console.log('Attempting to sign out...');
    try {
      await signOut(auth);
      console.log('Sign out successful');
      navigation.replace('Login'); // Asegúrate de que tienes una pantalla de inicio de sesión llamada 'Login'
    } catch (error) {
      console.log('Error logging out: ', error);
    }
  };

  useLayoutEffect(() => {
    console.log('Setting navigation options');
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10
          }}
          onPress={() => {
            console.log('Sign out button pressed');
            onSignOut();
          }}
        >
          <AntDesign name="logout" size={24} color={colors.gray} style={{marginRight: 10}}/>
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      console.log('querySnapshot unsubscribe');
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      );
    }, error => {
      console.error("Firestore subscription error: ", error);
    });

    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, 'chats'), {
      _id,
      createdAt,
      text,
      user
    }).catch(error => {
      console.error("Error adding document: ", error);
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={messages => onSend(messages)}
        messagesContainerStyle={{
          backgroundColor: '#fff'
        }}
        textInputStyle={{
          backgroundColor: '#fff',
          borderRadius: 20,
        }}
        user={{
          _id: auth?.currentUser?.email,
          avatar: 'https://i.pravatar.cc/300'
        }}
      />
    </View>
  );
}
