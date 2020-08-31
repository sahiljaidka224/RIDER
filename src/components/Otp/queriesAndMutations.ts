import gql from "graphql-tag";

export const VERIFY_OTP = gql`
  mutation VerifyOtp($otp: String!, $id: ID!) {
    verifyOtp(otp: $otp, id: $id) {
      userId
      token
      email
      fullName
      mobile
    }
  }
`;
