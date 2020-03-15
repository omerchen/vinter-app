import React from "react";
import { StyleSheet, Text, View, Platform, Image } from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView } from "react-native-gesture-handler";
import { shortTeamLabelsArray } from "../helpers/fixture-list-parser";
import { EVENT_TYPE_GOAL, EVENT_TYPE_WALL } from "../constants/event-types";
import { calculatePoints } from "../helpers/rules";
import { FIXTURE_TYPE_FRIENDLY } from "../constants/fixture-properties";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { IoniconsHeaderButton } from "../components/HeaderButton";
import { mergeSort } from "../helpers/mergeSort";

let LeagueTableScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  const filteredFixtures = fixtures
    ? fixtures.filter(
        fixture => !fixture.isRemoved && fixture.type != FIXTURE_TYPE_FRIENDLY
      )
    : [];

  const TABLE_POSITION_COL = 0;
  const TABLE_NAME_COL = 1;
  const TABLE_POINTS_COL = 2;
  const TABLE_APPEARENCES_COL = 3;
  const TABLE_WINS_COL = 4;
  const TABLE_TIES_COL = 5;
  const TABLE_MVP_COL = 6;
  const TABLE_GOAL_COL = 7;
  const TABLE_ASSIST_COL = 8;
  const TABLE_SAVE_COL = 9;
  const TABLE_CAPTAIN_COL = 10;
  const TABLE_CLEAN_COL = -1;
  const flexArr = [1, 1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const playersTableHead = [
    "מקום",
    "שם השחקן",
    "נקודות",
    "הופעות",
    "נצחונות",
    "תיקו",
    "MVP",
    "שערים",
    "בישולים",
    "הצלות",
    "קפטן"
  ];

  const playersList = players
    ? players.filter(player => !player.isRemoved)
    : [];

  // STATISTICS CALCULATIONS STARTS HERE (closedMatches.length > 0)

  let playersTableData = playersList
    .map(player => {
      let tableObject = [];
      let pointsObject = {
        points: 0,
        goals: 0,
        assists: 0,
        saves: 0,
        teamWins: 0,
        appearences: 0,
        cleansheet: 0,
        mvps: 0,
        captain: 0,
        teamTies: 0
      };

      for (let i in filteredFixtures) {
        let currentPointsObject = calculatePoints(
          players,
          fixtures,
          player.id,
          filteredFixtures[i].id
        );

        pointsObject.points = (
          parseFloat(pointsObject.points) +
          parseFloat(currentPointsObject.points)
        ).toFixed(1); // TODO: add punishes + fairplay
        pointsObject.goals += currentPointsObject.goals;
        pointsObject.assists += currentPointsObject.assists;
        pointsObject.saves += currentPointsObject.saves;
        pointsObject.cleansheets += currentPointsObject.cleansheets;
        pointsObject.teamWins += currentPointsObject.teamWin ? 1 : 0;
        pointsObject.teamTies += currentPointsObject.teamTie ? 1 : 0;
        pointsObject.appearences += currentPointsObject.appearence ? 1 : 0;
        pointsObject.mvps += currentPointsObject.mvp ? 1 : 0;
        pointsObject.captain += currentPointsObject.isCaptain ? 1 : 0;
      }

      for (let i = 0; i < playersTableHead.length; i++) {
        switch (i) {
          case TABLE_NAME_COL:
            tableObject.push(player.name);
            break;
          case TABLE_POINTS_COL:
            tableObject.push(pointsObject.points);
            break;
          case TABLE_GOAL_COL:
            tableObject.push(pointsObject.goals);
            break;
          case TABLE_ASSIST_COL:
            tableObject.push(pointsObject.assists);
            break;
          case TABLE_SAVE_COL:
            tableObject.push(pointsObject.saves);
            break;
          case TABLE_WINS_COL:
            tableObject.push(pointsObject.teamWins);
            break;
          case TABLE_TIES_COL:
            tableObject.push(pointsObject.teamTies);
            break;
          case TABLE_MVP_COL:
            tableObject.push(pointsObject.mvps);
            break;
          case TABLE_CAPTAIN_COL:
            tableObject.push(pointsObject.captain);
            break;
          case TABLE_CLEAN_COL:
            tableObject.push(pointsObject.cleansheets);
            break;
          case TABLE_APPEARENCES_COL:
            tableObject.push(pointsObject.appearences);
            break;
          default:
            tableObject.push("");
        }
      }

      return tableObject;
    })
    .sort(
      (a, b) =>
        parseFloat(a[TABLE_POINTS_COL]) <= parseFloat(b[TABLE_POINTS_COL])
    );

  if (Platform.OS == "web") {
    playersTableData = mergeSort(
      playersTableData,
      (a, b) =>
        parseFloat(a[TABLE_POINTS_COL]) <= parseFloat(b[TABLE_POINTS_COL])
    );
  }

  // add position label
  for (let i in playersTableData) {
    playersTableData[i][TABLE_POSITION_COL] = parseInt(i) + 1;
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        {Platform.OS != "web" && (
          <Image
            resizeMode="contain"
            source={require("../assets/images/colorful-logo-280h.png")}
            style={styles.logo}
          />
        )}
      </View>
      <Table
        borderStyle={{ borderWidth: 2, borderColor: Colors.primaryBright }}
      >
        <Row
          data={playersTableHead}
          style={styles.head}
          textStyle={styles.text}
          flexArr={flexArr}
        />
        {playersTableData.map((rowData, index) => {
          return (
            <Row
              key={index}
              data={rowData}
              textStyle={index == 0 && Platform.OS != "web" ? {...styles.text, fontFamily: "assistant-bold"}:styles.text}
              flexArr={flexArr}
              style={index == 0 ? { backgroundColor: "#FDEEBE" } : {}}
            />
          );
        })}
      </Table>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: Colors.primaryBrightest },
  text: { margin: 6, textAlign: "left", fontSize: 14 },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: Colors.white
  },
  tableTitle: {
    fontFamily: "assistant-semi-bold",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20
  },
  logoContainer: {
    alignItems: "center"
  },
  logo: {
    height: 180,
    marginBottom: 30
  }
});

LeagueTableScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "טבלת הליגה",
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="Learn More"
            iconName="md-help"
            onPress={() => navigationData.navigation.navigate("Rules")}
          />
        </HeaderButtons>
      );
    }
  };
};

export default LeagueTableScreen;
