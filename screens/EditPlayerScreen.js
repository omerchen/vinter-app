import React, { useState, useCallback, useEffect } from "react";
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
import playerTypeRadio from '../constants/player-type-radio'
import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import {MaterialCommunityIconsHeaderButton} from '../components/HeaderButton'
import Spinner from 'react-native-loading-spinner-overlay';

let EditPlayerScreen = props => {
  let [loading, setLoading] = useState(false)
  let playerId = props.navigation.getParam("playerId");

  const [name, setName] = useState(props.players[playerId].name);
  const [playerType, setPlayerType] = useState(props.players[playerId].type);
  const keyboardOffset = Dimensions.get("window").height > 500 ? 100 : 20;

  const dispatchPlayersEdit = () => {
    let isExist = false;
    for (let i in props.players) {
      if (
        props.players[i].name === name.trim() &&
        props.players[i].id !== playerId &&
        props.players[i].isRemoved === false
      ) {
        isExist = true;
        Alert.alert("אופס!","נראה שכבר קיים במערכת שחקן עם שם זהה", null, {cancelable: true});
        break;
      }
    }
    if (!isExist) {
      let newPlayers = [...props.players];

      for (let i in newPlayers) {
        if (newPlayers[i].id === playerId) {
          newPlayers[i].name = name.trim();
          newPlayers[i].type = playerType;
        }
      }
      setLoading(true)
      DBCommunicator.setPlayers(newPlayers).then(res => {
        if (res.status === 200) {
          props.setPlayers(newPlayers);
          props.navigation.pop();
        } else {
          setLoading(false)
          Alert.alert("תהליך העדכון נכשל", "ודא שהינך מחובר לרשת ונסה שנית", null, {cancelable:true});
        }
      });
    }
  };

  const dispatchPlayersDelete = () => {
    setLoading(true)
    let newPlayers = [...props.players];

    newPlayers[playerId].isRemoved = true
    newPlayers[playerId].removeTime = Date.now()

    DBCommunicator.setPlayers(newPlayers).then(res => {
      if (res.status === 200) {
        props.setPlayers(newPlayers);
        props.navigation.pop();
      } else {
        setLoading(false)
        Alert.alert("תהליך המחיקה נכשל", "ודא שהינך מחובר לרשת ונסה שנית", null, {cancelable:true});
      }
    });
  };

  const showDeleteDialog = useCallback(() => {
    Alert.alert("מחיקת שחקן","האם אתה בטוח שברצונך למחוק את "+props.players[playerId].name+"?",[
      {text: "לא", style: "cancel"},
      {text: "מחק", onPress: dispatchPlayersDelete , style: "destructive"},
    ], {
      cancelable: true,
      
    })
  },[props.players, props.setPlayers, playerId, setLoading])

  useEffect(()=>{
    props.navigation.setParams({
      deletePlayer: showDeleteDialog
    })
  }, [showDeleteDialog])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      <Spinner
          visible={loading}
          textContent={""}
          textStyle={{}}
        />
      <DismissKeyboardView style={styles.container}>
        <SubButton title="ערוך יכולת שחקן" style={{marginBottom:20}} onPress={()=>{
          props.navigation.navigate({
            routeName: "RatePlayer",
            params: {
              playerId: playerId,
              playerName: props.players[playerId].name
            }
          })
        }}/>
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
          initial={props.players[playerId].type}
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

EditPlayerScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "עריכת שחקן",
    headerRight: () => {
      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item
            title="Add Player"
            iconName="delete"
            onPress={navigationData.navigation.getParam("deletePlayer")}
          />
        </HeaderButtons>
      );
    }
  }
}

const mapStateToProps = state => ({ players: state.players });

const mapDispatchToProps = {
  setPlayers: players => ({ type: SET_PLAYERS, newPlayers: players })
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPlayerScreen);
