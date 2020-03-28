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
import {calculateRecords} from '../helpers/records-calculator'

let LeagueRecordsScreen = props => {
  const COLOR_SET = ["#61d4b3", "#fdd365", "#fd2eb3", "#fb8d62"];
  const getColor = index => COLOR_SET[index%COLOR_SET.length]

  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  let records = calculateRecords(players, fixtures)
  const filteredFixtures = fixtures
    ? fixtures.filter(
        fixture => !fixture.isRemoved && fixture.type != FIXTURE_TYPE_FRIENDLY
      )
    : [];

  const generateFixturePlayerRecordComponent = (data, color, title) => {
    return (
      data && (
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.row}>
            <View>
              <Text
                style={{
                  fontFamily: "assistant-bold",
                  fontSize: 75,
                  color: color,
                  textAlign: "center"
                }}
              >
                {data.value}
              </Text>
              <View style={{ flexDirection: "row" }}>
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
          {generateFixturePlayerRecordComponent(
            records.fixturePlayerRecord.mostGoals,
            getColor(0),
            "הכי הרבה שערים לשחקן במחזור"
          )}
          {generateFixturePlayerRecordComponent(
            records.fixturePlayerRecord.mostAssists,
            getColor(1),
            "הכי הרבה בישולים לשחקן במחזור"
          )}
          {generateFixturePlayerRecordComponent(
            records.fixturePlayerRecord.mostPoints,
            getColor(2),
            "הכי הרבה נקודות לשחקן במחזור"
          )}
          {generateFixturePlayerRecordComponent(
            records.fixturePlayerRecord.mostSaves,
            getColor(3),
            "הכי הרבה הצלות לשחקן במחזור"
          )}
          {generateFixturePlayerRecordComponent(
            records.fixturePlayerRecord.mostSavesGk,
            getColor(4),
            "הכי הרבה הצלות לשוער במחזור"
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
    minHeight: 200,
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
    flexWrap: "wrap"
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
    color: Colors.darkGray
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
