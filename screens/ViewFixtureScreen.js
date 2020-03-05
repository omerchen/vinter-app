import React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import MainButton from "../components/MainButton";
import Colors from "../constants/colors";
import CommonStyles from "../constants/common-styles";

let ViewFixtureScreen = props => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/colorful-logo-200h.png")}
        style={CommonStyles.smallLogo}
      />
      <Text style={CommonStyles.title}>מחזור {props.navigation.getParam('fixtureNumber')}</Text>
        <MainButton
          title="משחקים"
          style={styles.button}
          onPress={() => {
            props.navigation.navigate("ViewFixture");
          }}
        />
        <MainButton
          title="סטטיסטיקה"
          style={styles.button}
          onPress={() => {
            props.navigation.navigate("ViewFixture");
          }}
        />
    </View>
  );
};

ViewFixtureScreen.navigationOptions = navigationData => {
  console.log(navigationData)
  return {headerTitle: "מחזור "+navigationData.navigation.getParam("fixtureNumber")};
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
  },
  button: {
    marginTop: 50
  },
});

export default ViewFixtureScreen;
