import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { BookNowScreen } from "./src/components/BookRide";
import { SignUp } from "./src/components/Signup";
import { EnterDestination } from "./src/components/SelectDestination";

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const MainStackScreen = () => {
  return (
    <MainStack.Navigator>
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
}

export default function App() {

  return (
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
          options={{ headerShown: false, cardStyle: { backgroundColor: "transparent" } }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
