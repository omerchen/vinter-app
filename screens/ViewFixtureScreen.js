import React from "react";
import { StyleSheet, Image, ScrollView, Text, Platform, Dimensions } from "react-native";
import MainButton from "../components/MainButton";
import Colors from "../constants/colors";
import CommonStyles from "../constants/common-styles";

let ViewFixtureScreen = props => {
  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }} style={styles.container}>
      {Dimensions.get("window").height>500&&<Image
        source={require("../assets/images/colorful-logo-200h.png")}
        style={CommonStyles.smallLogo}
      />}
      
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
          style={{...styles.button,marginBottom:100}}
          onPress={() => {
            props.navigation.navigate("ViewFixture");
          }}
        />
    </ScrollView>
  );
};

ViewFixtureScreen.navigationOptions = navigationData => {
  return {headerTitle: "מחזור "+navigationData.navigation.getParam("fixtureNumber")};
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  button: {
    marginTop: 30,
    marginBottom: 20
  },
});

export default ViewFixtureScreen;
