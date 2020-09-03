import * as Location from "expo-location";

import {
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { NavigationProp, useIsFocused } from "@react-navigation/native";
import React, { useState } from "react";

import { AddressData } from "../enter-destination";
import Axios from "axios";
import { Color } from "../../constants/Theme";
import { GET_NEARBY_DRIVERS } from "./queriesAndMutations";
import { MenuButton } from "../Common/MenuButton";
import { Point } from "react-native-google-places-autocomplete";
import { TabletButton } from "../Common/Tablet";
import { getAddressFromLatLong } from "../../utils/address-based-on-latlng";
import { greetingsBasedOnTime } from "../../utils/GreetingsBasedOnCurrentTime";
import { map } from "lodash";
import { mapStyle } from "../../constants/MapStyle";
import styled from "styled-components/native";
import { useLazyQuery } from "@apollo/react-hooks";
import { useOvermind } from "../../../overmind";

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
  min-height: 35%;
  height: auto;
  background-color: #f9f9f9;
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
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const BookingScreen: React.FC<BookingScreenProps> = ({ navigation }) => {
  const isFocused = useIsFocused(); // FIXME: find a better way of doing this

  const { state, actions } = useOvermind();
  const { source, destination } = state;

  const [coords, updateCoords] = useState<
    [{ latitude: number; longitude: number }]
  >();
  const mapRef = React.useRef<MapView>(null);

  const [getDrivers, { loading, data, error }] = useLazyQuery(
    GET_NEARBY_DRIVERS,
    {
      pollInterval: 40000,
    }
  );

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }
      await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      }).then((locationData) => {
        getDrivers({
          variables: {
            cords: [
              locationData.coords.longitude,
              locationData.coords.latitude,
            ],
          },
        });

        async function getAddress() {
          const address = await getAddressFromLatLong(
            locationData.coords.latitude,
            locationData.coords.longitude
          );

          if (address && address.results && address.results.length > 0) {
            const results = address.results[0];

            if (!results) return;

            let result = results.formatted_address;
            let readableAddress = "";
            const location: Point =
              results.geometry && results.geometry.location
                ? results.geometry.location
                : undefined;

            if (result) {
              result = result.split(",");

              if (result.length > 0) {
                readableAddress = result[0];
              }
            }

            actions.updateSource({ readable: readableAddress, location });
          }
        }

        if (!source) getAddress();
      });
    })();

    async function showPolyline() {
      const directions = await Axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${source?.location.lat},${source?.location.lng}&destination=${destination.location.lat},${destination?.location.lng}&mode=driving&key=AIzaSyDDGCRsdawsguNpqCvTI-zlgCBDz2H8zVY`
      );

      if (!directions || !directions.data) return;

      const directionsData = directions.data;

      if (!directionsData.routes || directionsData.routes.length === 0) return;

      const routes = directionsData.routes[0];

      console.log({directionsData})

      if (!routes.legs) return;

      const legs = routes.legs;

      if (legs.length === 0 || !legs[0].steps) return;

      const coordinates = [];

      const startLoc = legs[0].start_location;

      if(startLoc) {
          coordinates.push({ longitude: startLoc.lng, latitude: startLoc.lat });
      }

      const steps = legs[0].steps;

      if (steps.length > 0) {
        map(steps, (step) => {
            const endLoc= step.end_location;
            coordinates.push({ longitude: endLoc.lng, latitude: endLoc.lat });
        });
      }

      updateCoords(coordinates);



    }

    if (source && destination) showPolyline();
  }, [source, destination]);

  const moveToEnterDestinationScreen = () => {
    navigation.navigate("EnterDestination");
  };

  console.log({coords})

  return (
    <BackgroundView>
      <Map
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        showsUserLocation
        ref={mapRef}
        region={{
          latitude: source?.location.lat ?? 0,
          longitude: source?.location.lng ?? 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {data &&
          data.findNearByDrivers &&
          data.findNearByDrivers.map((driver) => (
            <Marker
              key={driver._id}
              coordinate={{
                latitude: driver?.location[1] ?? 0,
                longitude: driver?.location[0] ?? 0,
              }}
              icon={require("../../../assets/MarkerCar.png")}
              rotation={-37}
            />
          ))}

        <Polyline
          strokeWidth={4}
          strokeColor="#2ECB70"
          coordinates={coords ? coords : []}
        />
      </Map>
      <MenuButtonWrapper>
        <MenuButton onClick={() => {}} />
      </MenuButtonWrapper>
      <WhereToWrapper>
        <GreetingsText>{greetingsBasedOnTime()}</GreetingsText>
        <WhereToTextWrapper
          onPress={moveToEnterDestinationScreen}
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
          {source && source.readable && source.readable.length > 0 && (
            <GreetingsText>{source.readable}</GreetingsText>
          )}
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
