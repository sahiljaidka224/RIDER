import gql from "graphql-tag";

export const GET_MY_BOOKINGS = gql`
  query GetMyBookings {
    getMyBookings {
      _id
      createdAt
      sourceLatLng {
        lat
        lng
      }
      destLatLng {
        lat
        lng
      }
      sourceAddress
      destAddress
      status
      fareCharged
      totalTime
      type
    }
  }
`;
