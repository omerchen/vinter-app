import React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { useSelector } from "react-redux";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import FeedbackTouchable from "../components/PlatformTouchable";
import { teamLabelsArray } from "../helpers/fixture-list-parser";

let MatchesScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId");
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  let fixture = fixtures[fixtureId];
  let matches = fixture.matches ? fixture.matches : [];
  let endMatches = matches.filter(item => !item.isRemoved && !item.isOpen);
  let currentMatch = null;

  let calculateWins = teamId => {
    return endMatches.filter(item => item.winnerId === teamId).length;
  };

  let showPlayers = teamId => {
    let title = teamLabelsArray[teamId];

    let teamPlayers = fixture.playersList[teamId].players;

    let teamPlayersDescription = "";
    for (let i in teamPlayers) {
      let playerString = i === 0 ? "" : "\n";

      playerString += players[teamPlayers[i].id].name;

      if (teamPlayers[i].isGoalkeeper) playerString += " (שוער)";

      if (teamPlayers[i].isCaptain) playerString += " (קפטן)";

      teamPlayersDescription += playerString;
    }

    Alert.alert(title, teamPlayersDescription, null, { cancelable: true });
  };

  for (let i in matches) {
    let ni = matches.length - 1 - i;
    if (matches[ni].isOpen && !matches[i].isRemoved) {
      currentMatch = matches[ni];
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.scoreWrapper}>
        <View
          style={{
            ...styles.teamWrapper,
            backgroundColor: Colors.teamBlue.primary
          }}
        >
          <FeedbackTouchable
            style={{ flex: 1 }}
            onPress={showPlayers.bind(this, 0)}
          >
            <View style={styles.teamView}>
              <Text style={styles.teamTitle}>כחולים</Text>
              <Text style={styles.teamScore}>{calculateWins(0)}</Text>
              <Text style={styles.winsText}>נצחונות</Text>
            </View>
          </FeedbackTouchable>
        </View>
        <View
          style={{
            ...styles.teamWrapper,
            backgroundColor: Colors.teamOrange.primary
          }}
        >
          <FeedbackTouchable
            style={{ flex: 1 }}
            onPress={showPlayers.bind(this, 1)}
          >
            <View style={styles.teamView}>
              <Text style={styles.teamTitle}>כתומים</Text>
              <Text style={styles.teamScore}>{calculateWins(1)}</Text>
              <Text style={styles.winsText}>נצחונות</Text>
            </View>
          </FeedbackTouchable>
        </View>
        <View
          style={{
            ...styles.teamWrapper,
            backgroundColor: Colors.teamGreen.primary
          }}
        >
          <FeedbackTouchable
            style={{ flex: 1 }}
            onPress={showPlayers.bind(this, 2)}
          >
            <View style={styles.teamView}>
              <Text style={styles.teamTitle}>ירוקים</Text>
              <Text style={styles.teamScore}>{calculateWins(2)}</Text>
              <Text style={styles.winsText}>נצחונות</Text>
            </View>
          </FeedbackTouchable>
        </View>
      </View>
      <View style={styles.menuWrapper}>
        {currentMatch ? (
          <MainButton title="מעבר למשחק" onPress={()=>{
            //TODO: implement later
          }} />
        ) : (
          <MainButton title="התחל משחק חדש" onPress={()=>{
            props.navigation.navigate({routeName:"CreateMatch", params: {fixtureId: fixtureId}})
          }} />
        )}
        <SubButton
          style={{ marginTop: 30 }}
          offline={endMatches.length === 0}
          title="למשחקים הקודמים"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  menuWrapper: {
    position: "absolute",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50
  },
  scoreWrapper: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-evenly",
    paddingTop: 50
  },
  teamWrapper: {
    borderRadius: 100,
    overflow: "hidden",
    elevation: 10
  },
  teamView: {
    height: 150,
    width: 150,
    justifyContent: "center",
    alignItems: "center"
  },
  teamTitle: {
    fontFamily: "assistant-semi-bold",
    color: Colors.white,
    fontSize: 20
  },
  teamScore: {
    fontFamily: "assistant-extra-bold",
    color: Colors.white,
    fontSize: 50
  },
  winsText: {
    fontFamily: "assistant-regular",
    color: Colors.white,
    fontSize: 15
  }
});

export default MatchesScreen;
