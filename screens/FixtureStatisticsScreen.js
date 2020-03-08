import React from "react";
import { StyleSheet, Text, View, ColorPropType } from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView } from "react-native-gesture-handler";
import { shortTeamLabelsArray } from "../helpers/fixture-list-parser";
import { EVENT_TYPE_GOAL, EVENT_TYPE_WALL } from "../constants/event-types";

let FixtureStatisticsScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  const fixtureId = props.navigation.getParam("fixtureId");
  const fixture = fixtures[fixtureId];
  const matches = fixture.matches ? fixture.matches : [];
  const closedMatches = matches.filter(item => !item.isRemoved && !item.isOpen);

  const TABLE_TEAM_COL = 0;
  const TABLE_NAME_COL = 1;
  const TABLE_GOAL_COL = 2;
  const TABLE_ASSIST_COL = 3;
  const TABLE_CLEAN_COL = 4;
  const TABLE_SAVE_COL = 5;
  const TABLE_POINTS_COL = 6;

  const tableHead = [
    "קבוצה",
    "שם השחקן",
    "שערים",
    "בישולים",
    "שער נקי",
    "הצלות גדולות",
    "צבירת נקודות"
  ];
  const playersList = [];
  for (let i in fixture.playersList) {
    playersList.push(
      ...fixture.playersList[i].players.map(item => {
        return { ...item, team: i };
      })
    );
  }

  if (closedMatches.length === 0) {
    return (
      <View style={styles.container}>
        <Text>לא ניתן להציג סטטיסטיקה למחזור זה</Text>
      </View>
    );
  }

  // STATISTICS CALCULATIONS STARTS HERE (closedMatches.length > 0)

  const getTeam = playerObject => {
    return shortTeamLabelsArray[playerObject.team];
  };

  const getName = playerObject => {
    let name = players[playerObject.id].name;
    if (playerObject.isCaptain) {
      name += " (C)";
    }
    if (playerObject.isGoalkeeper) {
      name += " (GK)";
    }
    return name;
  };

  const getGoals = playerObject => {
    let counter = 0;
    for (let i in closedMatches) {
      counter += closedMatches[i].events
        ? closedMatches[i].events.filter(
            item =>
              !item.isRemoved &&
              item.executerId === playerObject.id &&
              item.type === EVENT_TYPE_GOAL
          ).length
        : 0;
    }
    return counter;
  };

  const getAssists = playerObject => {
    let counter = 0;
    for (let i in closedMatches) {
      counter += closedMatches[i].events
        ? closedMatches[i].events.filter(
            item =>
              !item.isRemoved &&
              item.helperId === playerObject.id &&
              item.type === EVENT_TYPE_GOAL
          ).length
        : 0;
    }
    return counter;
  };
  const getCleanSheet = playerObject => {
    let counter = 0;

    // count at home
    counter += closedMatches
      .filter(match => match.homeId == playerObject.team)
      .filter(match =>
        match.events
          ? match.events.filter(
              event =>
                !event.isRemoved &&
                !event.isHome &&
                event.type == EVENT_TYPE_GOAL
            ).length == 0
          : true
      ).length;

    // count aWAY
    counter += closedMatches
      .filter(match => match.awayId == playerObject.team)
      .filter(match =>
        match.events
          ? match.events.filter(
              event =>
                !event.isRemoved &&
                event.isHome &&
                event.type == EVENT_TYPE_GOAL
            ).length == 0
          : true
      ).length;
    return counter;
  };
  const getSaves = playerObject => {
    let counter = 0;
    for (let i in closedMatches) {
      counter += closedMatches[i].events
        ? closedMatches[i].events.filter(
            item =>
              !item.isRemoved &&
              item.executerId === playerObject.id &&
              item.type === EVENT_TYPE_WALL
          ).length
        : 0;
    }
    return counter;
  };
  const getPoints = playerObject => {
    return 0;
  };

  const tableData = playersList.map(playerObject => {
    let tableObject = [];

    for (let i = 0; i < tableHead.length; i++) {
      switch (i) {
        case TABLE_TEAM_COL:
          tableObject.push(getTeam(playerObject));
          break;
        case TABLE_NAME_COL:
          tableObject.push(getName(playerObject));
          break;
        case TABLE_GOAL_COL:
          tableObject.push(getGoals(playerObject));
          break;
        case TABLE_ASSIST_COL:
          tableObject.push(getAssists(playerObject));
          break;
        case TABLE_CLEAN_COL:
          tableObject.push(getCleanSheet(playerObject));
          break;
        case TABLE_SAVE_COL:
          tableObject.push(getSaves(playerObject));
          break;
        case TABLE_POINTS_COL:
          tableObject.push(getPoints(playerObject));
          break;
        default:
          tableObject.push("");
      }
    }

    return tableObject;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.tableTitle}>נתונים אישיים</Text>
      <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6, textAlign: "left" },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: Colors.white
  },
  tableTitle: {
    fontFamily: "assistant-semi-bold",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20
  }
});

export default FixtureStatisticsScreen;
