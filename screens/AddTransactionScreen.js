import React, { useState } from "react";
import DatePicker from "react-native-datepicker";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
  View,
  Clipboard,
  TextInput as RNTextInput,
  Platform
} from "react-native";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import TextInput from "react-native-material-textinput";
import { connect } from "react-redux";
import DBCommunicator from "../helpers/db-communictor";
import { SET_PLAYERS } from "../store/actions/players";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import { soldierCost, standardCost } from "../constants/configs";

let inputLength = 250;

let AddTransactionScreen = props => {
  let [loading, setLoading] = useState(false);
  const playerId = props.navigation.getParam("playerId");
  let player = props.players[playerId];
  let transactions = player.transactions ? player.transactions : [];
  const keyboardOffset = Dimensions.get("window").height > 500 ? 20 : 20;

  const initialCost = -1 * (player.type == 1 ? soldierCost : standardCost);

  const [transactionSum, setTransactionSum] = useState(initialCost.toString());

  const [date, setDate] = useState(moment(Date.now()).format("DD.MM.YYYY"));

  const [description, setDescription] = useState("");

  let createTransaction = () => {
    let newTransaction = {
      id: transactions.length,
      isRemoved: false,
      createTime: Date.now(),
      description: description,
      sum: parseFloat(transactionSum),
      date: date
    };

    let newTransactions = [...transactions, newTransaction];

    let newPlayer = { ...player };

    newPlayer.transactions = newTransactions;

    let newPlayers = [...props.players];

    newPlayers[playerId] = newPlayer;

    setLoading(true);
    DBCommunicator.setPlayers(newPlayers).then(res => {
      if (res.status === 200) {
        props.setPlayers(newPlayers);
        props.navigation.pop();
      } else {
        setLoading(false);
        Alert.alert(
          "תהליך יצירת הטרנזקציה נכשל",
          "ודא שהינך מחובר לרשת ונסה שנית",
          null,
          { cancelable: true }
        );
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      <Spinner visible={loading} textContent={""} textStyle={{}} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <TextInput
          label="סכום הטרנזקציה"
          value={transactionSum}
          onChangeText={text => setTransactionSum(text)}
          fontFamily="assistant-semi-bold"
          width={inputLength}
          activeColor={Colors.primary}
          fontSize={20}
          keyboardType={Platform.OS=="ios"?"numbers-and-punctuation":"numeric"}
          alignText="center"
          labelColor={transactionSum !== "" ? Colors.darkGray : Colors.red}
          underlineColor={transactionSum !== "" ? Colors.darkGray : Colors.red}
        />
        <DatePicker
          style={{ width: inputLength }}
          date={date}
          mode="date"
          placeholder="תאריך הטרנזקציה"
          format="DD.MM.YYYY"
          minDate="01.01.2000"
          maxDate="31.12.2100"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: "absolute",
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 50,
              borderColor: Colors.white,
              borderBottomColor: Colors.darkGray,
              fontFamily: "assistant-bold"
            },
            dateText: {
              fontFamily: "assistant-semi-bold",
              fontSize: 20
            }
          }}
          onDateChange={date => {
            setDate(date);
          }}
        />
        <TextInput
          label="הערות"
          value={description}
          onChangeText={text => setDescription(text)}
          fontFamily="assistant-semi-bold"
          width={inputLength}
          activeColor={Colors.primary}
          fontSize={20}
          alignText="center"
          labelColor={Colors.darkGray}
          underlineColor={Colors.darkGray}
        />
        <MainButton
          width={inputLength}
          offline={transactionSum == "" || transactionSum == 0 || isNaN(transactionSum)}
          style={{ marginBottom: 100 }}
          title="הוסף טרנזקציה"
          onPress={createTransaction}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 40
  },
  radio: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10
  },
  listInput: {
    borderColor: Colors.gray,
    borderWidth: 1,
    width: inputLength,
    borderRadius: 10,
    fontFamily: "assistant-semi-bold",
    textAlignVertical: "top",
    padding: 10,
    textAlign: "right",
    marginBottom: 20,
    fontSize: 20
  },
  error: {
    borderColor: Colors.red,
    borderWidth: 2
  }
});

const mapStateToProps = state => ({ players: state.players });

const mapDispatchToProps = {
  setPlayers: players => ({ type: SET_PLAYERS, newPlayers: players })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTransactionScreen);
