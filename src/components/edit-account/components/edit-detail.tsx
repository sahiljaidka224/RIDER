import { NavigationProp, RouteProp } from "@react-navigation/native";

import { ActivityIndicator } from "react-native";
import { BackButton } from "../../Common/BackButton";
import { Color } from "../../../constants/Theme";
import { Icons } from "../../../constants/icons";
import React from "react";
import { UPDATE_DETAILS } from "../queriesAndMutations";
import styled from "styled-components/native";
import { useMutation } from "@apollo/react-hooks";
import { useOvermind } from "../../../../overmind";

type EditFieldProps = {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
};

const SafeAreaWrapper = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${Color.BackgroundView.Background};
`;

const BackButtonWrapper = styled.View`
  margin-top: 25px;
`;

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TextFieldWrapper = styled.View`
  flex: 2;
`;

const TextField = styled.TextInput`
  height: 45px;
  border-bottom-width: 1px;
  width: 90%;
  margin: 0 auto;
  margin-top: 20%;
  font-size: 20px;
  padding-left: 10px;
  border-bottom-color: #000;
  background: #e5f2ff;
  font-family: "SFPro-Regular";
`;

const UpdateButtonWrapper = styled.View`
  flex: 1;
  align-items: flex-start;
  padding: 10px;
`;

const UpdateButton = styled.TouchableOpacity`
  align-items: center;
  height: 50px;
  background: ${Color.Button.Background};
  width: 80%;
  margin: 0 auto;
  justify-content: center;
  border-radius: 30px;
  opacity: 0.9;
`;

const UpdateButtonText = styled.Text`
  font-size: 20px;
  line-height: 20px;
  font-family: "SFPro-Regular";
  color: #fff;
`;

const Error = styled.Text`
  font-size: 14px;
  font-family: "SFPro-Regular";
  color: red;
  margin: 0 auto;
`;

export const EditFieldScreen: React.FC<EditFieldProps> = ({
  navigation,
  route,
}) => {
  const { label, value: textValue } = route.params;
  const [value, onChangeText] = React.useState(textValue);

  const { actions } = useOvermind();

  const [updateDetails, { loading, error }] = useMutation(UPDATE_DETAILS, {
    onCompleted: ({ updateDetails }) => {
      if (updateDetails) {
        const { fullName, email, mobile } = updateDetails;
        actions.updateUserDetails({ fullName, email, mobile });
        onBackButtonPress();
      }
    },
  });

  const onUpdate = () => {
    if (value && value !== "" && value.trim() !== "") {
      const variables =
        label === "Full Name" ? { fullName: value } : { email: value };
      updateDetails({
        variables: variables,
      });
    }
  };

  const onBackButtonPress = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };
  return (
    <SafeAreaWrapper behavior="padding">
      <BackButtonWrapper>
        <BackButton onClick={onBackButtonPress} source={Icons.cross} />
      </BackButtonWrapper>
      <Wrapper>
        <TextFieldWrapper>
          <TextField
            onChangeText={(text) => onChangeText(text)}
            value={value}
            autoFocus
            placeholder={label}
          />
          {error && !loading && <Error>Please try again</Error>}
        </TextFieldWrapper>
        <UpdateButtonWrapper>
          <UpdateButton onPress={onUpdate}>
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <UpdateButtonText>
                {textValue ? "Update" : "Add"}
              </UpdateButtonText>
            )}
          </UpdateButton>
        </UpdateButtonWrapper>
      </Wrapper>
    </SafeAreaWrapper>
  );
};
