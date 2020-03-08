import React, { useState } from "react";
import AppNavigator from "./navigation/AppNavigation";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { createStore, combineReducers } from "redux";
import playersReducer from "./store/reducers/players";
import fixturesReducer from "./store/reducers/fixtures";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";
import { YellowBox, I18nManager } from "react-native";

enableScreens();

// ignore specific warrning messages
YellowBox.ignoreWarnings([
  "componentWillReceiveProps",
  "componentWillUpdate",
  "TimePickerAndroid",
  "DatePickerAndroid",
  "Failed prop type"
]);
I18nManager.forceRTL(true);

const rootReducer = combineReducers({
  players: playersReducer,
  fixtures: fixturesReducer
});
const store = createStore(rootReducer);

const fetchFonts = () => {
  return Font.loadAsync({
    "assistant-bold": require("./assets/fonts/Assistant-Bold.ttf"),
    "assistant-extra-bold": require("./assets/fonts/Assistant-ExtraBold.ttf"),
    "assistant-extra-light": require("./assets/fonts/Assistant-ExtraLight.ttf"),
    "assistant-light": require("./assets/fonts/Assistant-Light.ttf"),
    "assistant-regular": require("./assets/fonts/Assistant-Regular.ttf"),
    "assistant-semi-bold": require("./assets/fonts/Assistant-SemiBold.ttf")
  });
};

let App = props => {
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded)
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setDataLoaded(true);
        }}
        onError={err => {
          console.log(err);
        }}
      />
    );
  else
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
};

export default App;
