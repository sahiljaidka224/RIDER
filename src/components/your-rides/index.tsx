import { BackButton } from "../Common/BackButton";
import { Color } from "../../constants/Theme";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import { useQuery } from "@apollo/client";
import { GET_MY_BOOKINGS } from "./queriesAndMutations";
import { TripOverView } from "./components/trip-overview";
import { ActivityIndicator, FlatList } from "react-native";

type YourRidesProps = {
  navigation: NavigationProp<any, any>;
};

const BackgroundView = styled.SafeAreaView`
  flex: 1;
  flex-grow: 1;
  background-color: ${Color.BackgroundView.Background};
`;

const BackButtonWrapper = styled.View`
  margin-top: 10px;
`;

const Heading = styled.Text`
  font-family: "SF-Pro-Display-SemiBold";
  margin-left: 25px;
  margin-top: 10px;
  font-size: 24px;
  line-height: 24px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const ActivityIndicatorWrapper = styled.View`
  margin-top: 10px;
  align-items: center;
  flex: 1;
`;

const Error = styled.Text`
  font-size: 14px;
  font-family: "SFPro-Regular";
  color: red;
  margin: 0 auto;
`;

const NoRidesView = styled.View`
  flex: 1;
  align-items: center;
  margin: 0 auto;
  width: 80%;
  font-family: "SFPro-Regular";
  margin-top: 10%;
`;

const NoRidesText = styled.Text`
  font-size: 20px;
`;

export const YourRides: React.FC<YourRidesProps> = ({ navigation }) => {
  const onBackButtonClick = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const { loading, error, data, refetch } = useQuery(GET_MY_BOOKINGS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  return (
    <BackgroundView>
      <BackButtonWrapper>
        <BackButton onClick={onBackButtonClick} />
      </BackButtonWrapper>
      <Heading>{`Your rides`}</Heading>
      {loading && !data && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator size="large" />
        </ActivityIndicatorWrapper>
      )}
      {!loading && !data && error && <Error>Please try again!</Error>}
      {!loading &&
        !error &&
        data &&
        data.getMyBookings &&
        data.getMyBookings.length === 0 && (
          <NoRidesView>
            <NoRidesText>We are looking forward to ride with you!</NoRidesText>
          </NoRidesView>
        )}

      {data && data.getMyBookings && data.getMyBookings.length > 0 && (
        <FlatList
          data={data.getMyBookings}
          refreshing={loading}
          onRefresh={!loading && refetch ? refetch : null}
          keyExtractor={(item: any) => item._id}
          scrollEnabled={true}
          renderItem={({ item }) => <TripOverView booking={item} />}
        />
      )}
    </BackgroundView>
  );
};
