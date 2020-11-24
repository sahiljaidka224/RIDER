import { ADD_CARD_MUTATION } from "../../edit-account/queriesAndMutations";
import { ActivityIndicator } from "react-native";
import { BackButton } from "../../Common/BackButton";
import { Color } from "../../../constants/Theme";
import { CreditCardInput } from "react-native-credit-card-input";
import { Icons } from "../../../constants/icons";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import { useMutation } from "@apollo/react-hooks";
var stripe = require("stripe-client")(
  `pk_test_51HQsOMKqzZyQju7VuuXeblId272rr8RA1cjvlXvudTzV85ndeTmCH2WD1t3pU2f0r24LWjXGIdfrLYOnaqUWLjh700M7Sa0P5t`
);

type AddCardProps = {
  navigation: NavigationProp<any, any>;
};

type Values = {
  cvc: string;
  expiry: string;
  number: string;
  type: string;
  name: string;
};

type Form = {
  valid: boolean;
  status: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
  values: Values;
};

const SafeAreaWrapper = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${Color.BackgroundView.Background};
`;

const BackButtonWrapper = styled.View`
  margin-top: 25px;
`;

const CreditCardWrapper = styled.View`
  flex: 2;
`;

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const AddCardButtonWrapper = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const AddCardButton = styled.TouchableOpacity<{ disabled: boolean }>`
  align-items: center;
  height: 50px;
  background: ${({ disabled }) =>
    disabled ? "#f1f1f1" : Color.Button.Background};
  width: 80%;
  margin: 0 auto;
  justify-content: center;
  border-radius: 30px;
`;

const AddCardButtonText = styled.Text`
  font-size: 20px;
  line-height: 20px;
  font-family: "SFPro-Regular";
  color: #fff;
`;

export const AddCardView: React.FC<AddCardProps> = ({ navigation }) => {
  const [valid, updateValid] = React.useState<boolean>(false);
  const [values, updateValues] = React.useState<Values>();

  const onBackButtonPress = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const [addCard, { data, error, loading }] = useMutation(ADD_CARD_MUTATION, {
    onCompleted: (completedData) => {
      if (completedData) {
        onBackButtonPress();
      }
    },
  });

  const onCardChange = (form: Form) => {
    const { valid, status, values } = form;
    updateValid(valid);

    if (valid || values) {
      updateValues({
        cvc: values.cvc,
        expiry: values.expiry,
        name: values.name,
        number: values.number,
        type: values.type,
      });
    }
  };

  const onAddCard = async () => {
    if (!values || !valid) return;

    const { cvc, expiry, name, number } = values;

    const expiryArr = expiry.split("/");

    if (!expiryArr || expiryArr.length < 1) return;
    const information = {
      card: {
        number: number,
        exp_month: expiryArr[0],
        exp_year: expiryArr[1],
        cvc: cvc,
        name: name,
      },
    };
    var card = await stripe.createToken(information);
    var token = card.id;

    addCard({
      variables: {
        stripeCardToken: token,
      },
    });
  };
  return (
    <SafeAreaWrapper behavior="padding">
      <BackButtonWrapper>
        <BackButton onClick={onBackButtonPress} source={Icons.cross} />
      </BackButtonWrapper>
      <Wrapper>
        <CreditCardWrapper>
          <CreditCardInput
            onChange={onCardChange}
            cardScale={0.75}
            autoFocus
            requiresName
            cardImageFront={require("../../../../assets/PaymentCard.png")}
            cardImageBack={require("../../../../assets/PaymentCard.png")}
            allowScroll
          />
        </CreditCardWrapper>
        <AddCardButtonWrapper>
          <AddCardButton disabled={!valid} onPress={onAddCard}>
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <AddCardButtonText>Add Card</AddCardButtonText>
            )}
          </AddCardButton>
        </AddCardButtonWrapper>
      </Wrapper>
    </SafeAreaWrapper>
  );
};
