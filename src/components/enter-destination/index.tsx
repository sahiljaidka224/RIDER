import { ActivityIndicator, Animated, Easing, View } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import { AddressAutocomplete } from "../google-places-autocomplete";
import { BackButton } from "../Common/BackButton";
import { Point } from "react-native-google-places-autocomplete";
import React from "react";
import styled from "styled-components/native";
import { useOvermind } from "../../../overmind";

interface EnterDestinationProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
}

export interface AddressData {
  readable: string;
  location: Point;
}

const Wrapper = styled(View)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  top: 5%;
  flex: 1;
  border-radius: 10px;
`;

const BackButtonWrapper = styled(Animated.View)`
  margin-top: 25px;
  margin-left: 10px;
  width: 50px;
`;

const DestinationViewWrapper = styled(View)`
  width: 100%;
  height: 17%;
  display: flex;
  flex-direction: row;
`;

const DesignWrapper = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const VerticalLine = styled(View)`
  border: 0.5px dashed black;
  height: 48px;
`;

const CircleView = styled(View)<{ widthHeight: number }>`
  width: ${(props) => (props.widthHeight ? `${props.widthHeight}px` : "10px")};
  height: ${(props) => (props.widthHeight ? `${props.widthHeight}px` : "10px")};
  border-radius: ${(props) =>
    props.widthHeight ? `${props.widthHeight / 2}px` : "5px"};
  background-color: black;
`;

const TextViewWrapper = styled.View`
  flex: 5;
  justify-content: center;
`;

export const EnterDestinationScreen: React.FC<EnterDestinationProps> = ({
  navigation,
  route,
}) => {
  const { state, actions } = useOvermind();
  const { source, destination } = state;

  const [rotateAnim, updateRotateAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (source && destination) {
    }
  }, [source, destination]);

  const onBackButton = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const updateSourceAdd = (data: AddressData) => {
    actions.updateSource(data);

    if (destination) onBackButton();
  };

  const updateDestinationAdd = (data: AddressData) => {
    actions.updateDestination(data);
    onBackButton();
  };

  Animated.timing(rotateAnim, {
    toValue: 1,
    duration: 1500,
    easing: Easing.bounce,
    useNativeDriver: true,
  }).start();

  return (
    <Wrapper>
      <BackButtonWrapper
        style={{
          transform: [
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "270deg"],
              }),
            },
          ],
        }}
      >
        <BackButton onClick={onBackButton} />
      </BackButtonWrapper>
      <DestinationViewWrapper>
        <DesignWrapper>
          <CircleView widthHeight={18} />
          <VerticalLine />
          <CircleView widthHeight={10} />
        </DesignWrapper>
        <TextViewWrapper>
          <AddressAutocomplete
            key="1"
            address={source && source.readable ? source.readable : ""}
            placeholder="Current Location"
            updateAddress={updateSourceAdd}
            margin
          />
          <AddressAutocomplete
            key="2"
            address={
              destination && destination.readable ? destination.readable : ""
            }
            placeholder="Where to?"
            autoFocus={!destination}
            updateAddress={updateDestinationAdd}
          />
        </TextViewWrapper>
      </DestinationViewWrapper>
    </Wrapper>
  );
};
