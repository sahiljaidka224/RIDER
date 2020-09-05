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
import { BackButton } from "../Common/BackButton";
import { Color } from "../../constants/Theme";
import { GET_NEARBY_DRIVERS } from "./queriesAndMutations";
import { GET_TRIPPRICE_BASEDON_LOCATION } from "../enter-destination/queriesAndMutations";
import { Icons } from "../../constants/icons";
import { MenuButton } from "../Common/MenuButton";
import { Point } from "react-native-google-places-autocomplete";
import { RideView } from "../ride-type";
import { TabletButton } from "../Common/Tablet";
import { getAddressFromLatLong } from "../../utils/address-based-on-latlng";
import { greetingsBasedOnTime } from "../../utils/GreetingsBasedOnCurrentTime";
import { mapStyle } from "../../constants/MapStyle";
import polyline from "@mapbox/polyline";
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
  min-width: 90%;
  height: auto;
  background-color: #ececec;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  display: flex;
  left: 10px;
  right: 10px;
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

const MarkerDot = styled(View)`
  background-color: #2ecb70;
  width: 18px;
  height: 18px;
  border-radius: 9px;
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

  const [
    getTripPrice,
    { loading: tripPriceLoading, error: tripPriceErr, data: tripPriceData },
  ] = useLazyQuery(GET_TRIPPRICE_BASEDON_LOCATION, {
    onCompleted: (completedData) => {
      console.log({ completedData });
    },
  });

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
        `https://maps.googleapis.com/maps/api/directions/json?origin=${source?.location.lat},${source?.location.lng}&destination=${destination?.location.lat},${destination?.location.lng}&mode=driving&key=AIzaSyDDGCRsdawsguNpqCvTI-zlgCBDz2H8zVY`
      );

      if (!directions || !directions.data) return;

      const directionsData = directions.data;

      if (!directionsData.routes || directionsData.routes.length === 0) return;

      const routes = directionsData.routes[0];

      const points = polyline.decode(routes.overview_polyline.points);
      const coordinates = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });

      updateCoords(coordinates);

      if (mapRef && coordinates && coordinates.length > 1) {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 20,
            right: 20,
            bottom: 250,
            left: 20,
          },
          animated: true,
        });
      }
      getTripPriceFromDb();
    }

    if (source && destination) showPolyline();
  }, [source, destination]);

  const moveToEnterDestinationScreen = () => {
    navigation.navigate("EnterDestination");
  };

  const getTripPriceFromDb = () => {
    if (!source || !destination) return console.log("No source or dest");

    if (!source.location || !source.location.lat || !source.location.lng)
      return console.log("No source data");

    if (
      !destination.location ||
      !destination.location.lat ||
      !destination.location.lng
    )
      return console.log("No dest data");
    //TODO: show error;
    console.log("here");
    getTripPrice({
      variables: {
        sourceLat: source.location.lat,
        sourceLng: source.location.lng,
        destinationLat: destination.location.lat,
        destinationLng: destination.location.lng,
      },
    });
  };

  console.log({ coords });

  const onCancel = () => {
    updateCoords(undefined);
    actions.updateDestination(undefined);
  };

  return (
    <BackgroundView>
      <Map
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        showsUserLocation={true}
        ref={mapRef}
        zoomEnabled={true}
        // region={{
        //   latitude: source?.location.lat ?? 0,
        //   longitude: source?.location.lng ?? 0,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
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
        {coords &&
          coords.length > 1 &&
          coords.map((coord, index) => {
            if (index === 0 || index === coords.length - 1) {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: coord.latitude ?? 0,
                    longitude: coord?.longitude ?? 0,
                  }}
                >
                  <MarkerDot />
                </Marker>
              );
            }
          })}
        {coords && coords.length > 1 && (
          <Polyline
            strokeWidth={4}
            strokeColor="#2ECB70"
            coordinates={coords ? coords : []}
          />
        )}
      </Map>
      <MenuButtonWrapper>
        {coords ? (
          <MenuButton onClick={onCancel} source={Icons.cross} />
        ) : (
          <MenuButton
            onClick={() => navigation.openDrawer()}
            source={Icons.drawer}
          />
        )}
      </MenuButtonWrapper>
      <WhereToWrapper>
        {coords &&
          tripPriceData &&
          tripPriceData.getTripPriceBasedOnLatLng &&
          tripPriceData.getTripPriceBasedOnLatLng.fare &&
          tripPriceData.getTripPriceBasedOnLatLng.fare.map((fr, index: number) => (
            <RideView
              key={index}
              heading={fr.type}
              description="Affordable rides, all to yourself"
              fare={fr.price}
            />
          ))}

        {!tripPriceData && !coords && (
          <>
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
          </>
        )}
      </WhereToWrapper>
    </BackgroundView>
  );
};
