import React from "react";
import { StyleSheet, Text, View, ColorPropType } from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView } from "react-native-gesture-handler";

let FixtureStatisticsScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const fixtureId = props.navigation.getParam("fixtureId");
  const fixture = fixtures[fixtureId];
  const matches = fixture.matches ? fixture.matches : [];
  const closedMatches = matches.filter(item => !item.isRemoved && !item.isOpen);

  const tableHead = ["Head", "Head2", "Head3", "Head4"];
  const tableData = [
    ["1", "2", "3", "4"],
    ["a", "b", "c", "d"],
    ["a", "b", "c", "d"],
    ["1", "2", "3", "4"],
    ["a", "b", "c", "d"],
    ["a", "b", "c", "d"],
    ["1", "2", "3", "4"],
    ["a", "b", "c", "d"],
    ["a", "b", "c", "d"],
    ["1", "2", "3", "4"],
    ["a", "b", "c", "d"],
    ["a", "b", "c", "d"],
    ["1", "2", "3", "4"],
    ["a", "b", "c", "d"],
    ["a", "b", "c", "d"],
    ["1", "2", "3", "4"],
    ["a", "b", "c", "d"],
    ["a", "b", "c", "d"],
    ["1", "2", "3", "4"],
    ["a", "b", "c", "d"],
    ["a", "b", "c", "d"],
  ];

  if (closedMatches.length === 0) {
    return (
      <View style={styles.container}>
        <Text>לא ניתן להציג סטטיסטיקה למחזור זה</Text>
      </View>
    );
  }

  // STATISTICS CALCULATIONS STARTS HERE (closedMatches.length > 0)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.tableTitle}>נתונים אישיים</Text>
      <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
      <View style={{height:50}}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: Colors.white,
  },
  tableTitle: {
    fontFamily: "assistant-semi-bold",
    fontSize:30,
    textAlign:"center",
    marginBottom:20
  }
});

export default FixtureStatisticsScreen;
