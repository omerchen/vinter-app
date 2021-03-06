import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Colors from "../constants/colors";
import PlatformTouchableFeedback from "./PlatformTouchable";
import { useSelector } from "react-redux";
import { SECURE_LEVEL_ADMIN } from "../constants/security-levels";

let TransactionCard = props => {
  let player = useSelector(state => state.players[props.playerId]);
  let transaction = player.transactions[props.transactionId];

  return (
    <View style={styles.container}>
      <PlatformTouchableFeedback
        disabled={Platform.OS=="web"}
        onPress={() => {
          props.navigation.navigate({
            routeName:"RequirePassword",
            params:{
              routeName:"EditTransaction",
              params:{
                playerId: props.playerId,
                transactionId: props.transactionId
              },
              level: SECURE_LEVEL_ADMIN
            }
          })
        }}
      >
        <View style={transaction.sum > 0 ? styles.greenView : styles.redView}>
          <Text style={styles.date}>{transaction.date}</Text>
          <Text style={styles.title}>{transaction.sum + "₪"}</Text>

          <Text style={styles.subtitle}>{transaction.description!=""?transaction.description:" "}</Text>
        </View>
      </PlatformTouchableFeedback>
    </View>
  );
};

const overflow = Platform.OS == "android" ? "hidden" : "visible";

const styles = StyleSheet.create({
  container: {
    overflow: overflow,
    borderRadius: 10,
    elevation: 10,
    width: 300,
    height: 180,
    margin: 20,
    paddingRight:5,
    paddingLeft:5,
  },
  greenView: {
    backgroundColor: Colors.green,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    shadowOpacity: 0.2
  },
  redView: {
    backgroundColor: Colors.red,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    shadowOpacity: 0.2
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 55,
    color: Colors.white
  },
  subtitle: {
    fontFamily: "assistant-semi-bold",
    fontSize: 16,
    color: Colors.black,
    opacity:.6,
    textAlign: "center"
  },
  date: {
    fontFamily: "assistant-bold",
    fontSize: 18,
    color: Colors.black,
    opacity:.6
  }
});

export default TransactionCard;
