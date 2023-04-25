import * as Location from "expo-location";

import React, { useCallback, useEffect } from "react";

import { AddCardView } from "./src/components/payments/components/web-add-card";
import { BookingScreen } from "./src/components/BookScreen";
import { DrawerComp } from "./src/components/drawer";
import { EditAccount } from "./src/components/edit-account";
import { EditFieldScreen } from "./src/components/edit-account/components/edit-detail";
import { EnterDestinationScreen } from "./src/components/enter-destination";
import { EnterPhoneNumber } from "./src/components/EnterPhoneNumber";
import { EntryScreen } from "./src/components/EntryPoint";
import { NavigationContainer } from "@react-navigation/native";
import { OtpScreen } from "./src/components/Otp";
import { PaymentsView } from "./src/components/payments";
import { Provider } from "overmind-react";
import { YourRides } from "./src/components/your-rides";
import { config } from "./overmind";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createOvermind } from "overmind";
import { createStackNavigator } from "@react-navigation/stack";
import { isSignedIn } from "./auth";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { ApolloProvider } from "@apollo/client";
import client from "./client";

const overmind = createOvermind(
  config
  //   {
  //   devtools: "192.168.0.46:3031",
  // }
);

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const Drawer = createDrawerNavigator();

const MainStackScreen = () => {
  return (
    <MainStack.Navigator initialRouteName="EntryScreen">
      <MainStack.Screen
        name="EntryScreen"
        component={EntryScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="EnterPhoneNumber"
        component={EnterPhoneNumber}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="OtpScreen"
        component={OtpScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="BookingScreen"
        component={AuthedViews}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </MainStack.Navigator>
  );
};

const AuthedViews = () => {
  return (
    <Drawer.Navigator
      initialRouteName="BookingScreen"
      drawerContent={(props) => (
        <DrawerComp {...props} options={{ headerShown: false }} />
      )}
      hideStatusBar
    >
      <MainStack.Screen name="Main" component={MainStackScreen} />
      <Drawer.Screen name="BookingScreen" component={BookingScreen} />
      <Drawer.Screen
        name="YourRides"
        component={YourRides}
        options={{ gestureEnabled: false }}
      />
      <Drawer.Screen
        name="EditAccount"
        component={EditAccount}
        options={{ gestureEnabled: false }}
      />
      <Drawer.Screen
        name="PaymentsView"
        component={PaymentsView}
        options={{ gestureEnabled: false, unmountOnBlur: true }}
      />
    </Drawer.Navigator>
  );
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [auth, updateAuth] = React.useState(false);
  const [checkedSignedIn, updateCheckedSignedIn] = React.useState(false);
  const [appIsReady, setAppIsReady] = React.useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // TODO: Find a better way to do this
  onLayoutRootView();

  useEffect(() => {
    getLocationPermission();

    async function prepare() {
      try {
        await Font.loadAsync({
          "SFPro-Regular": require("./assets/fonts/SFProDisplayRegular.ttf"),
          "SF-Pro-Display-SemiBold": require("./assets/fonts/SF-UI-Display-Semibold.ttf"),
        });

        isSignedIn()
          .then((res: boolean) => {
            updateAuth(res);
            updateCheckedSignedIn(true);
          })
          .catch(() => alert("An error occurred"));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const getLocationPermission = async () => {
    const { status: existingStatus } =
      await Location.getForegroundPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Location.getForegroundPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert(
        "Please allow location permissions from settings in order to take full advantage of the app."
      );
      return;
    }
  };

  if (!appIsReady || !checkedSignedIn) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <Provider value={overmind}>
        <NavigationContainer>
          <RootStack.Navigator mode="modal">
            {auth ? (
              <RootStack.Screen
                name="AuthedViews"
                component={AuthedViews}
                options={{ headerShown: false }}
              />
            ) : (
              <RootStack.Screen
                name="Main"
                component={MainStackScreen}
                options={{ headerShown: false }}
              />
            )}
            <RootStack.Screen
              name="EnterDestination"
              component={EnterDestinationScreen}
              options={{
                headerShown: false,
                cardStyle: { backgroundColor: "transparent" },
              }}
            />
            <RootStack.Screen
              name="EditFieldScreen"
              component={EditFieldScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="AddCardView"
              component={AddCardView}
              options={{
                headerShown: false,
              }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </Provider>
    </ApolloProvider>
  );
}
