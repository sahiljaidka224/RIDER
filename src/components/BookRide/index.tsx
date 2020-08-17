import React, { useEffect, useState, useRef } from "react";
import { View, Dimensions, Button, Text, TouchableOpacity } from "react-native";
import styled from "styled-components";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native-gesture-handler";
import { NavigationProp } from "@react-navigation/native";

interface BookNowProps {
    navigation: NavigationProp<any, any>
}

import { mapStyle } from "../../constants/MapStyle";

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
  border: 2px solid #0a2239;
  backgroundColor: #2f6690;
`;

const CurrentLocation = styled(TouchableOpacity)`
  position: absolute;
  backgroundColor: #2f6690;
  bottom: 75px;
  width: 40px;
  height: 40px;
  right: 20px;
  borderRadius: 20px;
  alignItems: center;
  justifyContent: center;
`;

const TextWrapper = styled(Text)`
  color: #dad2d8;
`;

const WhereToWrapper = styled(TouchableOpacity)`
  position: absolute;
  width: 90%;
  height: 100px;
  backgroundColor: #fbdce2;
  top: 60px;
  flex: 1;
  zIndex: 1;
  borderRadius: 10px;
`;


export const BookNowScreen: React.FC<BookNowProps> = ({navigation}) => {
    const [location, setLocation] = useState<Location.LocationData | null>(
      null
    );
    const mapRef = useRef<MapView>(null);

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
      // const loc = await Location.getCurrentPositionAsync({});
      if (!mapRef || !mapRef.current) return;
      mapRef.current.animateToRegion(
        {
          latitude: location?.coords.latitude ?? 0,
          longitude: location?.coords.longitude ?? 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        500
      );
    };


    const navigateToEnterDestinationScreen = () => {
      console.log(location?.coords.latitude);
      navigation.navigate("EnterDestination", {
        latitude: location?.coords.latitude ?? 0,
        longitude: location?.coords.longitude ?? 0,
      });
    }

    return (
      <AppComponent>
        <WhereToWrapper onPress={navigateToEnterDestinationScreen}>
          <TextInput
            style={{
              height: 40,
            }}
            onChangeText={(text) => {}}
            value={"value"}
          />
        </WhereToWrapper>
        <Wrapper>
          <Map
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
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
};