import React from "react";
import {
  View,
  Text,
  StyleSheet} from "react-native";
import Colors from "../constants/colors";
import PlatformTouchableFeedback from "./PlatformTouchable"
import {useSelector} from 'react-redux'

let PlayerCard = props => {
  let player = useSelector(state=>state.players[props.playerId])
  return (
    <View style={styles.container}>
      <PlatformTouchableFeedback
        onPress={() => {
          props.navigation.navigate({
            routeName: "Player",
            params: {
              playerId: props.playerId,
            }
          })
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

const styles = StyleSheet.create({
  container: {
    overflow:"hidden",
    borderRadius: 10,
    elevation: 10,
    width: 300,
    height: 100,
    marginVertical: 20,
  },
  view: {
    backgroundColor: Colors.primaryBright,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
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
