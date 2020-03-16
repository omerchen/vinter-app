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
  TextInput
} from "react-native";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import { DismissKeyboardView } from "../components/DismissKeyboardView";
import RadioForm from "react-native-simple-radio-button";
import { connect, useSelector } from "react-redux";
import DBCommunicator from "../helpers/db-communictor";
import { SET_FIXTURES, setFixtures } from "../store/actions/fixtures";
import {
  fixtureCourtRadio,
  fixtureTypeRadio
} from "../constants/fixture-properties";
import moment from "moment";
import { parseList, parsePreList } from "../helpers/fixture-list-parser";
import Spinner from "react-native-loading-spinner-overlay";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import {
  MaterialIconsHeaderButton,
  MaterialCommunityIconsHeaderButton
} from "../components/HeaderButton";

let inputLength = 250;

let GenerateTeamsScreen = props => {
  let [loading, setLoading] = useState(false);

  let players = useSelector(state => state.players);

  const keyboardOffset = Dimensions.get("window").height > 500 ? 20 : 20;

  const [fixturePreList, setFixturePreList] = useState("");
  const [fixtureList, setFixtureList] = useState("");
  const [fixtureListValidation, setFixtureListValidation] = useState(true);
  let readFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setFixturePreList(clipboardContent);
  };

  let copyFromClipboard = async () => {
    Clipboard.setString(fixtureList);
  };

  let generateTeams = useCallback(() => {
    // TODO: implement later
    if (parsePreList(fixturePreList, players) == null) {
      setFixtureListValidation(false);
      setFixtureList("");
    } else {
      setFixtureListValidation(true);
      setFixtureList("DONE");
    }
  }, [
    players,
    loading,
    setLoading,
    setFixtureList,
    fixturePreList,
    setFixtureListValidation
  ]);

  useEffect(() => {
    props.navigation.setParams({
      convert: generateTeams
    });
  }, [generateTeams]);

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
        <View
          style={{
            flexDirection: "row",
            width: 250,
            justifyContent: "space-evenly"
          }}
        >
          <SubButton title="הדבק לרשימה" onPress={readFromClipboard} />
          <SubButton
            title="נקה רשימה"
            onPress={() => {
              setFixturePreList("");
            }}
          />
        </View>
        <TextInput
          value={fixturePreList}
          onChange={e => {
            setFixturePreList(e.nativeEvent.text);
          }}
          placeholder="רשימת המחזור"
          style={{
            ...styles.listInput,
            ...(fixtureListValidation ? {} : styles.error)
          }}
          numberOfLines={21}
          multiline={true}
        />
        <View
          style={{
            flexDirection: "row",
            width: 250,
            justifyContent: "space-evenly"
          }}
        >
          <SubButton
            title="העתק לרשימה"
            offline={fixtureList == ""}
            onPress={copyFromClipboard}
          />
          <SubButton
            title="נקה רשימה"
            onPress={() => {
              setFixtureList("");
            }}
          />
        </View>
        <TextInput
          value={fixtureList}
          onChange={e => {
            setFixtureList(e.nativeEvent.text);
          }}
          placeholder="הכוחות"
          style={styles.listInput}
          numberOfLines={21}
          multiline={true}
          editable={false}
        />
        <View style={{ height: 50 }} />
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

GenerateTeamsScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "בניית כוחות",
    headerRight: () => {
      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item
            title="Remove Fixture"
            iconName="swap-horizontal"
            onPress={navigationData.navigation.getParam("convert")}
          />
        </HeaderButtons>
      );
    }
  };
};

export default GenerateTeamsScreen;
