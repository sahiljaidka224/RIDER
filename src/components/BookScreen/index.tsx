import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import {
  BOOKING_MUTATION,
  GET_BOOKING_INPROGRESS,
  GET_NEARBY_DRIVERS,
  UPDATE_EXPO_PUSHTOKEN,
} from "./queriesAndMutations";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import React, { useRef, useState } from "react";

import { BookingView } from "./components/booking-view";
import { Color } from "../../constants/Theme";
import { GET_TRIPPRICE_BASEDON_LOCATION } from "../enter-destination/queriesAndMutations";
import { Icons } from "../../constants/icons";
import { InitalView } from "./components/initial-view";
import { LocationAccuracy } from "expo-location";
import { MenuButton } from "../Common/MenuButton";
import { NavigationProp } from "@react-navigation/native";
import { Point } from "react-native-google-places-autocomplete";
import { RoutesView } from "./components/routes-view";
import { ScreenState } from "../../../overmind/state";
import { StatusBar } from "expo-status-bar";
import { getAddressFromLatLong } from "../../utils/address-based-on-latlng";
import { getPolyline } from "../../utils/polyline";
import { getReadableAddress } from "../../utils/get-readable-address";
import { mapStyle } from "../../constants/MapStyle";
import styled from "styled-components/native";
import { useOvermind } from "../../../overmind";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

interface BookingScreenProps {
  navigation: NavigationProp<any, any>;
}

type Subscription = {
  remove: () => void;
};

export type Coords = { latitude: number; longitude: number };

const BackgroundView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Color.BackgroundView.Background};
`;

const MenuButtonWrapper = styled.View`
  margin-left: 25px;
  margin-top: 25px;
`;

const Map = styled(MapView)`
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  position: absolute;
`;

const WhereToWrapper = styled.View`
  position: absolute;
  bottom: 0;
  min-width: 90%;
  height: auto;
  background-color: #fafafa;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  display: flex;
  left: 10px;
  right: 10px;

  box-shadow: 0px -20px 20px rgba(0, 0, 0, 0.051);
  /* TODO: above */
`;

const MarkerDot = styled.View`
  background-color: #2ecb70;
  width: 18px;
  height: 18px;
  border-radius: 9px;
`;

const MarkerCar = styled.Image`
  width: 40px;
  height: 40px;
`;

const DestinationMarkerWrapper = styled(TouchableOpacity)`
  width: 164px;
  height: 48px;
  padding: 5px;
  max-width: 164px;
  max-height: 48px;
  align-items: center;
  justify-content: center;
  display: flex;
  background-color: #0e1823;
  border-radius: 20px;
  flex-direction: row;
`;

const DestMarkerImage = styled.Image`
  width: 43px;
  height: 43px;
  margin-left: 6px;
`;

const DestMarkerText = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  font-family: "SFPro-Regular";
  color: #fff;
  flex: 1;
  margin-left: 3px;
`;

