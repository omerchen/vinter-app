import React, { useCallback, useEffect } from "react";
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
  let iconsSize = 36;

  let forward = () => {
    console.log("forward");
  };
  let backward = () => {
    console.log("backward");
  };
  let play = () => {
    console.log("play");
  };
  let pause = () => {
    console.log("pause");
  };
  let end = () => {
    console.log("end");
  };

  const deleteMatch = () => {
    let newFixtures = [...props.fixtures];

    newFixtures[fixtureId].matches[matchId].isRemoved = true;
    newFixtures[fixtureId].matches[matchId].removeTime = Date.now();

    DBCommunicator.setFixtures(newFixtures).then(res => {
      if (res.status === 200) {
        props.setFixtures(newFixtures);
        props.navigation.pop();
      } else {
        Alert.alert(
          "תהליך המחיקה נכשל",
          "ודא שהינך מחובר לרשת ונסה שנית",
          null,
          { cancelable: true }
        );
      }
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
            <Text style={styles.clockText}>04:13</Text>
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
            {true /*TODO: change to real condition */? (
              <TouchableOpacity onPress={play} style={styles.commandView}>
                <AntDesign name="play" size={iconsSize} color={Colors.black} />

                <Text style={styles.commandText}>{false /*TODO: change to real condition */?"התחל":"המשך"}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={play} style={styles.commandView}>
                <AntDesign
                  name="pausecircle"
                  size={iconsSize}
                  color={Colors.black}
                />

                <Text style={styles.commandText}>עצור</Text>
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
        <TouchableOpacity onPress={end} style={styles.endMatchView}>
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
