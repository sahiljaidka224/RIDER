import * as Location from "expo-location";

import {
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";

import { AddressData } from "../enter-destination";
import { Color } from "../../constants/Theme";
import { GET_NEARBY_DRIVERS } from "./queriesAndMutations";
import { MenuButton } from "../Common/MenuButton";
import { NavigationProp } from "@react-navigation/native";
import { Point } from "react-native-google-places-autocomplete";
import React from "react";
import { TabletButton } from "../Common/Tablet";
import { getAddressFromLatLong } from "../../utils/address-based-on-latlng";
import { greetingsBasedOnTime } from "../../utils/GreetingsBasedOnCurrentTime";
import { mapStyle } from "../../constants/MapStyle";
import styled from "styled-components/native";
import { useLazyQuery } from "@apollo/react-hooks";

interface BookingScreenProps {
  navigation: NavigationProp<any, any>;
}

interface State {
  source: AddressData | undefined;
  destination: AddressData | undefined;
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
  const [address, updateAddress] = React.useState<State>({
    source: undefined,
    destination: undefined,
  });
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

          console.log({ address });
          if (address && address.results && address.results.length > 0) {
            const results = address.results[0];

            if (!results) return;

            console.log({ results });

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

            updateAddress({
              destination: address?.destination,
              source: {
                readable: readableAddress,
                location: location,
              },
            });
          }
        }
        getAddress();
      });
    })();
  }, []);

  const updateSourceAddress = (data: AddressData) => {
    console.log("here");
    updateAddress({ destination: address?.destination, source: data });
  };

  const updateDestinationAddress = (data: AddressData) => {
    console.log("here");

    updateAddress({ source: address?.source, destination: data });
  };

  const moveToEnterDestinationScreen = () => {
    navigation.navigate("EnterDestination", {
      address: address,
      updateSourceAddress: (data: AddressData) => updateSourceAddress(data),
      updateDestinationAddress: (data: AddressData) =>
        updateDestinationAddress(data),
    });
  };

  const { source, destination } = address;
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
          coordinates={[
            { longitude: 145.0950765, latitude: -37.8535385 },
            {
              longitude: 145.0951108,
              latitude: -37.8533495,
            },
            {
              longitude: 145.1189277,
              latitude: -37.8560828,
            },
            {
              longitude: 145.1256179,
              latitude: -37.8568823,
            },
            {
              longitude: 145.1246127,
              latitude: -37.8624482,
            },
            {
              longitude: 145.12231,
              latitude: -37.8621641,
            },
          ]}
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
