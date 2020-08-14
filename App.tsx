import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import { View, Dimensions, Button, Text, TouchableOpacity } from "react-native";
import styled from "styled-components";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

const Map = styled(MapView)`
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  flex: 1;
`;

const Wrapper = styled(View)`
  display: flex;
  flex-direction: column;
  justifyContent: center;
  alignItems: center;
`;

const AppComponent = styled(View)`
  flex: 1;
  backgroundColor: #fff;
  alignItems: center;
  justifyContent: center;
`;

const Booknow = styled(TouchableOpacity)`
  position: absolute;
  display: flex;
  alignItems: center;
  justifyContent: center;
  bottom: 75px;
  width: 100px;
  height: 100px;
  borderRadius: 50px;
  border: 2px solid #0A2239;
  backgroundColor: #2F6690;
`;

const CurrentLocation = styled(TouchableOpacity)`
  position: absolute;
  backgroundColor: #2F6690;
  bottom: 75px;
  width: 40px;
  height: 40px;
  right: 20px;
  borderRadius: 20px;
  alignItems: center;
  justifyContent: center;
`;

const TextWrapper = styled(Text)`
  color: #DAD2D8
`;

export default function App() {
  const [location, setLocation] = useState<Location.LocationData | null>(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const moveBackToCurrentLocation = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    if (mapRef) {
      mapRef?.current.animateToRegion({
      latitude: loc?.coords.latitude ?? 0,
      longitude: loc?.coords.longitude ?? 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,}, 500)
    }
    // setLocation(loc);
  };

  return (
    <AppComponent>
      <Wrapper>
        <Map
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          ref={mapRef}
          region={{
            latitude: location?.coords.latitude ?? 0,
            longitude: location?.coords.longitude ?? 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <Booknow>
          <TextWrapper>Book now</TextWrapper>
        </Booknow>
      </Wrapper>
      <CurrentLocation onPress={moveBackToCurrentLocation}> 
        <TextWrapper>+</TextWrapper>
      </CurrentLocation>
      <StatusBar style="auto" />
    </AppComponent>
  );
}
