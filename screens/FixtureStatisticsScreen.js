import React from "react";
import { StyleSheet, Text, View, ColorPropType } from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";

let FixtureStatisticsScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const fixtureId = props.navigation.getParam("fixtureId");
  const fixture = fixtures[fixtureId];
  const matches = fixture.matches ? fixture.matches : [];
  const closedMatches = matches.filter(item => !item.isRemoved && !item.isOpen);

  if (closedMatches.length === 0) {
    return (
      <View style={styles.container}>
        <Text>לא ניתן להציג סטטיסטיקה למחזור זה</Text>
      </View>
    );
  }

  // STATISTICS CALCULATIONS STARTS HERE (closedMatches.length > 0)
  
  return (
    <View style={styles.container}>
      <Text>
        This is the FixtureStatisticsScreen screen! ({closedMatches.length})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default FixtureStatisticsScreen;
