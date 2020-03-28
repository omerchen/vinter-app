import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  Dimensions,
  ScrollView
} from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { FIXTURE_TYPE_FRIENDLY } from "../constants/fixture-properties";

let LeagueRecordsScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  const filteredFixtures = fixtures
    ? fixtures.filter(
        fixture => !fixture.isRemoved && fixture.type != FIXTURE_TYPE_FRIENDLY
      )
    : [];


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {filteredFixtures.length == 0 ? (
        <View style={styles.card}>
          <Text style={styles.title}>לא נמצאו נתונים</Text>
          <Text style={styles.subText}>
            ניתן לראות סטטיסטיקה רק עבור שחקנים שהגיעו העונה
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          <Text>Hello world</Text>
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
  dataText: {
    fontFamily: "assistant-bold",
    fontSize: 65,
    color: "#61d4b3",
    textAlign: "center"
  },
  dataText2: {
    fontFamily: "assistant-bold",
    fontSize: 100,
    color: "#fdd365",
    textAlign: "center",
    minWidth: 150
  },
  dataText3: {
    fontFamily: "assistant-bold",
    fontSize: 100,
    color: "#fd2eb3",
    textAlign: "center",
    marginHorizontal: 20,
    minWidth: 100
  },
  dataText4: {
    fontFamily: "assistant-bold",
    fontSize: 100,
    color: "#fb8d62",
    textAlign: "center",
    marginHorizontal: 20,
    minWidth: 100
  },
  dataText5: {
    fontFamily: "assistant-bold",
    fontSize: 40,
    color: "#61d4b3",
    textAlign: "center",
    marginHorizontal: 20,
    minWidth: 300
  },
  dataText6: {
    fontFamily: "assistant-bold",
    fontSize: 70,
    color: "#fdd365",
    textAlign: "center",
    minWidth: 150
  },
  metaText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 18,
    marginTop: -10,
    marginBottom: 12,
    color: Colors.darkGray
  },
  metaText2: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25,
    marginTop: -10,
    marginBottom: 12,
    color: Colors.darkGray
  },
  metaText2op: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25,
    marginTop: 10,
    marginBottom: -15,
    color: Colors.darkGray
  },
  metaText3: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25,
    marginTop: -10,
    marginBottom: 12,
    color: Colors.darkGray
  },
  metaText5: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25,
    marginTop: 0,
    marginBottom: 12,
    color: Colors.darkGray
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 25,
    marginBottom: 10
  },
  subText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 20,
    marginBottom: 10,
    color: Colors.darkGray
  }
});

LeagueRecordsScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "היכל התהילה"
  };
};

export default LeagueRecordsScreen;
