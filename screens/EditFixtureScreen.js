import React, { useState, useCallback, useEffect } from "react";
import DatePicker from "react-native-datepicker";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
  View,
  Clipboard,
  TextInput as RNTextInput
} from "react-native";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import TextInput from "react-native-material-textinput";
import { DismissKeyboardView } from "../components/DismissKeyboardView";
import RadioForm from "react-native-simple-radio-button";
import { connect, useSelector } from "react-redux";
import DBCommunicator from "../helpers/db-communictor";
import { SET_FIXTURES, setFixtures } from "../store/actions/fixtures";
import {
  fixtureCourtRadio,
  fixtureTypeRadio,
  fixtureOpenRadio
} from "../constants/fixture-properties";
import moment from "moment";
import { reverseList, parseList } from "../helpers/fixture-list-parser";
import Spinner from "react-native-loading-spinner-overlay";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";

let inputLength = 250;

let EditFixtureScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId");
  const fixture = props.fixtures[fixtureId];
  let [loading, setLoading] = useState(false);
  let lastFixture = null;
  let isOtherFixtureOpen =
    props.fixtures.filter(f => !f.isRemoved && f.isOpen && f.id != fixtureId)
      .length > 0;
  let players = useSelector(state => state.players);
  for (let i in props.fixtures) {
    let ni = props.fixtures.length - i - 1;

    if (!props.fixtures[ni].isRemoved) {
      lastFixture = props.fixtures[ni];
      break;
    }
  }
  const keyboardOffset = Dimensions.get("window").height > 500 ? 20 : 20;

  const [fixtureNumber, setFixtureNumber] = useState(fixture.number);
  const [fixtureCourt, setFixtureCourt] = useState(fixture.court);
  const [fixtureType, setFixtureType] = useState(fixture.type);

  const [fixtureDate, setFixtureDate] = useState(fixture.date);

  const [fixtureTime, setFixtureTime] = useState(fixture.startTime);
  const [fixtureOpenStatus, setFixtureOpenStatus] = useState(
    fixture.isOpen ? 0 : 1
  );

  const [fixtureList, setFixtureList] = useState(
    reverseList(fixture.playersList, players)
  );
  const [fixtureListValidation, setFixtureListValidation] = useState(true);
  let readFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setFixtureList(clipboardContent);
  };
  let updateFixture = () => {
    let parsedFixtureList = parseList(fixtureList, players, playerName => {
      Alert.alert(
        "לא נמצא שחקן בשם: " + playerName,
        "האם תרצה להוסיף את השחקן למאגר?",
        [
          { text: "לא", style: "cancel" },
          {
            text: "כן",
            onPress: () => {
              props.navigation.navigate({
                routeName: "AddPlayer",
                params: {
                  initialName: playerName
                }
              });
            },
            style: "default"
          }
        ],
        { cancelable: true }
      );
    });
    if (parsedFixtureList !== null) {
      setFixtureListValidation(true);

      let updatedFixture = { ...fixture };

      updatedFixture.playersList = parsedFixtureList;

      for (let i in updatedFixture.playersList) {
        if (
          updatedFixture.playersList[i].players[0].id ==
          fixture.playersList[i].players[0].id
        ) {
          updatedFixture.playersList[i].players[0].captainRating =
            fixture.playersList[i].players[0].captainRating;
          updatedFixture.playersList[i].players[0].captainDescription =
            fixture.playersList[i].players[0].captainDescription;
        }
      }

      updatedFixture.number = fixtureNumber;
      updatedFixture.court = fixtureCourt;
      updatedFixture.type = fixtureType;
      updatedFixture.date = fixtureDate;
      updatedFixture.startTime = fixtureTime;
      updatedFixture.isOpen = fixtureOpenStatus != 1;

      let newFixtures = [...props.fixtures];
      newFixtures[fixtureId] = updatedFixture;

      setLoading(true);
      DBCommunicator.setFixtures(newFixtures).then(res => {
        if (res.status === 200) {
          props.setFixtures(newFixtures);
          props.navigation.pop();
        } else {
          setLoading(false);
          Alert.alert(
            "תהליך עדכון המחזור נכשל",
            "ודא שהינך מחובר לרשת ונסה שנית",
            null,
            { cancelable: true }
          );
        }
      });
    } else {
      setFixtureListValidation(false);
    }
  };

  let deleteFixture = useCallback(() => {
    Alert.alert(
      "מחיקת מחזור (" + fixtureId + ")",
      "האם אתה בטוח שברצונך למחוק את מחזור " +
        props.fixtures[fixtureId].number +
        "?",
      [
        { text: "לא", style: "cancel" },
        {
          text: "מחק",
          onPress: () => {
            let newFixture = { ...fixture };
            newFixture.isRemoved = true;
            newFixture.removeTime = Date.now();
            updateFixtures(newFixture);
          },
          style: "destructive"
        }
      ],
      {
        cancelable: true
      }
    );
  }, [props.fixtures, props.setFixtures, fixtureId]);

  useEffect(() => {
    props.navigation.setParams({
      deleteFixture: deleteFixture
    });
  }, [deleteFixture]);

  let updateFixtures = newFixture => {
    setLoading(true);
    let newFixtures = [...props.fixtures];
    newFixtures[fixtureId] = newFixture;

    DBCommunicator.setFixtures(newFixtures).then(res => {
      if (res.status === 200) {
        props.setFixtures(newFixtures);
        props.navigation.pop();
      } else {
        setLoading(false);
        Alert.alert("הפעולה נכשלה", "ודא שהינך מחובר לרשת ונסה שנית", null, {
          cancelable: true
        });
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
          label="מספר מחזור"
          value={fixtureNumber}
          onChangeText={text => setFixtureNumber(text)}
          fontFamily="assistant-semi-bold"
          width={inputLength}
          activeColor={Colors.primary}
          fontSize={20}
          keyboardType="numeric"
          alignText="center"
          labelColor={fixtureNumber !== "" ? Colors.darkGray : Colors.red}
          underlineColor={fixtureNumber !== "" ? Colors.darkGray : Colors.red}
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
        {!isOtherFixtureOpen && (
          <RadioForm
            radio_props={fixtureOpenRadio}
            initial={fixtureOpenStatus}
            onPress={value => {
              setFixtureOpenStatus(value);
            }}
            style={styles.radio}
          />
        )}
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
              setFixtureList("");
            }}
          />
        </View>
        <RNTextInput
          value={fixtureList}
          onChange={e => {
            setFixtureList(e.nativeEvent.text);
          }}
          placeholder="רשימת המחזור"
          style={{
            ...styles.listInput,
            ...(fixtureListValidation ? {} : styles.error)
          }}
          numberOfLines={21}
          multiline={true}
        />
        <MainButton
          width={inputLength}
          style={{ marginBottom: 100 }}
          title="עדכן מחזור"
          onPress={updateFixture}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditFixtureScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "עריכת מחזור",
    headerRight: () => {
      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item
            title="Remove Fixture"
            iconName="delete"
            onPress={navigationData.navigation.getParam("deleteFixture")}
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

const mapStateToProps = state => ({ fixtures: state.fixtures });

const mapDispatchToProps = {
  setFixtures: fixtures => ({ type: SET_FIXTURES, newFixtures: fixtures })
};

export default connect(mapStateToProps, mapDispatchToProps)(EditFixtureScreen);
