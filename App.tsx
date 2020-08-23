import { ApolloProvider } from "@apollo/react-hooks";
import { AppLoading } from "expo";
import { BookNowScreen } from "./src/components/BookRide";
import { EnterDestination } from "./src/components/SelectDestination";
import { EntryScreen } from "./src/components/EntryPoint";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { SignUp } from "./src/components/Signup";
import client from "./client";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "@use-expo/font";

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const MainStackScreen = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="EntryScreen"
        component={EntryScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="BookNow"
        component={BookNowScreen}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
};

export default function App() {
  const [isLoaded] = useFonts({
    "SFPro-Regular": require("./assets/fonts/SFProDisplayRegular.ttf"),
  });

  if (!isLoaded) {
    return <AppLoading />;
  }
  return (
      <ApolloProvider client={client}>
        <NavigationContainer>
          <RootStack.Navigator mode="modal">
            <RootStack.Screen
              name="Main"
              component={MainStackScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="EnterDestination"
              component={EnterDestination}
              options={{
                headerShown: false,
                cardStyle: { backgroundColor: "transparent" },
              }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    );
  
}
