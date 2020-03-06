import React, { useState, useCallback } from "react";
import { StyleSheet, KeyboardAvoidingView, Alert, Dimensions } from "react-native";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import TextInput from "react-native-material-textinput";
import { DismissKeyboardView } from "../components/DismissKeyboardView";
import RadioForm from "react-native-simple-radio-button";
import {connect} from 'react-redux'
import DBCommunicator from '../helpers/db-communictor'
import {SET_FIXTURES} from '../store/actions/fixtures'
import playerTypeRadio from '../constants/player-type-radio'


let CreateFixtureScreen = props => {
  const [name, setName] = useState("");
  const [playerType, setPlayerType] = useState(0);
  const keyboardOffset = Dimensions.get("window").height>500?100:20

  const dispatchPlayers = () => {
    let isExist = false;
    for (let i in props.players) {
      if (props.players[i].name === name.trim() && props.players[i].isRemoved === false) {
        isExist = true;
        Alert.alert("אופס!","נראה שכבר קיים במערכת שחקן עם שם זהה", [], {cancelable: true});
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
      
      DBCommunicator.setPlayers(newPlayers).then((res)=>{
        if (res.status === 200)
        {
          props.setPlayers(newPlayers)
          props.navigation.pop()
        }
        else
        {
          Alert.alert("תהליך ההוספה נכשל", "ודא שהינך מחובר לרשת ונסה שנית", null, {cancelable:true});
        }
      })
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      <DismissKeyboardView style={styles.container}>
        <TextInput
          label="שם מלא"
          value={name}
          onChangeText={text => setName(text)}
          fontFamily="assistant-semi-bold"
          marginBottom={30}
          width={200}
          activeColor={Colors.primary}
        />
        <RadioForm
          radio_props={playerTypeRadio}
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
    marginBottom: 20
  }
});


const mapStateToProps = state => ({ fixtures: state.fixtures })

const mapDispatchToProps = {
  setFixtures: (fixtures) => ({ type: SET_FIXTURES, newFixtures: fixtures})
};


export default connect(mapStateToProps,mapDispatchToProps)(CreateFixtureScreen);
