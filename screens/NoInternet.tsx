import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Message = styled.Text`
  font-size: 16px;
  color: #555;
  text-align: center;
  margin-bottom: 20px;
`;

const RetryButton = styled.TouchableOpacity`
  padding-vertical: 12px;
  padding-horizontal: 24px;
  background-color: #2196f3;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const NoInternetScreen = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <Container>
      <Title>No Internet Connection</Title>
      <Message>Please check your connection and try again.</Message>
      <RetryButton onPress={onRetry}>
        <ButtonText>Retry</ButtonText>
      </RetryButton>
    </Container>
  );
};

export default NoInternetScreen;