const EditDest = styled.Image`
  width: 13px;
  height: 16px;
  margin-left: 3px;
  margin-right: 3px;
`;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const BookingScreen: React.FC<BookingScreenProps> = ({ navigation }) => {
  const { state, actions } = useOvermind();
  const { source, destination, bookingScreenState } = state;
  const [bookingInProg, updateBookingInProgress] = useState<boolean>(false);

  const [coords, updateCoords] = useState<[Coords]>();
  const mapRef = useRef<MapView>(null);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const { data: bookingInProgData } = useQuery(GET_BOOKING_INPROGRESS, {
    onCompleted: (completedData) => {
      if (completedData && completedData.getBookingInProgress) {
        // const { status, sourceLatLng, destLatLng, source, destAddress } =
        completedData.getBookingInProgress;
        updateBookingInProgress(true);
      }
    },
  });

  const [getDrivers, { data }] = useLazyQuery(GET_NEARBY_DRIVERS, {
    pollInterval: 60000,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const [getTripPrice, { loading: tripPriceLoading, data: tripPriceData }] =
    useLazyQuery(GET_TRIPPRICE_BASEDON_LOCATION, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    });

  const [requestBooking, { loading: bookingLoading, data: bookingReqData }] =
    useMutation(BOOKING_MUTATION, {
      onCompleted: () => {
        actions.updateBookingScreenState(ScreenState.SEARCHING);
        updateBookingInProgress(true);
      },
    });

  const [updateExpoPushToken] = useMutation(UPDATE_EXPO_PUSHTOKEN);

  const updateRoute = (coordinates: [Coords] | undefined) => {
    updateCoords(coordinates);
  };

  const getPushNotificationsPermissions = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.getPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert(
        "Please allow notification permissions from settings in order to take full advantage of the app."
      );
      return;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync();

    if (pushToken) {
      updateExpoPushToken({
        variables: {
          pushToken: pushToken.data,
          userType: "user",
        },
      });
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  const getLocationPermissions = async () => {
    const { status: existingStatus } =
      await Location.requestForegroundPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Location.requestForegroundPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert(
        "Please allow location permissions from settings in order to take full advantage of the app."
      );
      return;
    }

    await Location.getCurrentPositionAsync({
      accuracy: LocationAccuracy.Highest,
    }).then((locationData) => {
      if (mapRef && mapRef.current && locationData) {
        mapRef.current?.animateToRegion({
          latitude: locationData.coords.latitude ?? 0,
          longitude: locationData.coords.longitude ?? 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
      if (!bookingInProg && !bookingReqData) {
        getDrivers({
          variables: {
            cords: [
              locationData.coords.longitude,
              locationData.coords.latitude,
            ],
          },
        });
      }

      async function getAddress() {
        const address = await getAddressFromLatLong(
          locationData.coords.latitude,
          locationData.coords.longitude
        );

        if (address && address.results && address.results.length > 0) {
          const results = address.results[0];

          if (!results) return;

          let result = results.formatted_address;

          const location: Point =
            results.geometry && results.geometry.location
              ? results.geometry.location
              : undefined;

          actions.updateSource({ readable: result, location });
        }
      }

      if (!source) getAddress();
    });
  };

  React.useEffect(() => {
    getLocationPermissions();
    getPushNotificationsPermissions();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log({ notification });
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log({ response });
      });
    async function showPolyline() {
      if (!source?.location || !destination?.location) return;
      const coordinates = await getPolyline(
        source?.location,
        destination?.location
      );

      updateCoords(coordinates);
      actions.updateBookingScreenState(ScreenState.ROUTES);

      if (mapRef && coordinates && coordinates.length > 1) {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 80,
            right: 80,
            bottom: 350,
            left: 100,
          },
          animated: true,
        });
      }
      getTripPriceFromDb();
    }

    if (source && destination) showPolyline();

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [source, destination]);

  const getTripPriceFromDb = () => {
    if (!source || !destination) return;

    if (!source.location || !source.location.lat || !source.location.lng)
      return;

    if (
      !destination.location ||
      !destination.location.lat ||
      !destination.location.lng
    ) {
      return;
    }
    //TODO: show error;
    getTripPrice({
      variables: {
        sourceLat: source.location.lat,
        sourceLng: source.location.lng,
        destinationLat: destination.location.lat,
        destinationLng: destination.location.lng,
      },
    });
  };

  const onCancel = () => {
    updateCoords(undefined);
    actions.updateBookingScreenState(ScreenState.INITIAL);
    actions.updateDestination(undefined);

    if (mapRef && mapRef.current && source) {
      mapRef.current?.animateToRegion({
        latitude: source.location.lat ?? 0,
        longitude: source.location.lng ?? 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <BackgroundView>
      <Map
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        showsUserLocation={true}
        ref={mapRef}
        zoomEnabled={true}
      >
        {(bookingScreenState === ScreenState.INITIAL ||
          bookingScreenState === ScreenState.ROUTES) &&
          data &&
          data.findNearByDrivers &&
          data.findNearByDrivers.map((driver) => (
            <Marker
              key={driver._id}
              coordinate={{
                latitude: driver?.location[1] ?? 0,
                longitude: driver?.location[0] ?? 0,
              }}
            >
              <MarkerCar
                key={`marker-${driver._id}`}
                source={require("../../../assets/MarkerCar.png")}
                resizeMode="contain"
              />
            </Marker>
          ))}
        {(bookingScreenState === ScreenState.ROUTES ||
          bookingScreenState === ScreenState.DRIVER_ASSIGNED) &&
          coords &&
          coords.length > 1 &&
          coords.map((coord, index) => {
            if (index === 0) {
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

            if (index === coords.length - 1) {
              if (bookingScreenState === ScreenState.DRIVER_ASSIGNED) {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: coord.latitude ?? 0,
                      longitude: coord?.longitude ?? 0,
                    }}
                  >
                    <MarkerCar
                      key={`marker-${index}`}
                      source={require("../../../assets/MarkerCar.png")}
                      resizeMode="contain"
                    />
                  </Marker>
                );
              }
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: coord.latitude ?? 0,
                    longitude: coord?.longitude ?? 0,
                  }}
                  onPress={() => navigation.navigate("EnterDestination")}
                >
                  <DestinationMarkerWrapper
                    onPress={() => navigation.navigate("EnterDestination")}
                  >
                    <DestMarkerImage
                      source={Icons.destCar}
                      resizeMode="contain"
                    />
                    <DestMarkerText>
                      {getReadableAddress(destination?.readable ?? "")}
                    </DestMarkerText>
                    <EditDest source={Icons.edit} resizeMode="contain" />
                  </DestinationMarkerWrapper>
                </Marker>
              );
            }
          })}
        {(bookingScreenState === ScreenState.ROUTES ||
          bookingScreenState === ScreenState.DRIVER_ASSIGNED) &&
          coords &&
          coords.length > 1 && (
            <Polyline
              key={Math.random()}
              strokeWidth={4}
              strokeColor="#2ECB70"
              coordinates={coords ? coords : []}
            />
          )}
      </Map>
      <MenuButtonWrapper>
        {coords && bookingScreenState === ScreenState.ROUTES ? (
          <MenuButton
            onClick={onCancel}
            source={Icons.cross}
            isLoading={tripPriceLoading}
          />
        ) : (
          <MenuButton
            onClick={() => navigation.openDrawer()}
            source={Icons.drawer}
            isLoading={tripPriceLoading || bookingLoading}
          />
        )}
      </MenuButtonWrapper>
      <WhereToWrapper>
        {!coords && ScreenState.INITIAL === bookingScreenState && (
          <InitalView navigation={navigation} />
        )}
        {bookingScreenState === ScreenState.ROUTES &&
          coords &&
          tripPriceData &&
          tripPriceData.getTripPriceBasedOnLatLng && (
            <RoutesView
              key={Math.random()}
              distance={tripPriceData.getTripPriceBasedOnLatLng.distance ?? 0}
              duration={tripPriceData.getTripPriceBasedOnLatLng.duration ?? 0}
              options={
                tripPriceData.getTripPriceBasedOnLatLng.fare ?? undefined
              }
              isBookingActive={
                tripPriceData.getTripPriceBasedOnLatLng.isBookingActive ?? false
              }
              requestBooking={requestBooking}
              requestBookingLoading={bookingLoading}
            />
          )}
        {bookingReqData &&
          bookingReqData.createBooking &&
          bookingReqData.createBooking.id &&
          bookingInProg && (
            <BookingView
              bookingId={bookingReqData.createBooking.id}
              updateRoute={updateRoute}
            />
          )}
        {bookingInProgData &&
          bookingInProgData.createBooking &&
          bookingReqData.createBooking.id &&
          bookingInProg && (
            <BookingView
              bookingId={bookingReqData.createBooking.id}
              updateRoute={updateRoute}
            />
          )}
      </WhereToWrapper>
      <StatusBar style="dark" />
    </BackgroundView>
  );
};
