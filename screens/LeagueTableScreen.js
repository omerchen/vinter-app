import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  Dimensions
} from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { shortTeamLabelsArray } from "../helpers/fixture-list-parser";
import { EVENT_TYPE_GOAL, EVENT_TYPE_WALL } from "../constants/event-types";
import { calculatePoints, RULES_EXTRA_POINT } from "../helpers/rules";
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
  const TABLE_EXTRA_POINTS_COL = 10;
  const TABLE_CLEAN_COL = -1;

  const [orderBy, setOrderBy] = useState(TABLE_POSITION_COL);

  const flexArr = [1, 1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  let playersTableHead = [
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
    "נלווה"
  ];

  playersTableHead = playersTableHead.map((title, index) => {
    return (
      <TouchableOpacity
        disabled={index == orderBy}
        onPress={() => {
          setOrderBy(index);
        }}
      >
        <Text style={orderBy == index ? styles.textLight : styles.textBold}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  });

  const playersList = players
    ? players.filter(player => !player.isRemoved)
    : [];

  // STATISTICS CALCULATIONS STARTS HERE (closedMatches.length > 0)
  let playersTableData = mergeSort(
    playersList.map(player => {
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
        teamTies: 0,
        extraPoints: 0
      };

      if (player.extraPoints != null && player.extraPoints != undefined) {
        let filteredExtraPoints = player.extraPoints.filter(e => !e.isRemoved);

        for (let i in filteredExtraPoints) {
          pointsObject.points = (
            parseFloat(pointsObject.points) +
            parseFloat(filteredExtraPoints[i].sum * RULES_EXTRA_POINT)
          ).toFixed(1);

          pointsObject.extraPoints = (
            parseFloat(pointsObject.extraPoints) +
            parseFloat(filteredExtraPoints[i].sum * RULES_EXTRA_POINT)
          ).toFixed(1);
        }
      }

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
        ).toFixed(1);
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
            tableObject.push(
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate({
                    routeName: "Player",
                    params: {
                      playerId: player.id
                    }
                  });
                }}
              >
                <Text style={styles.text}>{player.name}</Text>
              </TouchableOpacity>
            );
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
          case TABLE_EXTRA_POINTS_COL:
            tableObject.push(pointsObject.extraPoints);
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
    }),
    (a, b) => {
      if (orderBy == TABLE_NAME_COL) {
        return a[orderBy].props.children.props.children > b[orderBy].props.children.props.children
      }
      if (orderBy == TABLE_POSITION_COL) {
        return parseFloat(a[TABLE_POINTS_COL]) < parseFloat(b[TABLE_POINTS_COL]);
      }
      return parseFloat(a[orderBy]) < parseFloat(b[orderBy]);
    }
  );

  // add position label
  for (let i in playersTableData) {
    playersTableData[i][TABLE_POSITION_COL] = 1;

    for (let j in playersTableData) {
      if (parseFloat(playersTableData[i][TABLE_POINTS_COL]) < parseFloat(playersTableData[j][TABLE_POINTS_COL])) {
        playersTableData[i][TABLE_POSITION_COL] += 1
      }

    }
  }
  return (
    <View style={styles.container}>
      {Platform.OS == "android" && (
        <View style={styles.logoContainer}>
          <Image
            resizeMode="contain"
            source={require("../assets/images/colorful-logo-200h.png")}
            style={styles.logo}
          />
        </View>
      )}
      <Table
        borderStyle={{ borderWidth: 2, borderColor: Colors.primaryBright }}
      >
        <Row
          data={playersTableHead}
          style={styles.head}
          textStyle={styles.text}
          flexArr={flexArr}
        />
      </Table>
      <ScrollView style={{ marginTop: -2 }}>
        <Table
          borderStyle={{ borderWidth: 2, borderColor: Colors.primaryBright }}
        >
          {playersTableData.map((rowData, index) => {
            let isFirst = rowData[TABLE_POSITION_COL] == 1
            return (
              <Row
                key={index}
                data={rowData}
                textStyle={
                  isFirst && Platform.OS != "web"
                    ? { ...styles.text, fontFamily: "assistant-bold" }
                    : styles.text
                }
                flexArr={flexArr}
                style={isFirst ? { backgroundColor: "#FDEEBE" } : {}}
              />
            );
          })}
        </Table>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: Colors.primaryBrightest },
  text: {
    margin: 6,
    textAlign: "left",
    fontSize: 14,
    fontFamily: "assistant-semi-bold"
  },
  textLight: {
    margin: 6,
    textAlign: "left",
    fontSize: 14,
    fontFamily: "assistant-bold"
  },
  textBold: {
    margin: 6,
    textAlign: "left",
    fontSize: 14,
    fontFamily: "assistant-semi-bold"
  },
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
    height: 120,
    width: 120,
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
