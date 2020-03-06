import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import Colors from "../constants/colors";
import { connect } from "react-redux";
import { SET_PLAYERS } from "../store/actions/players";
import moment from "moment"

let PlayerSreen = props => {
  let player = props.navigation.getParam("player");
  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.text}><Text style={styles.categoryText}>סטטוס:</Text> <Text style={styles.valueText}>{player.type==0?"רגיל":"חייל"}</Text></Text>
        <Text style={styles.text}><Text style={styles.categoryText}>תאריך הוספה למערכת:</Text> <Text style={styles.valueText}>{moment(player.createTime).format("DD.MM.YYYY hh:mm:ss")}</Text></Text>
      </View>
    </View>
  );
};

PlayerSreen.navigationOptions = navigationData => {
  return {
    headerTitle: navigationData.navigation.getParam("player").name
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingTop: 40
  },
  textView: {

  },
  text: {
    fontSize:20
  },
  categoryText: {
    fontFamily: "assistant-regular",
  },
  valueText: {
    fontFamily: "assistant-semi-bold",
  }
});

const mapStateToProps = state => ({ players: state.players });

const mapDispatchToProps = {
  setPlayers: players => ({ type: SET_PLAYERS, newPlayers: players })
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerSreen);
