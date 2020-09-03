import { Point } from "react-native-google-places-autocomplete";

export interface AddressData {
  readable: string;
  location: Point;
}

type State = {
  counter: number;
  source: AddressData | undefined;
  destination: AddressData | undefined;
};

export const state: State = {
  counter: 0,
  source: undefined,
  destination: undefined,
};
