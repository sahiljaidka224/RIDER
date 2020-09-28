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
