import React, { useState, useCallback } from "react";
import { StyleSheet, KeyboardAvoidingView, Alert } from "react-native";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import TextInput from "react-native-material-textinput";
import { DismissKeyboardView } from "../components/DismissKeyboardView";
import RadioForm from "react-native-simple-radio-button";
import {connect} from 'react-redux'
import DBCommunicator from '../helpers/db-communictor'
import {SET_PLAYERS} from '../store/actions/players'

let AddPlayerScreen = props => {
  console.log(props)
  const [name, setName] = useState("");
  const [playerType, setPlayerType] = useState(0);

  const dispatchPlayers = () => {
    let isExist = false;
    for (let i in props.players) {
      if (props.players[i].name === name.trim() && props.players[i].isRemoved === false) {
        isExist = true;
        Alert.alert("כבר קיים במערכת שחקן עם שם זהה");
        break;
      }
    }
    if (!isExist) {
      let newPlayer = {
        id: props.players.length,
        isRemoved: false,
        createTime: Date.now(),
        name: name.trim(),
        type: playerType
      };

      let newPlayers = [...props.players, newPlayer]
      console.log("\n\n")
      console.log(newPlayers)
      
      DBCommunicator.setPlayers(newPlayers).then((res)=>{
        if (res.status === 200)
        {
          props.setPlayers(newPlayers)
          props.navigation.pop()
        }
        else
        {
          Alert.alert("תהליך ההוספה נכשל")
        }
      })
    }
  }

  let radio_props = [
    { label: "Standard", value: "standard" },
    { label: "Soldier", value: "soldier" }
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <DismissKeyboardView style={styles.container}>
        {/* <Text>This is the AddPlayerScreen screen!</Text> */}
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
          initial={0}
          onPress={value => {
            setPlayerType(value);
          }}
          style={styles.radio}
        />
        <MainButton
          width={250}
          title="שמור במערכת"
          offline={!name}
          onPress={dispatchPlayers}
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


const mapStateToProps = state => ({ players: state.players })

const mapDispatchToProps = {
  setPlayers: (players) => ({ type: SET_PLAYERS, newPlayers: players})
};


export default connect(mapStateToProps,mapDispatchToProps)(AddPlayerScreen);
