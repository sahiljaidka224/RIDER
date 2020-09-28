import { Color } from "../../../constants/Theme";
import { Feather } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";

type DetailsInfoProps = {
  label: string;
  value: string;
  navigation: NavigationProp<any, any>;
  disabled?: boolean;
};

const BackgroundView = styled.TouchableOpacity`
  width: 100%;
  height: auto;
  min-height: 60px;
  padding: 15px;
  border-bottom-width: 0.6px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TextContainer = styled.View``;

const Label = styled.Text<{
  size?: number;
  color?: string;
  marginBottom?: boolean;
}>`
  font-size: ${({ size }) => (size ? size : "16")}px;
  line-height: ${({ size }) => (size ? size : "16")}px;
  font-family: "SFPro-Regular";
  color: ${({ color }) => (color ? color : "#777777")};
  margin-bottom: ${({ marginBottom }) => (marginBottom ? "10px" : "0")};
`;

export const DetailInfo: React.FC<DetailsInfoProps> = ({
  label,
  value,
  navigation,
  disabled,
}) => {
  const onPress = () => {
    navigation.navigate("EditFieldScreen", {
      value: value,
      label: label,
    });
  };
  return (
    <BackgroundView onPress={onPress} disabled={disabled}>
      <TextContainer>
        <Label marginBottom>{label}</Label>
        <Label size={20} color={Color.Text.Normal.Color}>
          {value}
        </Label>
      </TextContainer>
      {!disabled && (
        <Feather name="edit-2" color={Color.Button.Background} size={19} />
      )}
    </BackgroundView>
  );
};
