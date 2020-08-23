import { Button, Text, TextInput, View } from 'react-native';

import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

interface SignUpProps {
    navigation: NavigationProp<any, any>
}

const GET_DRIVERS = gql`
  query GetAlldrivers {
    getAllDrivers {
      email
      password
      rating
      distance
      isOnline
    }
  }
`;

export const SignUp: React.FC<SignUpProps> = ({navigation}) => {
    const [value, onChangeText] = React.useState("Useless Placeholder");

    const { loading, error, data } = useQuery(GET_DRIVERS);

    if (loading) return <Text> Loading</Text>;

    if (error) return <Text style={{ marginTop: 120}}>{error.message}</Text>;
  
    return (
      <View>
        <TextInput
          style={{
            marginTop: 100,
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
          }}
          onChangeText={(text) => onChangeText(text)}
          value={value}
        />
        <Button title="123" onPress={() => navigation.navigate("BookNow")} />
      </View>
    );
}