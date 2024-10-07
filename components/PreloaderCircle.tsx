import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

const PreloaderCircle = () => {
  const fadeAnim1 = new Animated.Value(1);
  const fadeAnim2 = new Animated.Value(1);
  const fadeAnim3 = new Animated.Value(1);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { nextScreen: string } }, 'params'>>();

  useEffect(() => {
    const animate = (anim: Animated.Value | Animated.ValueXY, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.5, // Opacidad más clara
            duration: 500,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1, // Opacidad completa
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(fadeAnim1, 0);
    animate(fadeAnim2, 200);
    animate(fadeAnim3, 400);

    // Redirección a la pantalla especificada en `nextScreen`
    const timeoutId = setTimeout(() => {
        // @ts-ignore
      navigation.navigate(route.params.nextScreen);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [navigation, route.params.nextScreen]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          styles.circle1,
          {
            backgroundColor: '#002368',
            opacity: fadeAnim1, // Animación de opacidad
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          {
            backgroundColor: '#002368',
            opacity: fadeAnim2, // Animación de opacidad
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle3,
          {
            backgroundColor: '#002368',
            opacity: fadeAnim3, // Animación de opacidad
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 400,
    left: 200,
  },
  circle: {
    position: 'absolute',
    borderRadius: 50,
  },
  circle1: {
    width: 70,
    height: 70,
    top: -70,
    right: 0,
  },
  circle2: {
    width: 50,
    height: 50,
    top: -50,
    right: -55,
  },
  circle3: {
    width: 30,
    height: 30,
    bottom: -25,
  },
});

export default PreloaderCircle;
