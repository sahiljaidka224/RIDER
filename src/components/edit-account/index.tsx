import { ActivityIndicator, Dimensions, ScrollView } from "react-native";

import { BackButton } from "../Common/BackButton";
import { Color } from "../../constants/Theme";
import { DetailInfo } from "./components/text-view";
import { Feather } from "@expo/vector-icons";
import { GET_USER_DETAILS } from "./queriesAndMutations";
import { Icons } from "../../constants/icons";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import { useLazyQuery } from "@apollo/react-hooks";
import { useOvermind } from "../../../overmind";

type EditAccountProps = {
  navigation: NavigationProp<any, any>;
};

const SafeAreaWrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${Color.BackgroundView.Background};
`;

const BackButtonWrapper = styled.View`
  margin-top: 10px;
`;

const Heading = styled.Text`
  font-family: "SF-Pro-Display-SemiBold";
  margin-left: 25px;
  margin-top: 10px;
  font-size: 24px;
  line-height: 24px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const UserImage = styled.Image<{ size?: number }>`
  width: ${({ size }) => (size ? `${size}px` : "60px")};
  height: ${({ size }) => (size ? `${size}px` : "60px")};
  border-radius: ${({ size }) => (size ? `${size / 2}px` : "60px")}; ;
`;

const EditImageWrapper = styled.TouchableOpacity`
  width: 26px;
  height: 26px;
  position: absolute;
  right: ${Dimensions.get("window").width / 2 - 55}px;
  top: 20px;
  background: #000000;
  border-radius: 13px;
  padding: 1px;
  justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.View`
  width: 90%;
  height: 100px;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 0 auto;
  flex-direction: row;
  border-bottom-width: 0.6px;
  margin-bottom: 10px;
`;

export const EditAccount: React.FC<EditAccountProps> = ({ navigation }) => {
  const { state, actions } = useOvermind();
  const { userDetails } = state;

  const [getDetails, { loading, data, error }] = useLazyQuery(
    GET_USER_DETAILS,
    {
      onCompleted: ({ getUserDetails }) => {
        const { email, fullName, mobile } = getUserDetails;
        actions.updateUserDetails({ email, fullName, mobile });
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  React.useEffect(() => {
    if (!userDetails) {
      getDetails();
    }
  }, []);

  const onBackButtonClick = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const spacedMobileNumb = (num: string) => {
    const splitNum = num.split("");

    const spacedNumArr = splitNum.map((str, index) => {
      if (index % 3 === 0) return ` ${str}`;
      return str;
    });

    return spacedNumArr.join("");
  };

  return (
    <SafeAreaWrapper>
      <BackButtonWrapper>
        <BackButton onClick={onBackButtonClick} />
      </BackButtonWrapper>
      <Heading>Edit Account</Heading>
      <ImageWrapper>
        <UserImage source={Icons.driverDefault} resizeMode="contain" />
        <EditImageWrapper>
          <Feather name="edit-2" color={Color.Button.Background} size={19} />
        </EditImageWrapper>
      </ImageWrapper>
      {loading && <ActivityIndicator size="small" />}
      <ScrollView>
        <DetailInfo
          key="1"
          label="Full Name"
          value={userDetails?.fullName ? userDetails.fullName : "-"}
          navigation={navigation}
        />
        <DetailInfo
          key="2"
          label="Email"
          value={userDetails?.email ? userDetails.email : "-"}
          navigation={navigation}
        />
        <DetailInfo
          key="3"
          label="Mobile"
          value={
            userDetails?.mobile
              ? `+61 ${spacedMobileNumb(userDetails?.mobile)}`
              : "-"
          }
          navigation={navigation}
          disabled={true}
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};
