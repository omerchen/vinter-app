import React from "react";
import { Text, StyleSheet, View, TouchableNativeFeedback } from "react-native";
import Colors from "../constants/colors";

let MainButton = props => {
  return (
    <View style={styles.wrapper}>
      <TouchableNativeFeedback
        style={styles.touchableView}
        onPress={props.onPress}
      >
        <View style={styles.view}>
          <Text style={styles.title}>{props.title}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: Colors.primary,
    height: 50,
    width: 420,
    justifyContent: "center",
    alignItems: "center"
  },
  touchableView: {
    flex: 1,
  },
  wrapper: {
    borderRadius: 5,
    overflow: "hidden"
  },
  title: {
    color: Colors.white,
    fontFamily: "assistant-semi-bold",
    fontSize: 20
  }
});

export default MainButton;
