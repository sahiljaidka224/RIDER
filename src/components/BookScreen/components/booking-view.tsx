import {
  BOOKING_UPDATED_SUBSCRIPTION,
  UPDATE_BOOKING_MUTATION,
} from "../queriesAndMutations";
import { useMutation, useSubscription } from "@apollo/react-hooks";

import { Coords } from "..";
import { DriverDetails } from "./driver-view";
import { Loader } from "../../Common/loader";
import React from "react";
import { ScreenState } from "../../../../overmind/state";
import { getPolyline } from "../../../utils/polyline";
import styled from "styled-components/native";
import { useOvermind } from "../../../../overmind";

type BookingViewProps = {
  bookingId: string;
  updateRoute: (coordinates: [Coords] | undefined) => void;
};

const BackgroundView = styled.View`
  height: auto;
  width: auto;
  min-width: 40px;
  min-height: 200px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`;

export const BookingView: React.FC<BookingViewProps> = ({
  bookingId,
  updateRoute,
}) => {
  const { state, actions } = useOvermind();
  const { source, bookingScreenState } = state;
  const { data: bookingUpdatedData, loading, error } = useSubscription(
    BOOKING_UPDATED_SUBSCRIPTION,
    {
      variables: { bookingId: bookingId },
      onSubscriptionData: async ({ subscriptionData }) => {
        if (subscriptionData.data) {
          const { bookingUpdated } = subscriptionData.data;
          const { status, location } = bookingUpdated;

          if (status === "DRIVER_ASSIGNED") {
            if (location && source && source.location) {
              if (location.length < 1) return;
              const destPoint = {
                lat: location[1],
                lng: location[0],
              };

              const coordinates = await getPolyline(source.location, destPoint);
              updateRoute(coordinates);
              actions.updateBookingScreenState(ScreenState.DRIVER_ASSIGNED);
            }
          }
        }
      },
    }
  );

  const [
    updateBooking,
    { loading: updateBookingLoading, error: updateBookingError },
  ] = useMutation(UPDATE_BOOKING_MUTATION, {
    onCompleted: ({ bookingUpdated }) => {
      updateRoute(undefined);
      actions.updateBookingScreenState(ScreenState.INITIAL);
    },
  });

  const onCancel = () => {
    if (bookingId) {
      updateBooking({
        variables: { bookingId, status: "CANCELLED_BY_USER" },
      });
    }
  };

  return (
    <>
      {bookingScreenState === ScreenState.SEARCHING && (
        <BackgroundView>
          <Loader
            onButtonPress={onCancel}
            loadingText="Please wait while we get our best drivers for you..."
            loading={updateBookingLoading}
          />
        </BackgroundView>
      )}
      {bookingUpdatedData &&
        bookingScreenState === ScreenState.DRIVER_ASSIGNED &&
        bookingUpdatedData.bookingUpdated && (
          <DriverDetails
            name={bookingUpdatedData.bookingUpdated.fullName ?? "Name"}
            phone={bookingUpdatedData.bookingUpdated.mobile ?? ""}
            carName=""
            onCancel={onCancel}
            loading={updateBookingLoading}
          />
        )}
    </>
  );
};
