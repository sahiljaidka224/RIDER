import { Color } from "../../../constants/Theme";
import { Icons } from "../../../constants/icons";
import React from "react";
import moment from "moment";
import styled from "styled-components/native";

type TripOverviewProps = {
  booking: Booking;
};

type Booking = {
  createdAt: string;
  fareCharged: string;
  sourceAddress: string;
  destAddress: string;
  status: string;
};

const BackgroundView = styled.View`
  margin: 0 auto;
  width: 95%;
  display: flex;
  flex-direction: row;
  padding: 15px;
  padding-bottom: 0px;
  align-items: center;
  height: auto;
  margin-bottom: 5px;
`;

const DetailsWrapper = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  margin-left: 15px;
  padding-right: 10px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(112, 112, 112, 0.2);
`;

const Time = styled.Text`
  font-size: 17px;
  line-height: 17px;
  font-weight: 100;
  font-family: "SFPro-Regular";
  color: ${Color.Text.Normal.Color};
`;

const DriverImage = styled.Image`
  width: 34px;
  height: 34px;
  border-radius: 17px;
`;

const Fare = styled.Text`
  font-size: 17px;
  line-height: 17px;
  font-weight: 100;
  font-family: "SFPro-Regular";
  margin-top: 4px;
  color: ${Color.Text.Normal.Color};
`;

const DestAddress = styled.Text`
  font-size: 15px;
  line-height: 17px;
  font-family: "SFPro-Regular";
  margin-top: 4px;
  margin-bottom: 10px;
  color: #7f7f7f;
`;

const TimeStatusWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
`;

const StatusWrapper = styled.View<{ borderColor?: string }>`
  min-width: 50px;
  height: 20px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  border: 1px solid
    ${({ borderColor }) =>
      borderColor ? borderColor : Color.Button.Background};
`;

const StatusText = styled.Text`
  font-size: 13px;
  font-family: "SFPro-Regular";
`;

export const TripOverView: React.FC<TripOverviewProps> = ({ booking }) => {
  const { createdAt, fareCharged, destAddress, status } = booking;
  let momentTime;
  try {
    let timestampAsNumber = Number(createdAt);
    momentTime = moment(timestampAsNumber);
  } catch (E) {}

  const getStatusText = (st: string) => {
    if (st.includes("CANCELLED")) return "CANCELLED";
    return st;
  };

  const getBorderColor = (st: string) => {
    if (st.includes("CANCELLED")) return "red";
  };

  return (
    <BackgroundView>
      <DriverImage source={Icons.driverDefault} resizeMode="contain" />
      <DetailsWrapper>
        <TimeStatusWrapper>
          <Time>
            {momentTime
              ? `${momentTime.format("dddd").substr(0, 3)}, ${momentTime
                  .format("MMMM")
                  .substr(0, 3)} ${momentTime
                  .format("DD")
                  .substr(0, 3)}, ${momentTime.format("hh:mm a").toUpperCase()}`
              : ""}
          </Time>
          <StatusWrapper borderColor={getBorderColor(status)}>
            <StatusText>{getStatusText(status)}</StatusText>
          </StatusWrapper>
        </TimeStatusWrapper>
        <Fare>{`A$ ${fareCharged ? fareCharged : "0"}`}</Fare>
        <DestAddress>
          {`To: ${destAddress ? destAddress.split(",")[0] : ""}`}
        </DestAddress>
      </DetailsWrapper>
    </BackgroundView>
  );
};
