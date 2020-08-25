import { Image, TouchableOpacity } from "react-native";

import { Color } from "../../../constants/Theme";
import React from "react";
import styled from "styled-components/native";

interface MenuButtonProps {
  onClick: () => void;
}

const BackgroundView = styled(TouchableOpacity)`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  background-color: ${Color.MenuButton.Background};
  align-items: center;
  justify-content: center;
`;
const ImageWrapper = styled(Image)`
  max-width: 22px;
  max-height: 30px;
`;

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
  const onMenuButtonClick = () => {
    if (onClick) onClick();
  };
  return (
    <BackgroundView
      onPress={onMenuButtonClick}
      style={{
        shadowColor: `${Color.Shadow.Color}`,
        shadowOpacity: 0.2,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 5,
      }}
    >
      <ImageWrapper
        source={require("../../../../assets/MenuIcon.png")}
        resizeMode="center"
      />
    </BackgroundView>
  );
};
