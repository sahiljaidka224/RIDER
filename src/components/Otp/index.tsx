import {
  ByContinuingText,
  EnterMobileNumberText,
  NextButtonWrapper,
} from "../EnterPhoneNumber";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { Platform, SafeAreaView, Text, TextInput, View } from "react-native";

import { BackButton } from "../Common/BackButton";
import { NextButton } from "../Common/NextButton";
import React from "react";
import { VERIFY_OTP } from "./queriesAndMutations";
import { _ } from "lodash";
import styled from "styled-components/native";
import { useMutation } from "@apollo/react-hooks";

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

const Container = styled(View)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ContainerNumber = styled(View)`
  flex: 1;
`;

const ContainerButton = styled(View)`
  flex: 1;
  align-items: flex-start;
  padding: 10px;
`;

const Error = styled(Text)`
  font-size: 14px;
  font-family: "SFPro-Regular";
  color: red;
  margin: 0 auto;
`;

export const OtpScreen: React.FC<OtpScreenProps> = ({ navigation, route }) => {
  const { number, id } = route.params;

  const [otp, updateOtp] = React.useState<string[]>([]);
  const [editingIndex, updateEditingIndex] = React.useState<Number>(0);
  const [seconds, updateSeconds] = React.useState(35);

  const [verifyOtp, { loading, error, data }] = useMutation(VERIFY_OTP, {
    onCompleted: (completedData) => {
      navigation.navigate("BookingScreen");
    },
  });

  const onBackClick = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };
  // TODO: remove timer from state
  // TODO: resend functionality

  React.useEffect(() => {
    if (!seconds) return;

    // const intervalId = setInterval(() => {
    //   updateSeconds(seconds - 1);
    // }, 1000);

    // return () => clearInterval(intervalId);
  }, [seconds]);

  const onNextButtonClick = () => {
    if (otp.length < 4) return; // TODO: show error

    const otpToVerify = otp.toString().replaceAll(",", "");
    if (otpToVerify.length === 4) {
      verifyOtp({
        variables: { otp: otpToVerify, id: id },
      });
    }
  };

  console.log({ loading, error, data });

  return (
    <BackgroundView>
      <BackButton onClick={onBackClick} />
      <Container>
        <ContainerNumber>
          <EnterMobileNumberText>
            {`Please enter the 4-digit code sent to you at +61 ${number}`}
          </EnterMobileNumberText>
          <OtpWrapper>
            {[0, 1, 2, 3].map((_elem, index) => (
              <InputWrapper key={`${index}-${Math.random()}`}>
                <OtpTextInput
                  key={`${index}-${Math.random()}`}
                  maxLength={1}
                  value={otp[index] ? otp[index] : ""}
                  autoFocus={editingIndex === index}
                  keyboardType={
                    Platform.OS === "ios" ? "number-pad" : "numeric"
                  }
                  onChange={(event) => {
                    const { text } = event.nativeEvent;
                    otp[index] = text;
                    updateOtp([...otp]);
                    if (index < 3 && text !== "") {
                      if (index < 3) {
                        updateEditingIndex(index + 1);
                      }
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace") {
                      if (index > 0 && otp[index] === "") {
                        updateEditingIndex(index - 1);
                      }
                    }
                  }}
                />
              </InputWrapper>
            ))}
          </OtpWrapper>
          {!loading && !data && error && <Error>Please try again!</Error>}
        </ContainerNumber>
        <ContainerButton>
          <NextButtonWrapper>
            <ByContinuingText>
              {`Resend code in 0:${seconds > 9 ? seconds : `0${seconds}`}`}
            </ByContinuingText>
            <NextButton
              loading={loading}
              onClick={!loading ? onNextButtonClick : () => {}}
              isValid={otp.length === 4}
            />
          </NextButtonWrapper>
        </ContainerButton>
      </Container>
    </BackgroundView>
  );
};
