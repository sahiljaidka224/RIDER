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
