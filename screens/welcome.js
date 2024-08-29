import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image source={require('../assets/1.jpg')} style={styles.image} />
        </View>
        <View style={styles.imageWrapper2}>
          <Image source={require('../assets/2.jpg')} style={styles.image2} />
        </View>
        <View style={styles.imageWrapper3}>
          <Image source={require('../assets/3.jpg')} style={styles.image3} />
        </View>
        <View style={styles.imageWrapper4}>
          <Image source={require('../assets/4.jpg')} style={styles.image4} />
        </View>
      </View>
      <Text style={styles.title}>Formate en la mejor academia</Text>
      <Text style={styles.subtitle}>Connect with each other with chatting or calling. Enjoy safe and private texting</Text>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Join Now</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          With integrated AI
          <View style={styles.imageWrapper5}>
            <Image source={require('../assets/ai.png')} style={styles.image5} />
          </View>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(41,86,81,0.84)',
    padding: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
    position: 'absolute',
    top: 20,
  },
  imageWrapper: {
    borderRadius: 15,
    width: 80,
    height: 80,
    transform: [{ rotate: '10deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    left: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageWrapper2: {
    borderRadius: 15,
    width: 110,
    height: 110,
    transform: [{ rotate: '-10deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    position: 'absolute',
    left: 20,
    top: 30,
  },
  image2: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageWrapper3: {
    borderRadius: 15,
    width: 150,
    height: 150,
    transform: [{ rotate: '20deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    position: 'absolute',
    top: 180,
    right: 270,
  },
  image3: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageWrapper4: {
    borderRadius: 15,
    width: 200,
    height: 200,
    transform: [{ rotate: '-20deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    position: 'absolute',
    top: 120,
    left: 200,
  },
  image4: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageWrapper5: {
    borderRadius: 15,
    width: 20, // Tamaño reducido para la imagen 5
    height: 20, // Tamaño reducido para la imagen 5
    position: 'absolute',
    top: 120,
    left: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image5: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ffd600',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 200,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginRight: 15,
    marginBottom: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    textAlign: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginBottom: 20,
    width: '80%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(41,86,81,0.84)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
