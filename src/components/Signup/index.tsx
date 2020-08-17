import React from 'react';
import { View, TextInput, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface SignUpProps {
    navigation: NavigationProp<any, any>
}

export const SignUp: React.FC<SignUpProps> = ({navigation}) => {
    const [value, onChangeText] = React.useState("Useless Placeholder");

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