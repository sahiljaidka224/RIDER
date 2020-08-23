import { Image, Text, TouchableOpacity, View } from 'react-native';

import { NavigationProp } from "@react-navigation/native";
import React from 'react';
import styled from 'styled-components/native';

interface EntryScreenProps {
    navigation: NavigationProp<any, any>
}

const BackgroundView = styled(View)`
  background-color: #ffffff;
  display: flex;
  flex: 1;
  align-items: center;
`;

const ImageWrapper = styled(View)`
  width: 100%;
  height: 60%;
  align-items: center;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
`;

const WelcomeWrapper = styled(View)`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  margin-top: 10px;
`;

const NameWrapper = styled(Image)`
`;

const ImageView = styled(Image)`
    flex: 1;
    width: 80%;
`;

const WelcomeTo = styled(Text)`
  color: #0e1823;
  font-family: "SFPro-Regular";
  margin-right: 10px;
  font-size: 32px;
`;

const HorizontalLine = styled(View)`
  height: 1.5px;
  background-color: #eeeeee;
  width: 90%;
`;

const PhoneWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  margin-left: 40px;
  width: 100%;
  margin-top: 5px;
  align-items: center;
`;

const CountryCode = styled(Text)`
  font-family: "SFPro-Regular";
  font-size: 26px;
  color: #000000;
`;

const PhoneNumberClickable = styled(TouchableOpacity)`

`;

const PhoneNumber = styled(Text)`
  font-family: "SFPro-Regular";
  font-size: 20px;
  color: #000000;
  opacity: 0.5;
  margin-left: 10px;
`;

const SocialMediaWrapper = styled(View)`
  flex: 1;
  justify-content: center;
`;

const SocialMediaText = styled(Text)`
  color: #2ecb70;
  font-size: 17px;
  font-family: "SFPro-Regular";
`;

export const EntryScreen: React.FC<EntryScreenProps> = ({navigation}) => {
    const onPhoneNumberClick = () => {
        navigation.navigate("");
    }
         return (
           <BackgroundView>
             <ImageWrapper>
               <ImageView
                 source={require("../../../assets/WelcomeScreen.png")}
                 resizeMode="contain"
               />
             </ImageWrapper>
             <WelcomeWrapper>
               <WelcomeTo>Welcome to</WelcomeTo>
               <NameWrapper
                 source={require("../../../assets/RidoLogo.png")}
                 resizeMode="contain"
               />
             </WelcomeWrapper>
             <PhoneWrapper>
               <CountryCode>+61</CountryCode>
               <PhoneNumberClickable onPress={() => {}}>
                 <PhoneNumber>123456789</PhoneNumber>
               </PhoneNumberClickable>
             </PhoneWrapper>

             <HorizontalLine />
             <SocialMediaWrapper>
               <SocialMediaText>
                 By signing up you agree to our privacy policy
               </SocialMediaText>
             </SocialMediaWrapper>
           </BackgroundView>
         );
       };