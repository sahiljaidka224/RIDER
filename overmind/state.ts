import { Point } from "react-native-google-places-autocomplete";

export interface AddressData {
  readable: string;
  location: Point;
}

export type UserDetails = {
  fullName: string | undefined;
  mobile: string | undefined;
  email: string | undefined;
};

export enum ScreenState {
  INITIAL,
  ROUTES,
  SEARCHING,
  DRIVER_ASSIGNED,
  BOOKING_IN_PROGRESS,
  DRIVER_ARRIVED,
  CANCELLED,
  COMPLETED,
}

type State = {
  source: AddressData | undefined;
  destination: AddressData | undefined;
  bookingScreenState: ScreenState;
  userDetails: UserDetails | undefined;
};

export const state: State = {
  source: undefined,
  destination: undefined,
  bookingScreenState: ScreenState.INITIAL,
  userDetails: undefined,
};
