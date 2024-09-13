import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

const SuccessAnimation = ({ navigation }: { navigation: any }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const secondCircleScaleAnim = useRef(new Animated.Value(0)).current;
  const thirdCircleScaleAnim = useRef(new Animated.Value(0)).current;
  const route = useRoute<RouteProp<{ params: { nextScreen?: string } }, 'params'>>();

  useEffect(() => {
    Animated.sequence([
      Animated.timing(thirdCircleScaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(secondCircleScaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const timeoutId = setTimeout(() => {
      // Redirigir al DrawerNavigator para que el usuario vea la pantalla principal
      navigation.replace('DrawerNavigator');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [scaleAnim, opacityAnim, secondCircleScaleAnim, thirdCircleScaleAnim, navigation]);

  return (
    <Container>
      <CircleContainer>
        <ThirdAnimatedCircle style={{ transform: [{ scale: thirdCircleScaleAnim }] }} />
        <SecondAnimatedCircle style={{ transform: [{ scale: secondCircleScaleAnim }] }} />
        <AnimatedCircle style={{ transform: [{ scale: scaleAnim }] }} />
        <CheckMark style={{ opacity: opacityAnim }}>&#10003;</CheckMark>
      </CircleContainer>
      <SuccessText>Successful registration</SuccessText>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const CircleContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
`;

const AnimatedCircle = styled(Animated.View)`
  width: 120px;
  height: 120px;
  background-color: #002368;
  border-radius: 60px;
  position: absolute;
`;

const SecondAnimatedCircle = styled(Animated.View)`
  width: 150px;
  height: 150px;
  background-color: #4A90E2;
  border-radius: 75px;
  position: absolute;
`;

const ThirdAnimatedCircle = styled(Animated.View)`
  width: 180px;
  height: 180px;
  background-color: #A0C4FF;
  border-radius: 90px;
  position: absolute;
`;

const CheckMark = styled(Animated.Text)`
  font-size: 60px;
  color: #fff;
  position: absolute;
`;

const SuccessText = styled.Text`
  font-size: 18px;
  color: #002368;
  text-align: center;
  margin-top: 100px;
  line-height: 24px;
`;

export default SuccessAnimation;
