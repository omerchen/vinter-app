import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
  View,
  Text
} from "react-native";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import TextInput from "react-native-material-textinput";
import { DismissKeyboardView } from "../components/DismissKeyboardView";
import RadioForm from "react-native-simple-radio-button";
import { connect } from "react-redux";
import DBCommunicator from "../helpers/db-communictor";
import { SET_PLAYERS } from "../store/actions/players";

let EditPlayerScreen = props => {
  let playerId = props.navigation.getParam("playerId");
  let player = null;

  for (let i in props.players) {
    if (props.players[i].id === playerId && !props.players[i].isRemoved) {
      player = props.players[i];
      break;
    }
  }

  if (!player) {
    props.navigation.pop();
    return <View></View>;
  }

  const [name, setName] = useState(player.name);
  const [playerType, setPlayerType] = useState(player.type);
  const keyboardOffset = Dimensions.get("window").height > 500 ? 100 : 20;

  const dispatchPlayersEdit = () => {
    let isExist = false;
    for (let i in props.players) {
      if (
        props.players[i].name === name.trim() &&
        props.players[i].id !== player.id &&
        props.players[i].isRemoved === false
      ) {
        isExist = true;
        Alert.alert("כבר קיים במערכת שחקן עם שם זהה");
        break;
      }
    }
    if (!isExist) {
      let newPlayers = [...props.players];

      for (let i in newPlayers) {
        if (newPlayers[i].id === player.id) {
          newPlayers[i].name = name.trim()
          newPlayers[i].type = playerType
        }
      }

      DBCommunicator.setPlayers(newPlayers).then(res => {
        if (res.status === 200) {
          props.setPlayers(newPlayers);
          props.navigation.pop();
        } else {
          Alert.alert("תהליך העדכון נכשל");
        }
      });
    }
  };

  let radio_props = [
    { label: "Standard", value: 0 },
    { label: "Soldier", value: 1 }
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      <DismissKeyboardView style={styles.container}>
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={text => setName(text)}
          fontFamily="assistant-semi-bold"
          marginBottom={30}
          width={200}
          activeColor={Colors.primary}
        />
        <RadioForm
          radio_props={radio_props}
          initial={player.type}
          onPress={value => {
            setPlayerType(value);
          }}
          style={styles.radio}
        />
        <MainButton
          width={250}
          title="שמור שינויים"
          offline={!name}
          onPress={dispatchPlayersEdit}
        />
      </DismissKeyboardView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  radio: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginLeft: -20,
    marginBottom: 20
  }
});

const mapStateToProps = state => ({ players: state.players });

const mapDispatchToProps = {
  setPlayers: players => ({ type: SET_PLAYERS, newPlayers: players })
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPlayerScreen);
