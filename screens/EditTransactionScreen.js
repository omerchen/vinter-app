import React, { useState, useEffect, useCallback } from "react";
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
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";

let inputLength = 250;

let EditTransactionScreen = props => {
  let [loading, setLoading] = useState(false);
  const playerId = props.navigation.getParam("playerId");
  const transactionId = props.navigation.getParam("transactionId");
  let player = props.players[playerId];
  let transactions = player.transactions ? player.transactions : [];
  let transaction = transactions[transactionId];
  const keyboardOffset = Dimensions.get("window").height > 500 ? 20 : 20;

  const [transactionSum, setTransactionSum] = useState(
    transaction.sum.toString()
  );

  const [date, setDate] = useState(transaction.date);

  const [description, setDescription] = useState(transaction.description);

  let createTransaction = () => {
    let newTransaction = { ...transaction };
    newTransaction.sum = parseFloat(transactionSum);
    newTransaction.date = date;
    newTransaction.description = description;

    let newTransactions = [...transactions];

    newTransactions[transactionId] = newTransaction;

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
          "תהליך עדכון הטרנזקציה נכשל",
          "ודא שהינך מחובר לרשת ונסה שנית",
          null,
          { cancelable: true }
        );
      }
    });
  };

  let deleteTransaction = useCallback(() => {
    Alert.alert(
      "מחיקת טרנזקציה (" + transactionId + ")",
      "האם אתה בטוח שברצונך למחוק את הטרנזקציה הנוכחית?",
      [
        { text: "לא", style: "cancel" },
        {
          text: "מחק",
          onPress: () => {
            let newTransaction = { ...transaction };
            newTransaction.isRemoved = true;
            newTransaction.removeTime = Date.now();

            let newTransactions = [...transactions];

            newTransactions[transactionId] = newTransaction;

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
                  "תהליך מחיקת הטרנזקציה נכשל",
                  "ודא שהינך מחובר לרשת ונסה שנית",
                  null,
                  { cancelable: true }
                );
              }
            });
          },
          style: "destructive"
        }
      ],
      {
        cancelable: true
      }
    );
  }, [props.players, props.setPlayers, playerId, transactionId]);

  useEffect(() => {
    props.navigation.setParams({
      deleteTransaction: deleteTransaction
    });
  }, [deleteTransaction]);

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
          keyboardType={
            Platform.OS == "ios" ? "numbers-and-punctuation" : "numeric"
          }
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
          offline={
            transactionSum == "" || transactionSum == 0 || isNaN(transactionSum)
          }
          style={{ marginBottom: 100 }}
          title="הוסף טרנזקציה"
          onPress={createTransaction}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditTransactionScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "עריכת טרנזקציה",
    headerRight: () => {
      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item
            title="Remove Transaction"
            iconName="delete"
            onPress={navigationData.navigation.getParam("deleteTransaction")}
          />
        </HeaderButtons>
      );
    }
  };
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
)(EditTransactionScreen);
