import { Icons } from "../../../constants/icons";
// import { MutationFunction } from "@apollo/react-hooks";
import { NextButton } from "../../Common/NextButton";
import React from "react";
import { RideView } from "../../ride-type";
import styled from "styled-components/native";
import { useOvermind } from "../../../../overmind";

interface Option {
  type: string;
  price: string;
}

interface RoutesViewProps {
  options?: Option[];
  duration: string;
  distance: string;
  requestBooking: any;
  requestBookingLoading: boolean;
  isBookingActive?: boolean;
}

const TopHighlight = styled.View`
  border: 3px solid #c4c4c4;
  border-radius: 2.5px;
  width: 15%;
  margin: 8px auto;
`;

const ChooseTrip = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  font-family: "SFPro-Regular";
  color: #0e1823;
  margin: 0 auto;
`;

const HorizontalLine = styled.View<{ margin?: boolean }>`
  border: 0.6px solid rgba(112, 112, 112, 0.2);
  width: 90%;
  margin: ${(props) => (props.margin ? `14px auto` : "4px auto")};
`;

const NextButtonWrapper = styled.View`
  width: 100%;
  height: auto;
  align-items: center;
  margin-bottom: 16px;
`;

export const RoutesView: React.FC<RoutesViewProps> = ({
  options,
  distance,
  duration,
  requestBooking,
  requestBookingLoading,
  isBookingActive,
}) => {
  const [selectedOption, updateSelectedOption] = React.useState(
    options && options.length > 0 ? options[0].type : undefined
  );
  const { state } = useOvermind();
  const { source, destination } = state;
  const timeString = `Choose a trip ${
    duration ? `to get there in ${duration} mins` : ""
  }`;

  const onNextButtonAction = () => {
    if (!isBookingActive) {
      alert(
        "🤙🏽 Thanks for taking out time and trying our app. Launching this Christmas!🎄🎅"
      );
      return;
    }

    if (!source || !destination || !selectedOption || !options) return;

    const selectedType = options?.find((o) => o.type === selectedOption);

    requestBooking({
      variables: {
        type: selectedOption ? selectedOption : "",
        proposedFare: selectedType ? selectedType.price : "err",
        sourceAddress: source.readable,
        destAddress: destination.readable,
        sourceLat: source.location.lat,
        sourceLng: source.location.lng,
        destLat: destination.location.lat,
        destLng: destination.location.lng,
      },
    });
  };

  return (
    <>
      <TopHighlight />
      <ChooseTrip>{timeString}</ChooseTrip>
      {options &&
        options.map((opt, index) => {
          const { type, price } = opt;

          const onSelected = () => {
            updateSelectedOption(type);
          };

          return (
            <React.Fragment key={index}>
              <RideView
                key={index}
                heading={type}
                description={
                  type === "RIDE"
                    ? "Affordable rides, all to yourself"
                    : "Deleveries made easy!"
                }
                fare={price}
                onPress={onSelected}
                selected={selectedOption === type}
                icon={type === "DELIVERY" ? Icons.deliveryIcon : Icons.carIcon}
              />
              {index + 1 !== options.length && (
                <HorizontalLine key={`${index}-line`} />
              )}
            </React.Fragment>
          );
        })}
      {
        <NextButtonWrapper>
          <NextButton
            onClick={onNextButtonAction}
            isValid={true}
            loading={requestBookingLoading}
          />
        </NextButtonWrapper>
      }
    </>
  );
};
