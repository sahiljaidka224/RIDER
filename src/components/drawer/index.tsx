import { SafeAreaView, Text } from "react-native";

import React from "react";
import styled from "styled-components/native";

const Container = styled(SafeAreaView)`
  flex: 1;
`;

const ImageWrapper = styled.View`
  margin-top: 30px;
  width: 68px;
  height: 68px;
  background-color: red;
  border-radius: 34px;
  margin-left: 25px;
`;

const GreetingsWrapper = styled.Text`
  margin-left: 25px;
  margin-top: 15px;
  font-family: "SFPro-Regular";
  font-size: 35px;
`;

export const DrawerComp = () => {
  return (
    <Container>
      <ImageWrapper />
      <GreetingsWrapper>Hello</GreetingsWrapper>
    </Container>
  );
};
