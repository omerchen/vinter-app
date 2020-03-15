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

let TransactionsTableScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  const filteredFixtures = fixtures
    ? fixtures.filter(
        fixture => !fixture.isRemoved && fixture.type != FIXTURE_TYPE_FRIENDLY
      )
    : [];

  const TABLE_NAME_COL = 0;
  const TABLE_TOTAL_COL = 1;

  const flexArr = [1, 1];
  const playersTableHead = ["שם השחקן", "מאזן כללי"];

  const playersList = players
    ? players.filter(player => !player.isRemoved)
    : [];

  // STATISTICS CALCULATIONS STARTS HERE (closedMatches.length > 0)

  let playersTableData = playersList
    .map(player => {
      let tableObject = [];
      let total = 0;

      let playerTransactions = player.transactions
        ? player.transactions.filter(t => !t.isRemoved)
        : [];

      for (let i in playerTransactions) {
        total += playerTransactions[i].sum;
      }

      total = total.toFixed(1);
      total += "₪";

      for (let i = 0; i < playersTableHead.length; i++) {
        switch (i) {
          case TABLE_NAME_COL:
            tableObject.push(player.name);
            break;
          case TABLE_TOTAL_COL:
            tableObject.push(total);
            break;
          default:
            tableObject.push("");
        }
      }

      return tableObject;
    })
    .sort(
      (a, b) =>
        parseFloat(
          Math.abs(parseFloat(a[TABLE_TOTAL_COL].split("₪").join("")))
        ) <=
        parseFloat(Math.abs(parseFloat(b[TABLE_TOTAL_COL].split("₪").join(""))))
    );

  if (Platform.OS == "web") {
    playersTableData = mergeSort(
      playersTableData,
      (a, b) =>
        parseFloat(
          Math.abs(parseFloat(a[TABLE_TOTAL_COL].split("₪").join("")))
        ) <=
        parseFloat(Math.abs(parseFloat(b[TABLE_TOTAL_COL].split("₪").join(""))))
    );
  }

  let totalAll = 0;

  for (let i in players) {
    let playerTransactions = players[i].transactions
      ? players[i].transactions.filter(t => !t.isRemoved)
      : [];
    for (let j in playerTransactions) {
      totalAll += playerTransactions[j].sum;
    }
  }

  totalAll = totalAll.toFixed(1) + "₪";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Text style={styles.title}>{totalAll}</Text>
      <Table
        style={{ width: 250 }}
        borderStyle={{ borderWidth: 1, borderColor: Colors.primaryDark }}
      >
        <Row
          data={playersTableHead}
          style={styles.head}
          textStyle={{...styles.text, color: '#fff', fontFamily:"assistant-bold"}}
          flexArr={flexArr}
        />
        {playersTableData.map((rowData, index) => {
          let playerSum = parseFloat(
            playersTableData[index][TABLE_TOTAL_COL].split("₪").join("")
          ).toFixed(1);
          return (
            <Row
              key={index}
              data={rowData}
              textStyle={
                styles.text
              }
              flexArr={flexArr}
              style={
                playerSum != 0
                  ? playerSum > 0
                    ? { backgroundColor: Colors.brightGreen }
                    : { backgroundColor: Colors.brightRed }
                  : {}
              }
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
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 40,
    marginBottom: 30
  }
});

TransactionsTableScreen.navigationOptions = navigationData => {
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

export default TransactionsTableScreen;
