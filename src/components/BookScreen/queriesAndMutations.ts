import gql from "graphql-tag";

export const GET_NEARBY_DRIVERS = gql`
  query FindNearByDrivers($cords: [Float]) {
    findNearByDrivers(cords: $cords) {
      _id
      location
      fullName
      email
      rating
      distance
    }
  }
`;

export const BOOKING_MUTATION = gql`
  mutation CreateBooking(
    $type: String!
    $proposedFare: String!
    $sourceAddress: String!
    $sourceLat: Float!
    $sourceLng: Float!
    $destAddress: String!
    $destLat: Float!
    $destLng: Float!
  ) {
    createBooking(
      bookingInput: {
        type: $type
        proposedFare: $proposedFare
        sourceAddress: $sourceAddress
        destAddress: $destAddress
        sourceLatLng: { lat: $sourceLat, lng: $sourceLng }
        destLatLng: { lat: $destLat, lng: $destLng }
      }
    ) {
      id
    }
  }
`;

export const BOOKING_ACCEPTED_SUBSCRIPTION = gql`
  subscription BookingAccepted {
    bookingAccepted {
      _id
      location
      fullName
      mobile
      rating
      distance
    }
  }
`;

export const BOOKING_UPDATED_SUBSCRIPTION = gql`
  subscription BookingUpdated($bookingId: ID!) {
    bookingUpdated(bookingId: $bookingId) {
      bookingId
      driverId
      email
      fullName
      mobile
      rating
      distance
      location
      status
    }
  }
`;

export const UPDATE_BOOKING_MUTATION = gql`
  mutation UpdateBooking($bookingId: ID!, $status: String!) {
    driverUpdateBooking(bookingId: $bookingId, status: $status) {
      bookingId
      status
    }
  }
`;

export const UPDATE_EXPO_PUSHTOKEN = gql`
  mutation UpdateExpoPushToken($pushToken: String!, $userType: String) {
    registerExpoPushToken(pushToken: $pushToken, userType: $userType)
  }
`;

export const GET_BOOKING_INPROGRESS = gql`
  query GetBookingInProgress {
    getBookingInProgress {
      bookingId
      driverId
      email
      sourceLatLng {
        lat
        lng
      }
      destLatLng {
        lat
        lng
      }
      status
      source
      destAddress
      type
    }
  }
`;
