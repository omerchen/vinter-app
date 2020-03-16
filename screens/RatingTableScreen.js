import React from "react";
import { StyleSheet, Text, View, Platform, Image } from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { Table, Row, Rows, Col } from "react-native-table-component";
import { ScrollView } from "react-native-gesture-handler";
import { shortTeamLabelsArray } from "../helpers/fixture-list-parser";
import { EVENT_TYPE_GOAL, EVENT_TYPE_WALL } from "../constants/event-types";
import { calculatePoints } from "../helpers/rules";
import { FIXTURE_TYPE_FRIENDLY } from "../constants/fixture-properties";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { IoniconsHeaderButton } from "../components/HeaderButton";
import { mergeSort } from "../helpers/mergeSort";

let RatingTableScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  const filteredFixtures = fixtures
    ? fixtures.filter(
        fixture => !fixture.isRemoved && fixture.type != FIXTURE_TYPE_FRIENDLY
      )
    : [];

  const TABLE_NAME_COL = 0;
  const TABLE_AVG_COL = 1;
  const TABLE_ATT_COL = 2;
  const TABLE_DEF_COL = 3;

  const flexArr = [2, 1, 1, 1];
  const playersTableHead = ["שם השחקן", "ממוצע", "התקפה", "הגנה"];

  const playersList = players
    ? players.filter(player => !player.isRemoved)
    : [];

  // STATISTICS CALCULATIONS STARTS HERE (closedMatches.length > 0)

  const noRatingString = "חסר";

  let playersTableData = playersList
    .map(player => {
      let tableObject = [];
      let cpCounter = 0;
      let ratingCounter = 0;
      let ratingSum = 0;

      let captainObjects = [];

      for (let i = 0; i < playersTableHead.length; i++) {
        switch (i) {
          case TABLE_NAME_COL:
            tableObject.push(player.name);
            break;
          case TABLE_AVG_COL:
            tableObject.push(
              player.attackRating == null ||
                player.attackRating == undefined ||
                player.defenseRating == null ||
                player.defenseRating == undefined
                ? noRatingString
                : (player.attackRating + player.defenseRating) / 2
            );
            break;
          case TABLE_ATT_COL:
            tableObject.push(
              player.attackRating == null || player.attackRating == undefined
                ? noRatingString
                : player.attackRating
            );
            break;
          case TABLE_DEF_COL:
            tableObject.push(
              player.defenseRating == null || player.defenseRating == undefined
                ? noRatingString
                : player.defenseRating
            );
            break;
          default:
            tableObject.push("");
        }
      }

      return tableObject;
    })
    .sort((a, b) => {
      if (a[TABLE_AVG_COL] == noRatingString) return true;
      if (b[TABLE_AVG_COL] == noRatingString) return false;

      return parseFloat(a[TABLE_AVG_COL]) <= parseFloat(b[TABLE_AVG_COL]);
    });

  return (
    <View
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
      </Table>
      <ScrollView style={{marginTop:-1,maxWidth: 350, width: "90%" }}>
        <Table
          style={{ maxWidth: 350}}
          borderStyle={{ borderWidth: 1, borderColor: Colors.primaryDark }}
        >
          {playersTableData.map((rowData, index) => {
            return (
              <Row
                key={index}
                data={rowData}
                textStyle={styles.text}
                flexArr={flexArr}
                style={
                  isNaN(playersTableData[index][TABLE_AVG_COL])
                    ? { backgroundColor: "yellow" }
                    : {}
                }
              />
            );
          })}
        </Table>
      </ScrollView>
      <View style={{ height: 50 }} />
    </View>
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
    backgroundColor: Colors.white,
    alignItems:"center"
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

RatingTableScreen.navigationOptions = navigationData => {
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

export default RatingTableScreen;
