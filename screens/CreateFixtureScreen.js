import React, { useState } from "react";
import DatePicker from "react-native-datepicker";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
  View
} from "react-native";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import TextInput from "react-native-material-textinput";
import { DismissKeyboardView } from "../components/DismissKeyboardView";
import RadioForm from "react-native-simple-radio-button";
import { connect } from "react-redux";
import DBCommunicator from "../helpers/db-communictor";
import { SET_FIXTURES, setFixtures } from "../store/actions/fixtures";
import {
  fixtureCourtRadio,
  fixtureTypeRadio
} from "../constants/fixture-radio-fields";
import moment from "moment";

let CreateFixtureScreen = props => {
  let lastFixture = null;
  let inputLength = 250;
  for (let i in props.fixtures) {
    let ni = props.fixtures.length - i - 1;

    if (!props.fixtures[ni].isRemoved) {
      lastFixture = props.fixtures[ni];
    }
  }
  const keyboardOffset = Dimensions.get("window").height > 500 ? 100 : 20;

  const [fixtureNumber, setFixtureNumber] = useState(
    lastFixture ? lastFixture.number + 1 : "1"
  );
  const [fixtureCourt, setFixtureCourt] = useState(
    lastFixture ? lastFixture.court : 0
  );
  const [fixtureType, setFixtureType] = useState(0);

  const [fixtureDate, setFixtureDate] = useState(
    moment(Date.now()).format("DD.MM.YYYY")
  );
  const [fixtureTime, setFixtureTime] = useState(
    lastFixture ? lastFixture.startTime : "17:00"
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <TextInput
          label="מספר מחזור"
          value={fixtureNumber}
          onChangeText={text => setFixtureNumber(text)}
          fontFamily="assistant-semi-bold"
          width={inputLength}
          activeColor={Colors.primary}
          fontSize={20}
          keyboardType="numeric"
          alignText="center"
        />
        <DatePicker
          style={{ width: inputLength }}
          date={fixtureDate}
          mode="date"
          placeholder="תאריך המחזור"
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
            setFixtureDate(date);
          }}
        />
        <DatePicker
          style={{ width: inputLength, marginVertical: 10 }}
          date={fixtureTime}
          mode="time"
          placeholder="תאריך המחזור"
          format="HH:mm"
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
            setFixtureTime(date);
          }}
        />
        <RadioForm
          radio_props={fixtureCourtRadio}
          initial={fixtureCourt}
          onPress={value => {
            setFixtureCourt(value);
          }}
          style={styles.radio}
        />
        <RadioForm
          radio_props={fixtureTypeRadio}
          initial={fixtureType}
          onPress={value => {
            setFixtureType(value);
          }}
          style={styles.radio}
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
  }
});

const mapStateToProps = state => ({ fixtures: state.fixtures });

const mapDispatchToProps = {
  setFixtures: fixtures => ({ type: SET_FIXTURES, newFixtures: fixtures })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateFixtureScreen);
