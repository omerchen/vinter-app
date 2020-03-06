import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Colors from "../constants/colors";
import PlatformTouchableFeedback from "./PlatformTouchable";
import { useSelector } from "react-redux";

let PlayerCard = props => {
  let player = useSelector(state => state.players[props.playerId]);
  return (
    <View style={styles.container}>
      <PlatformTouchableFeedback
        onPress={() => {
          props.navigation.navigate({
            routeName: "Player",
            params: {
              playerId: props.playerId
            }
          });
        }}
      >
        <View style={styles.view}>
          <Text style={styles.title}>{player.name}</Text>
          <Text style={styles.subtitle}>
            {player.type == 0 ? "משוחרר" : "חייל"}
          </Text>
        </View>
      </PlatformTouchableFeedback>
    </View>
  );
};

const overflow = Platform.OS=="android"?"hidden":"visible"

const styles = StyleSheet.create({
  container: {
    overflow: overflow,
    borderRadius: 10,
    elevation: 10,
    width: 300,
    height: 100,
    margin: 20
  },
  view: {
    backgroundColor: Colors.primaryBright,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    shadowOpacity: 0.2,
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 25,
    color: Colors.black
  },
  subtitle: {
    fontFamily: "assistant-semi-bold",
    fontSize: 20,
    color: Colors.primary
  }
});

export default PlayerCard;
