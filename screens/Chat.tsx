import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { GiftedChat, IMessage, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import { RootStackParamList } from '../App';


type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const navigation = useNavigation<ChatScreenNavigationProp>();

  const onSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.log('Error logging out: ', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={onSignOut}
        >
          <AntDesign name="logout" size={24} color={colors.gray} />
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return unsubscribe;
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
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

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={messages => onSend(messages)}
        messagesContainerStyle={{
          backgroundColor: '#fff'
        }}
        renderInputToolbar={renderInputToolbar}
        user={{
          _id: auth?.currentUser?.email || '',
          avatar: 'https://i.pravatar.cc/300'
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 8,
  },
});

export default Chat;
