import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, Text, ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';

const ImagePreloaderContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #002368;
`;

const SpinnerContainer = styled.View`
  position: absolute;
  bottom: 50px;
  align-items: center;
  flex-direction: row;
`;

const LoadingText = styled.Text`
  color: #fff;
  margin-left: 10px;
  font-size: 18px;
`;

const StyledImage = styled(Animated.Image)`
  width: 100%;
  aspect-ratio: 1.5; /* Ajusta la relación de aspecto según la imagen */
  resize-mode: contain; /* Muestra toda la imagen sin recortar ni estirar */
  opacity: 0.75;
`;



const CustomSpinner = () => (
  <SpinnerContainer>
    <ActivityIndicator size="large" color="#fff" />
    <LoadingText>Loading</LoadingText>
  </SpinnerContainer>
);

const ImagePreloader: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const opacity = useState(new Animated.Value(0.75))[0]; // Incrementar opacidad a 75%
  const [hasPreloadFinished, setHasPreloadFinished] = useState(false);

  const images = [
    require('../assets/jeep_compass.jpg'),
    require('../assets/hyundai_elantra.jpg'),
    require('../assets/ford_raptor_autumn.jpg'),
    require('../assets/ford_raptor_forest.jpg'),
    require('../assets/ram_2500_power_wagon.jpg')
  ];

  useEffect(() => {
    const preloaderTimeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500, // Suavizado al cambiar a la vista principal
        useNativeDriver: true,
      }).start(() => {
        setHasPreloadFinished(true);
        if (onFinish) {
          onFinish();
        }
      });
    }, 10000); // Mantener el preloader durante 10 segundos

    return () => clearTimeout(preloaderTimeout);
  }, [onFinish, opacity]);

  useEffect(() => {
    const imageCycleTimeout = setTimeout(() => {
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        setCurrentImageIndex(0); // Reinicia al principio de las imágenes
      }
    }, 2000); // Mostrar cada imagen durante 3 segundos

    return () => clearTimeout(imageCycleTimeout);
  }, [currentImageIndex, images]);

  if (hasPreloadFinished) {
    return null;
  }

  return (
    <ImagePreloaderContainer>
      <StyledImage source={images[currentImageIndex]} style={{ opacity }} />
      <CustomSpinner />
    </ImagePreloaderContainer>
  );
};

export default ImagePreloader;
