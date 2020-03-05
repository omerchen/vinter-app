import React, { useState } from "react";
import AppNavigator from "./navigation/AppNavigation";
import * as Font from "expo-font";
import { AppLoading } from "expo";

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
        onError={(err) => {
        }}
      />
    );
  else return <AppNavigator />;
};

export default App;
