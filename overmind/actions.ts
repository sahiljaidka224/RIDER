import { Action } from "overmind";
import { AddressData } from "./state";

export const increment: Action<number> = ({ state }, incrementBy) => {
  state.counter += incrementBy;
};

export const decrement: Action<number> = ({ state }, decrementBy) => {
  state.counter -= decrementBy;
};

export const updateSource: Action<AddressData> = ({ state }, address) => {
  state.source = address;
};

export const updateDestination: Action<AddressData> = ({ state }, address) => {
  state.destination = address;
};
