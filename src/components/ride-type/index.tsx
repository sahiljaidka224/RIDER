import { Text, View } from "react-native";

import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";

interface RideTypeProps {
  heading: String;
  fare: String;
  description?: String;
}

const BackgroundView = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  width: 100%;
  height: 110px;
  padding: 20px;
`;

const CarWrapper = styled(View)`
  height: 85px;
  width: 90px;
  border-radius: 20px;
  background-color: #f3f3f3;
`;

const TextWrapper = styled(View)`
  align-items: flex-start;
  justify-content: center;
  margin-left: 10px;
  flex: 2;
`;

const HeadingText = styled(Text)`
  font-size: 22px;
  font-family: "SFPro-Regular";
`;

const DescText = styled(Text)`
  font-size: 16px;
  font-family: "SFPro-Regular";
`;

const Fare = styled(Text)`
  font-size: 20px;
  font-family: "SFPro-Regular";
`;

export const RideView = () => {
  return (
    <BackgroundView>
      <CarWrapper />
      <TextWrapper>
        <HeadingText>1</HeadingText>
        <DescText>2</DescText>
      </TextWrapper>
      <Fare>2222222</Fare>
    </BackgroundView>
  );
};
