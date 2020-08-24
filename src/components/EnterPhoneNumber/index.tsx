import {
  CountryCode,
  FlagWrapper,
  HorizontalLine,
  PhoneWrapper,
} from "../EntryPoint";
import { SafeAreaView, Text, TextInput, View } from "react-native";

import { BackButton } from "../Common/BackButton/index";
import { NavigationProp } from "@react-navigation/native";
import { NextButton } from "../Common/NextButton";
import React from "react";
import styled from "styled-components/native";

interface EnterPhoneNumberProps {
  navigation: NavigationProp<any, any>;
}

const SafeAreaWrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
  display: flex;
`;

const EnterMobileNumberText = styled(Text)`
  font-size: 21px;
  color: #0e1823;
  font-family: "SFPro-Regular";
  margin-left: 30px;
  margin-top: 30px;
`;

const PhoneNumberInput = styled(TextInput)`
  padding-left: 6px;
  font-family: "SFPro-Regular";
  font-size: 19px;
  color: #000000;
`;

const NextButtonWrapper = styled(View)`
  align-items: center;
  width: 80%;
  justify-content: space-between;
  margin-top: 50%;
  display: flex;
  flex-direction: row;
`;

const ByContinuingText = styled(Text)`
  font-size: 14px;
  font-family: "SFPro-Regular";
  margin-right: 20px;
  margin-left: 25px;
`;

export const EnterPhoneNumber: React.FC<EnterPhoneNumberProps> = ({
  navigation,
}) => {
  const [value, onChangeText] = React.useState<string>("");

  const onBackButtonClick = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const onTextChange = (text: string) => {
    const trimmedText = text.replace(/ /g, "");

    if (trimmedText.length > 3) {
      const initialSplit = trimmedText.substring(0, 3);
      let secondSplit = trimmedText.substring(3, trimmedText.length);

      if (trimmedText.length > 6) {
        secondSplit = trimmedText.substring(3, 6);

        const finalSplit = trimmedText.substring(6, trimmedText.length);
        return onChangeText(`${initialSplit} ${secondSplit} ${finalSplit}`);
      }
      return onChangeText(`${initialSplit} ${secondSplit}`);
    }
    onChangeText(text);
  };

  return (
    <SafeAreaWrapper>
      <BackButton onClick={onBackButtonClick} />
      <EnterMobileNumberText>Enter your mobile number</EnterMobileNumberText>
      <PhoneWrapper>
        <FlagWrapper />
        <CountryCode>+61</CountryCode>
        <PhoneNumberInput
          multiline={false}
          numberOfLines={1}
          placeholder="474 430 303"
          placeholderTextColor="#60605e"
          autoFocus
          keyboardType={"numeric"}
          value={value}
          onChangeText={onTextChange}
          maxLength={11}
        />
      </PhoneWrapper>
      <HorizontalLine />
      <NextButtonWrapper>
          <ByContinuingText>
              By continuing you will receive a SMS for verification
          </ByContinuingText>
        <NextButton onClick={() => {}} />
      </NextButtonWrapper>
    </SafeAreaWrapper>
  );
};
