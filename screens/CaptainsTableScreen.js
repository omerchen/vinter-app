import React from "react";
import { StyleSheet, Text, View, Platform, Image } from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { Table, Row, Rows, Col } from "react-native-table-component";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { shortTeamLabelsArray } from "../helpers/fixture-list-parser";
import { EVENT_TYPE_GOAL, EVENT_TYPE_WALL } from "../constants/event-types";
import { calculatePoints } from "../helpers/rules";
import { FIXTURE_TYPE_FRIENDLY } from "../constants/fixture-properties";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { IoniconsHeaderButton } from "../components/HeaderButton";
import { mergeSort } from "../helpers/mergeSort";

let CaptainsTableScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  const filteredFixtures = fixtures
    ? fixtures.filter(
        fixture => !fixture.isRemoved && fixture.type != FIXTURE_TYPE_FRIENDLY
      )
    : [];

  const TABLE_NAME_COL = 0;
  const TABLE_CP_TIMES_COL = 1;
  const TABLE_CP_RATING_COL = 2;

  const flexArr = [1, 1, 1];
  const playersTableHead = ["שם השחקן", "הופעות כקפטן", "ציון ממוצע"];

  const playersList = players
    ? players.filter(player => !player.isRemoved)
    : [];

  // STATISTICS CALCULATIONS STARTS HERE (closedMatches.length > 0)

  const noRatingString = "לא מדורג";

  let playersTableData = playersList
    .map(player => {
      let tableObject = [];
      let cpCounter = 0;
      let ratingCounter = 0;
      let ratingSum = 0;

      let captainObjects = [];

      for (let i in fixtures) {
        if (fixtures[i].isRemoved) continue

        for (let j in fixtures[i].playersList) {
          if (fixtures[i].playersList[j].players[0].id == player.id) {
            cpCounter += 1;

            if (
              fixtures[i].playersList[j].players[0].captainRating != null &&
              fixtures[i].playersList[j].players[0].captainRating != undefined
            ) {
              ratingCounter +=1
              ratingSum += fixtures[i].playersList[j].players[0].captainRating
            }
          }
        }
      }

      for (let i = 0; i < playersTableHead.length; i++) {
        switch (i) {
          case TABLE_NAME_COL:
            tableObject.push(<TouchableOpacity onPress={()=>{
              props.navigation.navigate({
                routeName:"Player",
                params: {
                  playerId: player.id
                }
              })
            }}>
              <Text style={styles.text}>{player.name}</Text>
            </TouchableOpacity>)
            break;
          case TABLE_CP_TIMES_COL:
            tableObject.push(cpCounter);
            break;
          case TABLE_CP_RATING_COL:
            tableObject.push(
              ratingCounter > 0
                ? (ratingSum / ratingCounter).toFixed(1)
                : noRatingString
            );
            break;
          default:
            tableObject.push("");
        }
      }

      return tableObject;
    })
    .sort((a, b) => {
      if (a[TABLE_CP_RATING_COL] == noRatingString) return true
      if (b[TABLE_CP_RATING_COL] == noRatingString) return false
      if (parseFloat(a[TABLE_CP_RATING_COL])==parseFloat(b[TABLE_CP_RATING_COL]))
        return a[TABLE_CP_TIMES_COL]<=b[TABLE_CP_TIMES_COL]

      return parseFloat(a[TABLE_CP_RATING_COL])<=parseFloat(b[TABLE_CP_RATING_COL])
    });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Table
        style={{ maxWidth: 350, width: "90%" }}
        borderStyle={{ borderWidth: 1, borderColor: Colors.primaryDark }}
      >
        <Row
          data={playersTableHead}
          style={styles.head}
          textStyle={{
            ...styles.text,
            color: "#fff",
            fontFamily: "assistant-bold"
          }}
          flexArr={flexArr}
        />
        {playersTableData.map((rowData, index) => {
          return (
            <Row
              key={index}
              data={rowData}
              textStyle={styles.text}
              flexArr={flexArr}
              style={{}}
            />
          );
        })}
      </Table>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: Colors.primary },
  text: {
    margin: 6,
    textAlign: "left",
    fontSize: 16,
    fontFamily: "assistant-bold"
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
    height: 180,
    marginBottom: 30
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 40,
    marginBottom: 30
  }
});

CaptainsTableScreen.navigationOptions = navigationData => {
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

export default CaptainsTableScreen;
