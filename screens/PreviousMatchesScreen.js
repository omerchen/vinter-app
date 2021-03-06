import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Platform
} from "react-native";
import { useSelector } from "react-redux";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import { shortTeamLabelsArray } from "../helpers/fixture-list-parser";
import { EVENT_TYPE_GOAL } from "../constants/event-types";

let PreviousMatchesScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId");
  const fixtures = useSelector(state => state.fixtures);
  const fixture = fixtures[fixtureId];
  const filteredMatches = fixture.matches?fixture.matches.filter(item => !item.isRemoved && !item.isOpen):[]

  if (filteredMatches.length == 0) {
    props.navigation.pop()
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {filteredMatches
        .map((match, index) => {
          let homeName = shortTeamLabelsArray[match.homeId];
          let awayName = shortTeamLabelsArray[match.awayId];
          let homeResult = match.events
            ? match.events.filter(
                item =>
                  !item.isRemoved &&
                  item.isHome &&
                  item.type === EVENT_TYPE_GOAL
              ).length
            : 0;
          let awayResult = match.events
          ? match.events.filter(
              item =>
                !item.isRemoved &&
                !item.isHome &&
                item.type === EVENT_TYPE_GOAL
            ).length
          : 0;;

          if (homeResult === awayResult && match.winnerId !== null && match.winnerId !== undefined) {
            if (match.homeId === match.winnerId) {
              homeResult = "("+homeResult+")"
            } else {
              awayResult = "("+awayResult+")"
            }
          }

          let title =
            "משחק "+(index+1) + ": " + homeName + " " + homeResult + " - " + awayResult + " " + awayName;
          return (
            <SubButton
              style={{ marginTop: 10, marginBottom: 10 }}
              key={match.id}
              title={title}
              onPress={() => {
                if (Platform.OS =="web") {
                  props.navigation.navigate({
                    routeName: "WebMatch",
                    params: {
                      fixtureId: fixtureId,
                      matchId: match.id
                    }
                  });
                } else {
                  props.navigation.navigate({
                    routeName: "Match",
                    params: {
                      fixtureId: fixtureId,
                      matchId: match.id
                    }
                  });
                }
                
              }}
            />
          );
        })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  }
});

export default PreviousMatchesScreen;
