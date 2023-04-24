import { ActivityIndicator } from "react-native";
import { BackButton } from "../Common/BackButton";
import { Color } from "../../constants/Theme";
import { Feather } from "@expo/vector-icons";
import { GET_MY_CARDS } from "../edit-account/queriesAndMutations";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
// import { useQuery } from "@apollo/react-hooks";

type PaymentScreenProps = {
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

const AddPaymentView = styled.TouchableOpacity<{ borderColor?: string }>`
  width: 90%;
  margin: 0 auto;
  margin-top: 10px;
  border: 2px dashed
    ${({ borderColor }) => (borderColor ? borderColor : "#f0f1f1;")};
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 0 10px;
`;

const AddPaymentText = styled.Text<{ textColor?: string }>`
  font-family: "SFPro-Regular";
  flex: 2;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  color: ${({ textColor }) =>
    textColor ? textColor : Color.Text.Normal.Color};
`;

const AddIconWrapper = styled(Feather)``;

export const PaymentsView: React.FC<PaymentScreenProps> = ({ navigation }) => {
  // const { loading, error, data } = useQuery(GET_MY_CARDS, {
  //   notifyOnNetworkStatusChange: true,
  //   fetchPolicy: "no-cache",
  // });

  const onBackButtonClick = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const onAddPaymentViewClick = () => {
    navigation.navigate("AddCardView");
  };

  return (
    <SafeAreaWrapper>
      <BackButtonWrapper>
        <BackButton onClick={onBackButtonClick} />
      </BackButtonWrapper>
      <Heading>Payments</Heading>
      {/* {loading && <ActivityIndicator size="small" />} */}
      {/* {data && data.getMyCards && data.getMyCards.length > 0 && (
        <AddPaymentView borderColor="rgba(112, 112, 112, 0.2)">
          <Feather
            name="credit-card"
            color={Color.Button.Background}
            size={19}
          />
          <AddPaymentText>{`•••• ${data.getMyCards[0].lastFour}`}</AddPaymentText>
        </AddPaymentView>
      )} */}
      <AddPaymentView onPress={onAddPaymentViewClick}>
        <AddPaymentText>Add Payment Method</AddPaymentText>
        <AddIconWrapper name="plus" color={Color.Button.Background} size={24} />
      </AddPaymentView>
      {/* {!data ||
        !data.getMyCards ||
        (data.getMyCards.length === 0 && (
          <AddPaymentView onPress={onAddPaymentViewClick}>
            <AddPaymentText>Add Payment Method</AddPaymentText>
            <AddIconWrapper
              name="plus"
              color={Color.Button.Background}
              size={24}
            />
          </AddPaymentView>
        ))} */}
    </SafeAreaWrapper>
  );
};
