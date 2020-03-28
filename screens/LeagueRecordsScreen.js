import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { FIXTURE_TYPE_FRIENDLY } from "../constants/fixture-properties";
import { calculateRecords } from "../helpers/records-calculator";

let LeagueRecordsScreen = props => {
  const COLOR_SET = ["#61d4b3", "#fdd365", "#fd2eb3", "#fb8d62"];
  const getColor = index => COLOR_SET[index % COLOR_SET.length];
  let currentColorIndex = 0;
  const getNextColor = () => {
    currentColorIndex += 1;
    return getColor(currentColorIndex - 1);
  };

  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  let records = calculateRecords(players, fixtures);
  const filteredFixtures = fixtures
    ? fixtures.filter(
        fixture => !fixture.isRemoved && fixture.type != FIXTURE_TYPE_FRIENDLY
      )
    : [];

  let lastFixture =
    filteredFixtures.length == 0
      ? null
      : filteredFixtures[filteredFixtures.length - 1];

  const generateFixturePlayerRecordComponent = (data, title) => {
    return (
      data && (
        <View
          style={
            lastFixture.id == data.fixtureId ? styles.hotCard : styles.card
          }
        >
          <Text style={styles.title}>{title}</Text>

          <View style={styles.row}>
            <View>
              <Text
                style={{
                  fontFamily: "assistant-bold",
                  fontSize: 75,
                  color: getNextColor(),
                  textAlign: "center"
                }}
              >
                {data.value}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate({
                      routeName: "Player",
                      params: {
                        playerId: data.playerId
                      }
                    });
                  }}
                >
                  <Text style={styles.metaText}>
                    {players[data.playerId].name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate({
                      routeName: "ViewFixture",
                      params: {
                        fixtureId: data.fixtureId,
                        fixtureNumber: fixtures[data.fixtureId].number
                      }
                    });
                  }}
                >
                  <Text style={styles.metaText}>
                    {"מחזור " + fixtures[data.fixtureId].number}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    );
  };

  const generatePlayerRecordComponent = (data, title) => {
    return (
      data && (
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.row}>
            <View>
              <Text
                style={{
                  fontFamily: "assistant-bold",
                  fontSize: 60,
                  color: getNextColor(),
                  textAlign: "center"
                }}
              >
                {data.value}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate({
                    routeName: "Player",
                    params: {
                      playerId: data.playerId
                    }
                  });
                }}
              >
                <Text style={styles.metaText}>
                  {players[data.playerId].name}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    );
  };

  const generateMatchRecordComponent = (data, title) => {
    return (
      data && (
        <View
          style={
            lastFixture.id == data.fixtureId ? styles.hotCard : styles.card
          }
        >
          <Text style={styles.title}>{title}</Text>

          <View style={styles.row}>
            <View>
              <Text
                style={{
                  fontFamily: "assistant-bold",
                  fontSize: 50,
                  color: getNextColor(),
                  textAlign: "center"
                }}
              >
                {data.value}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate({
                      routeName: "ViewFixture",
                      params: {
                        fixtureId: data.fixtureId,
                        fixtureNumber: fixtures[data.fixtureId].number
                      }
                    });
                  }}
                >
                  <Text style={styles.metaText}>
                    {"מחזור " + fixtures[data.fixtureId].number}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate({
                      routeName: Platform.OS == "web" ? "WebMatch" : "Match",
                      params: {
                        fixtureId: data.fixtureId,
                        matchId: data.matchId
                      }
                    });
                  }}
                >
                  <Text style={styles.metaText}>{"למשחק >"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    );
  };

  const generateFixtureRecordComponent = (data, title) => {
    return (
      data && (
        <View
          style={
            lastFixture.id == data.fixtureId ? styles.hotCard : styles.card
          }
        >
          <Text style={styles.title}>{title}</Text>

          <View style={styles.row}>
            <View>
              <Text
                style={{
                  fontFamily: "assistant-bold",
                  fontSize: 75,
                  color: getNextColor(),
                  textAlign: "center"
                }}
              >
                {data.value}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate({
                      routeName: "ViewFixture",
                      params: {
                        fixtureId: data.fixtureId,
                        fixtureNumber: fixtures[data.fixtureId].number
                      }
                    });
                  }}
                >
                  <Text style={styles.metaText}>
                    {"מחזור " + fixtures[data.fixtureId].number}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {filteredFixtures.length == 0 ? (
        <View style={styles.card}>
          <Text style={styles.title}>לא נמצאו נתונים</Text>
          <Text style={styles.subText}>
            נראה שהעונה עוד לא התחילה ולכן היכל התהילה ריק
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          {/* Fixture-Player Records */}
          {generateFixturePlayerRecordComponent(
            records.fixturePlayerRecord.mostGoals,
            "הכי הרבה שערים לשחקן במחזור"
          )}
          {generateFixturePlayerRecordComponent(
            records.fixturePlayerRecord.mostAssists,
            "הכי הרבה בישולים לשחקן במחזור"
          )}
          {generateFixturePlayerRecordComponent(
            records.fixturePlayerRecord.mostPoints,
            "הכי הרבה נקודות לשחקן במחזור"
          )}
          {generateFixturePlayerRecordComponent(
            records.fixturePlayerRecord.mostSaves,
            "הכי הרבה הצלות לשחקן במחזור"
          )}
          {generateFixturePlayerRecordComponent(
            records.fixturePlayerRecord.mostSavesGk,
            "הכי הרבה הצלות לשוער במחזור"
          )}
          {/* Player Records */}
          {generatePlayerRecordComponent(
            records.playerRecords.mostPointsAvg,
            "ממוצע נקודות למחזור"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.mostWinnerAvg,
            "אחוז נצחונות במשחקונים"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.mostGoalsAvg,
            "ממוצע שערים למחזור"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.mostGoalsForAvg,
            "ממוצע שערי זכות למחזור"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.mostAssistsAvg,
            "ממוצע בישולים למחזור"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.mostSavesAvg,
            "ממוצע הצלות למחזור (שחקן)"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.mostSavesGkAvg,
            "ממוצע הצלות למחזור (שוער)"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.mostCleansheetAvg,
            "ממוצע שערים נקיים למחזור (שחקן)"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.mostCleansheetGkAvg,
            "ממוצע שערים נקיים למחזור (שוער)"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.leastGoalsAgainstAvg,
            "ממוצע ספיגות למחזור (שחקן)"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.leastGoalsAgainstGkAvg,
            "ממוצע ספיגות למחזור (שוער)"
          )}
          {generatePlayerRecordComponent(
            records.playerRecords.penaltyKing,
            "מלך דו קרב הפנדלים"
          )}
          {/* Match Records */}
          {generateMatchRecordComponent(
            records.matchRecords.longestMatch,
            "המשחק הארוך ביותר"
          )}
          {generateMatchRecordComponent(
            records.matchRecords.fastestMatch,
            "המשחק הקצר ביותר"
          )}
          {/* Fixture Records */}
          {generateFixtureRecordComponent(
            records.fixtureRecords.biggestWin,
            "ניצחון המחזור הגדול ביותר"
          )}
          {generateFixtureRecordComponent(
            records.fixtureRecords.mostGoals,
            "הכי הרבה שערים במחזור"
          )}
          {generateFixtureRecordComponent(
            records.fixtureRecords.leastGoals,
            "הכי מעט שערים במחזור"
          )}
          {generateFixtureRecordComponent(
            records.fixtureRecords.mostPenalties,
            "הכי הרבה פנדלים במחזור"
          )}
        </View>
      )}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.brightGray
  },
  card: {
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    maxWidth: "92%",
    width: 500,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  hotCard: {
    backgroundColor: Colors.white,
    borderColor: 'gold',
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    maxWidth: "92%",
    width: 500,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  text: {
    fontFamily: "assistant-light",
    fontSize: 25,
    color: Colors.black
  },
  dataView: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 20
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    alignItems: "center"
  },
  col: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center"
  },
  metaText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 22,
    marginHorizontal: 10,
    marginBottom: 12,
    color: Colors.darkGray,
    alignSelf: "center"
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 23
  }
});

LeagueRecordsScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "היכל התהילה"
  };
};

export default LeagueRecordsScreen;
