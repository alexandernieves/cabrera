// Dashboard.tsx
import React from "react";
import { ScrollView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import colors from '../colors';

const Dashboard: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ReferralContainer>
        <ReferralBoxLarge>
          <BoxTitle>Total Referrals</BoxTitle>
          <BoxIconAndValue>
            <FontAwesome name="users" size={50} color={colors.primary} />
            <BoxValue>11</BoxValue>
          </BoxIconAndValue>
        </ReferralBoxLarge>

        <RowContainer>
          <ReferralBoxSquare>
            <SmallBoxTitle>Booked</SmallBoxTitle>
            <BoxIconAndValue>
              <FontAwesome name="check-circle" size={50} color={colors.primary} />
              <SmallBoxValue>2</SmallBoxValue>
            </BoxIconAndValue>
          </ReferralBoxSquare>

          <ReferralBoxSquare>
            <SmallBoxTitle>Pending</SmallBoxTitle>
            <BoxIconAndValue>
              <FontAwesome name="hourglass-half" size={50} color={colors.primary} />
              <SmallBoxValue>4</SmallBoxValue>
            </BoxIconAndValue>
          </ReferralBoxSquare>
        </RowContainer>

        <RowContainer>
          <ReferralBoxSquare>
            <SmallBoxTitle>Closed</SmallBoxTitle>
            <BoxIconAndValue>
              <FontAwesome name="smile-o" size={50} color={colors.primary} />
              <SmallBoxValue>1</SmallBoxValue>
            </BoxIconAndValue>
          </ReferralBoxSquare>

          <ReferralBoxSquare>
            <SmallBoxTitle>Lost</SmallBoxTitle>
            <BoxIconAndValue>
              <FontAwesome name="frown-o" size={50} color={colors.primary} />
              <SmallBoxValue>4</SmallBoxValue>
            </BoxIconAndValue>
          </ReferralBoxSquare>
        </RowContainer>
      </ReferralContainer>
    </ScrollView>
  );
};

export default Dashboard;

// Estilos personalizados
const DashboardTitleContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const DashboardTitle = styled.Text<{ active: boolean }>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props: { active: any; }) => (props.active ? colors.primary : '#ccc')};
  flex: 1;
  text-align: right;
`;

const Separator = styled.Text`
  font-size: 20px;
  color: #ccc;
  padding: 0 10px;
`;

const ReferralsTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #ccc;
  flex: 1;
  text-align: left;
`;

const ReferralContainer = styled.View`
  padding: 20px;
  flex-grow: 1;
`;

const ReferralBoxLarge = styled.View`
  background-color: #f6f6f6;
  padding: 20px;
  margin-bottom: 30px;
  height: 150px;
  border-radius: 30px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const BoxTitle = styled.Text`
  font-size: 18px;
  color: ${colors.primary};
`;

const BoxIconAndValue = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BoxValue = styled.Text`
  font-size: 50px;
  font-weight: bold;
  color: ${colors.primary};
  margin-left: 10px;
`;

const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ReferralBoxSquare = styled.View`
  flex: 1;
  background-color: #f6f6f6;
  padding: 40px;
  margin: 10px;
  border-radius: 20px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const SmallBoxTitle = styled.Text`
  font-size: 18px;
  color: ${colors.primary};
  margin-bottom: 10px;
`;

const SmallBoxValue = styled.Text`
  font-size: 40px;
  font-weight: bold;
  color: ${colors.primary};
  margin-left: 10px;
`;
