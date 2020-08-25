import { ByContinuingText, EnterMobileNumberText, NextButtonWrapper } from "../EnterPhoneNumber";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { SafeAreaView, TextInput, View } from "react-native";

import { BackButton } from "../Common/BackButton";
import { NextButton } from "../Common/NextButton";
import React from "react";
import styled from "styled-components/native";

interface ParamList {
  number: string;
}

interface OtpScreenProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
}

interface OTPState {
  [key: string]: string;
}

const BackgroundView = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
  display: flex;
`;

const OtpWrapper = styled(View)`
  width: 100%;
  height: 60px;
  margin-top: 20%;
  justify-content: space-around;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
`;

const InputWrapper = styled(View)`
  height: 50px;
  width: 50px;
  background-color: #f5f5f5;
  margin-right: 20px;
  border-radius: 4px;
  border-bottom-width: 2px;
  border-bottom-color: #2ecb70;
`;

const OtpTextInput = styled(TextInput)`
  height: 100%;
  width: 100%;
  font-size: 22px;
  padding-left: 35%;
`;

export const OtpScreen: React.FC<OtpScreenProps> = ({ navigation, route }) => {
  const { number } = route.params;

  const [otp, updateOtp] = React.useState<string[]>([]);
  const [refArray, updateRefArr] = React.useState<TextInput[] | null[]>([]);
  const [seconds, updateSeconds] = React.useState(35);

  const onBackClick = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };
  // TODO: stop from entering . in otp field
  // TODO: resend functionality
  // TODO: back space otp

  React.useEffect(() => {
    if (!seconds) return;

    const intervalId = setInterval(() => {
      updateSeconds(seconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);

  }, [seconds]);

  console.log({ seconds });
  const onNextButtonClick = () => {}

  return (
    <BackgroundView>
      <BackButton onClick={onBackClick} />
      <EnterMobileNumberText>
        {`Please enter the 4-digit code sent to you at +61 ${number}`}
      </EnterMobileNumberText>
      <OtpWrapper>
        {[0, 1, 2, 3].map((_elem, index) => (
          <InputWrapper>
            <OtpTextInput
              ref={(ref) => (refArray[index] = ref)}
              key={index}
              maxLength={1}
              value={otp[index] ? otp[index] : ""}
              autoFocus={otp.length === index}
              keyboardType={"numeric"}
              onChangeText={(text) => {
                otp[index] = text;
                updateOtp([...otp]);
                if (index < 3 && text !== "") {
                  if (refArray !== null && refArray[index + 1] !== null) {
                    refArray[index + 1].focus();
                  }
                }
              }}
            />
          </InputWrapper>
        ))}
      </OtpWrapper>
      <NextButtonWrapper>
        <ByContinuingText>
          {`Resend code in 0:${seconds > 9 ? seconds : `0${seconds}`}`}
        </ByContinuingText>
        <NextButton
          onClick={onNextButtonClick}
          isValid={otp.length === 4}
        />
      </NextButtonWrapper>
    </BackgroundView>
  );
};
