import * as Location from "expo-location";

import {
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import { Color } from "../../constants/Theme";
import { MenuButton } from "../Common/MenuButton";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { TabletButton } from "../Common/Tablet";
import { mapStyle } from "../../constants/MapStyle";
import styled from "styled-components/native";

interface BookingScreenProps {
  navigation: NavigationProp<any, any>;
}

const BackgroundView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Color.BackgroundView.Background};
`;

const MenuButtonWrapper = styled(View)`
  margin-left: 25px;
  margin-top: 25px;
`;

const Map = styled(MapView)`
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  flex: 1;
  position: absolute;
`;

const WhereToWrapper = styled(View)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 35%;
  background-color: #fafafa;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  display: flex;
`;

const GreetingsText = styled(Text)`
  font-size: 19px;
  font-family: "SFPro-Regular";
  margin-top: 15px;
  margin-left: 18px;
  font-weight: 100;
  margin-bottom: 20px;
  color: ${Color.Text.Normal.Color};
`;

const WhereToTextWrapper = styled(TouchableOpacity)`
  margin: 0 auto;
  background-color: #fff;
  border: 0.5px solid rgba(112, 112, 112, 0.2);
  width: 90%;
  height: 90px;
  border-radius: 20px;
  justify-content: center;
`;

const OptionsWrapper = styled(View)`
  width: 100%;
  height: 60px;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  bottom: 20px;
  position: absolute;
`;

export const BookingScreen: React.FC<BookingScreenProps> = () => {
  const [location, setLocation] = React.useState<Location.LocationData | null>(
    null
  );
  const mapRef = React.useRef<MapView>(null);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  return (
    <BackgroundView>
      <Map
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        showsUserLocation
        ref={mapRef}
        region={{
          latitude: location?.coords.latitude ?? 38.974819,
          longitude: location?.coords.longitude ?? -94.683601,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <MenuButtonWrapper>
        <MenuButton onClick={() => {}} />
      </MenuButtonWrapper>
      <WhereToWrapper>
        <GreetingsText>Good afternoon</GreetingsText>
        <WhereToTextWrapper
          style={{
            shadowColor: `${Color.Shadow.Color}`,
            shadowOpacity: 0.05,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 4,
          }}
        >
          <GreetingsText>Where to?</GreetingsText>
        </WhereToTextWrapper>
        <OptionsWrapper>
          <TabletButton
            optionText="Trips"
            onClick={() => {}}
            selected={true}
            imageSource={require("../../../assets/SelectedOptionTrips.png")}
          />
          <TabletButton
            optionText="Eats"
            onClick={() => {}}
            selected={false}
            imageSource={require("../../../assets/UnselectedOptionEats.png")}
          />
        </OptionsWrapper>
      </WhereToWrapper>
    </BackgroundView>
  );
};
