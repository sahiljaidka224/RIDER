import { ApolloProvider } from "@apollo/react-hooks";
import { AppLoading } from "expo";
import { BookNowScreen } from "./src/components/BookRide";
import { BookingScreen } from "./src/components/BookScreen";
import { DrawerComp } from "./src/components/drawer";
import { EnableNotifications } from "./src/components/EnableNotification";
import { EnterDestination } from "./src/components/SelectDestination";
import { EnterDestinationScreen } from "./src/components/enter-destination";
import { EnterPhoneNumber } from "./src/components/EnterPhoneNumber";
import { EntryScreen } from "./src/components/EntryPoint";
import { NavigationContainer } from "@react-navigation/native";
import { OtpScreen } from "./src/components/Otp";
import { Provider } from "overmind-react";
import React from "react";
import { SignUp } from "./src/components/Signup";
import client from "./client";
import { config } from "./overmind";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createOvermind } from "overmind";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "@use-expo/font";

const overmind = createOvermind(config, {
  devtools: "192.168.0.46:3031",
});

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const Drawer = createDrawerNavigator();

const MainStackScreen = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="EntryScreen"
        component={EntryScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="EnterPhoneNumber"
        component={AuthedViews}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="OtpScreen"
        component={OtpScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="BookingScreen"
        component={BookingScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </MainStack.Navigator>
  );
};

const AuthedViews = () => {
    return (
      <Drawer.Navigator
        initialRouteName="BookingScreen"
        drawerContent={DrawerComp}
      >
        <Drawer.Screen name="BookingScreen" component={BookingScreen} />
        <Drawer.Screen name="EnterPhoneNumber" component={EnterPhoneNumber} />
      </Drawer.Navigator>
    );
}

export default function App() {
  const [isLoaded] = useFonts({
    "SFPro-Regular": require("./assets/fonts/SFProDisplayRegular.ttf"),
  });

  if (!isLoaded) {
    return <AppLoading />;
  }
  return (
    <ApolloProvider client={client}>
      <Provider value={overmind}>
        <NavigationContainer>
          <RootStack.Navigator mode="modal">
            <RootStack.Screen
              name="Main"
              component={MainStackScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="EnterDestination"
              component={EnterDestinationScreen}
              options={{
                headerShown: false,
                cardStyle: { backgroundColor: "transparent" },
              }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </Provider>
    </ApolloProvider>
  );
}
