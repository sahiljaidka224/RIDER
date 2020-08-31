import { NavigationProp, RouteProp } from '@react-navigation/native';

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';

interface EnterDestinationProps  {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
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

export const EnterDestination: React.FC<EnterDestinationProps> = ({navigation, route}) => {
  
  const {latitude, longitude} = route.params;

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