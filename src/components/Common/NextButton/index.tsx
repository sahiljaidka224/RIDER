import { Image, TouchableOpacity } from "react-native";

import React from "react";
import styled from "styled-components/native";

interface NextButtonProps {
  onClick: () => void;
}

const NextButtonWrapper = styled(TouchableOpacity)`
  width: 61px;
  height: 61px;
  border-radius: 30.5px;
  align-items: center;
  justify-content: center;
  background-color: #2ecb70;
`;

const NextButtonImage = styled(Image)`
  width: 14px;
  height: 14px;
`;

export const NextButton: React.FC<NextButtonProps> = ({ onClick }) => {
  return (
    <NextButtonWrapper>
      <NextButtonImage source={require("../../../../assets/ArrowLeft.png")} />
    </NextButtonWrapper>
  );
};
