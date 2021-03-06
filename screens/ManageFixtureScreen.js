import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import { connect } from "react-redux";
import Colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";
import DBCommunicator from "../helpers/db-communictor";
import MainButton from "../components/MainButton";
import { SET_FIXTURES } from "../store/actions/fixtures";
import { Dropdown } from "react-native-material-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import RadioForm from "react-native-simple-radio-button";
import sleep from "../helpers/sleep";
import SubButton from "../components/SubButton";

let ManageFixtureScreen = props => {
  const mvpStatusRadioLabel = [
    { label: "  בחירת מצטיין", value: 0 },
    { label: "  ללא מצטיין", value: 1 }
  ];

  let [loading, setLoading] = useState(false);
  const fixtureId = props.navigation.getParam("fixtureId");
  let fixture = props.fixtures[fixtureId];
  let matches = fixture.matches ? fixture.matches : [];

  if (fixture.isRemoved) {
    sleep(0).then(() => {
      props.navigation.pop();
    });
  }

  // states
  const [mvpId, setMvpId] = useState(fixture.mvpId);
  const [mvpStatus, setMvpStatus] = useState(
    !fixture.isOpen && (fixture.mvpId == null || fixture.mvpId == undefined)
      ? 1
      : 0
  );

  let playersData = [];

  for (let i in fixture.playersList) {
    playersData.push(...fixture.playersList[i].players);
  }

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

  let closeFixture = () => {
    // check that there's no open match
    for (let i in matches) {
      if (!matches[i].isRemoved && matches[i].isOpen) {
        Alert.alert(
          "בעיה בסגירת המחזור",
          "נראה שקיים משחק פתוח במחזור הנוכחי, בשביל לסגור מחזור יש לסיים קודם את כל המשחקים",
          [
            { text: "ביטול", style: "cancel" },
            {
              text: "קח אותי למשחק",
              onPress: () => {
                props.navigation.navigate({
                  routeName: "Match",
                  params: {
                    fixtureId: fixtureId,
                    matchId: i
                  }
                });
              },
              style: "default"
            }
          ],
          {
            cancelable: true
          }
        );
        return;
      }
    }

    let newFixture = { ...fixture };

    if (fixture.isOpen) {
      newFixture.isOpen = false;
      newFixture.endTime = Date.now();
    }

    newFixture.mvpId = mvpStatus == 0 ? mvpId : undefined;

    updateFixtures(newFixture);
  };

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
    <View style={styles.container}>
      <Spinner visible={loading} textContent={""} textStyle={{}} />
      <View style={{ width: 350, alignItems: "center" }}>
        <SubButton title="דרג קפטנים" style={{ marginBottom: 50 }} onPress={()=>{
          props.navigation.navigate({
            routeName: "RateCaptains",
            params: {
              fixtureId: fixtureId
            }
          })
        }} />
        <RadioForm
          radio_props={mvpStatusRadioLabel}
          initial={mvpStatus}
          onPress={value => {
            setMvpStatus(value);
            setMvpId(fixture.mvpId);
          }}
          animation={false}
          style={styles.radio}
          buttonColor={Colors.darkGray}
          selectedButtonColor={Colors.primary}
          labelStyle={{ fontSize: 18, marginTop: 4 }}
        />
        {mvpStatus == 0 && (
          <View style={{ width: "100%" }}>
            <Dropdown
              label="השחקן המצטיין"
              data={playersData.sort(
                (a, b) => props.players[a.id].name > props.players[b.id].name
              )}
              onChangeText={value => {
                setMvpId(value);
              }}
              value={mvpId}
              labelFontSize={20}
              fontSize={25}
              itemCount={6}
              animationDuration={0}
              valueExtractor={item => item.id}
              labelExtractor={item => props.players[item.id].name}
            />
          </View>
        )}
        <MainButton
          offline={(mvpId === null || mvpId === undefined) && mvpStatus == 0}
          title={fixture.isOpen ? "סיים מחזור" : "עדכן מחזור"}
          style={{ marginTop: 20 }}
          width={350}
          onPress={closeFixture}
        />
      </View>
    </View>
  );
};

ManageFixtureScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "ניהול מחזור",
    headerRight: () => {
      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item
            title="Remove Fixture"
            iconName="circle-edit-outline"
            onPress={() => {
              navigationData.navigation.navigate({
                routeName: "EditFixture",
                params: {
                  fixtureId: navigationData.navigation.getParam("fixtureId")
                }
              });
            }}
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
    alignItems: "center",
    justifyContent: "center"
  },
  radio: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: 400
  }
});

const mapStateToProps = state => ({
  fixtures: state.fixtures,
  players: state.players
});

const mapDispatchToProps = {
  setFixtures: fixtures => ({ type: SET_FIXTURES, newFixtures: fixtures })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageFixtureScreen);
