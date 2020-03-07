import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";
import DBCommunicator from "../helpers/db-communictor";
import { SET_FIXTURES } from "../store/actions/fixtures";
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";

let MatchScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId");
  const matchId = props.navigation.getParam("matchId");
  let fixture = props.fixtures[fixtureId];
  let match = fixture.matches[matchId];
  console.log(match);
  let iconsSize = 36;

  let calculateClock = () => {
    if (!match.startWhistleTime) {
      return 0;
    } else {
      if (!match.endWhistleTime) {
        return Math.floor((Date.now() - match.startWhistleTime) / 1000);
      } else {
        return Math.floor(
          (match.endWhistleTime - match.startWhistleTime) / 1000
        );
      }
    }
  };

  const [clockTime, setClockTime] = useState(calculateClock());

  // sign up interval for updating the clock every second
  useEffect(() => {
    let interval = setInterval(() => {
      setClockTime(calculateClock());
    }, 200);
    return () => {
      clearInterval(interval);
    };
  }, [match]);

  let pad = (n, width, z) => {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  };

  let parseToString = timeInSeconds => {
    let seconds = timeInSeconds % 60;
    let minutes = (timeInSeconds - seconds) / 60;
    return pad(minutes, 2) + ":" + pad(seconds, 2);
  };

  let forward = () => {
    console.log("forward");
    if (!match.startTime) {
      Alert.alert("אופס!", "עליך קודם כל להתחיל את המשחק", null, {
        cancelable: true
      });
    }
  };
  let backward = () => {
    console.log("backward");
    if (!match.startTime) {
      Alert.alert("אופס!", "עליך קודם כל להתחיל את המשחק", null, {
        cancelable: true
      });
    }
  };
  let play = () => {
    console.log("play");
    if (!match.startTime) {
      let newMatch = { ...match };
      newMatch.startWhistleTime = Date.now();
      newMatch.startTime = newMatch.startWhistleTime;

      updateMatchState(newMatch);
    } else {
      // TODO: complete later
    }
  };
  let pause = () => {
    console.log("pause");
    let newMatch = { ...match };
    newMatch.endWhistleTime = Date.now();

    updateMatchState(newMatch);
  };
  let end = () => {
    console.log("end");
  };

  let showEndDialog = () => {
    Alert.alert(
      "אתה עומד לסיים את המשחק",
      "האם אתה בטוח שהמשחק הסתיים?",
      [
        { text: "עדיין לא", style: "cancel" },
        { text: "שרוק לסיום", onPress: end, style: "destructive" }
      ],
      {
        cancelable: true
      }
    );
  };

  const updateMatchState = (
    newMatch,
    onFinish = () => {
      console.log("update finished successfully!");
    }
  ) => {
    let newFixtures = [...props.fixtures];

    newFixtures[fixtureId].matches[matchId] = newMatch;

    DBCommunicator.setFixtures(newFixtures).then(res => {
      if (res.status === 200) {
        props.setFixtures(newFixtures);
        onFinish();
      } else {
        Alert.alert("הפעולה נכשלה", "ודא שהינך מחובר לרשת ונסה שנית", null, {
          cancelable: true
        });
      }
    });
  };

  const deleteMatch = () => {
    let newMatch = { ...match };
    newMatch.isRemoved = true;
    newMatch.removeTime = Date.now();

    updateMatchState(newMatch, () => {
      props.navigation.pop();
    });
  };

  const showDeleteDialog = useCallback(() => {
    Alert.alert(
      "מחיקת משחק",
      "האם אתה בטוח שברצונך למחוק את המשחק הנוכחי?",
      [
        { text: "לא", style: "cancel" },
        { text: "מחק", onPress: deleteMatch, style: "destructive" }
      ],
      {
        cancelable: true
      }
    );
  }, [props.fixtures, props.setFixtures, fixtureId]);

  useEffect(() => {
    props.navigation.setParams({
      deleteMatch: showDeleteDialog
    });
  }, [showDeleteDialog]);

  return (
    <View style={styles.container}>
      <View style={styles.timeLayer}>
        <View style={styles.timeView}>
          <View style={styles.clockWrapper}>
            <Text style={styles.clockText}>{parseToString(clockTime)}</Text>
          </View>
          <View style={styles.commandsWrapper}>
            <TouchableOpacity onPress={forward} style={styles.commandView}>
              <MaterialIcons
                name="forward-30"
                size={iconsSize}
                color={Colors.black}
              />
              <Text style={styles.commandText}>קדימה</Text>
            </TouchableOpacity>
            {match.startWhistleTime && !match.endWhistleTime ? (
              <TouchableOpacity onPress={pause} style={styles.commandView}>
                <AntDesign
                  name="pausecircle"
                  size={iconsSize}
                  color={Colors.black}
                />

                <Text style={styles.commandText}>עצור</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={play} style={styles.commandView}>
                <AntDesign name="play" size={iconsSize} color={Colors.black} />

                <Text style={styles.commandText}>
                  {match.startTime ? "המשך" : "התחל"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={backward} style={styles.commandView}>
              <MaterialIcons
                name="replay-30"
                size={iconsSize}
                color={Colors.black}
              />

              <Text style={styles.commandText}>אחורה</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={showEndDialog} style={styles.endMatchView}>
          <MaterialCommunityIcons
            name="whistle"
            size={iconsSize}
            color={Colors.black}
          />
          <Text style={styles.endMatchText}>שרוק לסיום!</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gameLayer}></View>
      <Text>
        This is the MatchScreen screen! ({fixture.number + "," + matchId})
      </Text>
    </View>
  );
};

MatchScreen.navigationOptions = navigationData => {
  let refresh = navigationData.navigation.getParam("refresh");

  return {
    headerTitle: "דף משחק",
    headerRight: () => {
      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item
            title="Add Player"
            iconName="delete"
            onPress={navigationData.navigation.getParam("deleteMatch")}
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
  timeLayer: {
    position: "absolute",
    zIndex: 99,
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  timeView: {
    backgroundColor: Colors.primaryBright,
    height: 180,
    width: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  clockWrapper: {},
  clockText: {
    fontFamily: "assistant-bold",
    fontSize: 60
  },
  commandsWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%"
  },
  commandView: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1
  },
  commandText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 20
  },
  endMatchView: {
    backgroundColor: Colors.primaryBright,
    height: 120,
    width: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  endMatchText: {
    fontFamily: "assistant-bold",
    fontSize: 20
  },
  gameLayer: {}
});

const mapStateToProps = state => ({
  fixtures: state.fixtures,
  players: state.players
});

const mapDispatchToProps = {
  setFixtures: fixtures => ({ type: SET_FIXTURES, newFixtures: fixtures })
};

export default connect(mapStateToProps, mapDispatchToProps)(MatchScreen);
