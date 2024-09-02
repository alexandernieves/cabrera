import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

const SuccessAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const secondCircleScaleAnim = useRef(new Animated.Value(0)).current;
  const thirdCircleScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Escala del círculo más claro
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
      // Escala del círculo oscuro y aparición del check
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
  }, [scaleAnim, opacityAnim, secondCircleScaleAnim, thirdCircleScaleAnim]);

  return (
    <Container>
      <CircleContainer>
        <ThirdAnimatedCircle style={{ transform: [{ scale: thirdCircleScaleAnim }] }} />
        <SecondAnimatedCircle style={{ transform: [{ scale: secondCircleScaleAnim }] }} />
        <AnimatedCircle style={{ transform: [{ scale: scaleAnim }] }} />
        <CheckMark style={{ opacity: opacityAnim }}>&#10003;</CheckMark>
      </CircleContainer>
      <SuccessText>Your password has been changed{"\n"}successfully</SuccessText>
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
  margin-bottom: 50px; /* Se agregó un margen para separar los círculos del texto */
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
  background-color: #4A90E2; /* Color intermedio para el círculo */
  border-radius: 75px;
  position: absolute;
`;

const ThirdAnimatedCircle = styled(Animated.View)`
  width: 180px;
  height: 180px;
  background-color: #A0C4FF; /* Color más claro para el círculo */
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
  margin-top: 100px; /* Aumentado el margen superior */
  line-height: 24px; /* Mejorada la legibilidad del texto */
`;

export default SuccessAnimation;
