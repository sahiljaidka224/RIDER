import { Image, TouchableOpacity } from "react-native";

import React from "react";
import styled from "styled-components/native";

interface BackButtonProps {
  onClick: () => void;
  source?: string;
}

const BackButtonWrapper = styled(TouchableOpacity)`
  width: 50px;
  height: 40px;
  align-items: center;
  padding-left: 20px;
  justify-content: center;
`;

const BackButtonImage = styled(Image)`
  width: 14px;
  height: 14px;
`;

export const BackButton: React.FC<BackButtonProps> = ({ onClick, source }) => {
  return (
    <BackButtonWrapper onPress={onClick}>
      <BackButtonImage source={source ? source : require("../../../../assets/BackButton.png")} />
    </BackButtonWrapper>
  );
};
