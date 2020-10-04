import gql from "graphql-tag";

export const GET_USER_DETAILS = gql`
  query GetUserDetails {
    getUserDetails {
      userId
      token
      email
      fullName
      mobile
      documentsVerified
    }
  }
`;

export const UPDATE_DETAILS = gql`
  mutation UpdateDetials($fullName: String, $email: String) {
    updateDetails(input: { fullName: $fullName, email: $email }) {
      email
      fullName
      mobile
    }
  }
`;

export const ADD_CARD_MUTATION = gql`
  mutation AddCardDetails($stripeCardToken: String!) {
    addCard(stripeCardToken: $stripeCardToken)
  }
`;

export const GET_MY_CARDS = gql`
  query GetMyCards {
    getMyCards {
      lastFour
    }
  }
`;
