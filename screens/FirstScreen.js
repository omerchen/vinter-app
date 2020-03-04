import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import MainButton from '../components/MainButton'
import SubButton from '../components/SubButton'
import Colors from '../constants/colors'

let FirstScreen = props => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/colorful-logo-280h.png")} style={styles.logo}/>
      <MainButton
        title="מחזור חדש"
        onPress={() => {
          props.navigation.navigate("CreateFixture");
        }}
      />
      <SubButton
        title="למחזורים הקודמים"
        onPress={() => {
          props.navigation.navigate("PreviousFixtures");
          console.log(props);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  logo: {
      height: 140,
      resizeMode: 'contain',
  },
});

export default FirstScreen;
