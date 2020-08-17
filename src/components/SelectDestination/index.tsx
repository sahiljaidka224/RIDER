import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { NavigationProp, RouteProp } from '@react-navigation/native';


interface EnterDestinationProps  {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const Wrapper = styled(View)`
  position: absolute;
  width: 100%;
  height: 100%;
  backgroundColor: white;
  top: 5%;
  flex: 1;
  borderRadius: 10px;
`; 

export const EnterDestination: React.FC<EnterDestinationProps> = ({navigation, route}) => {
  
  const {latitude, longitude} = route.params;

  console.log({ latitude, longitude });
  const getAddressFromLatLong = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDDGCRsdawsguNpqCvTI-zlgCBDz2H8zVY&language=en`
    )
      .then((response) => response.json())
      .then((json) => {
        console.log({ json });
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getAddressFromLatLong();

    return (
      <Wrapper>
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          query={{
            key: "AIzaSyDDGCRsdawsguNpqCvTI-zlgCBDz2H8zVY",
            language: "en",
          }}
          listViewDisplayed="auto"
          autoFocus
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
        />
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          query={{
            key: "AIzaSyDDGCRsdawsguNpqCvTI-zlgCBDz2H8zVY",
            language: "en",
          }}
          autoFocus
        />
      </Wrapper>
    );
};