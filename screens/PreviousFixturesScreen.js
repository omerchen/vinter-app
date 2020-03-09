import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import { useSelector } from "react-redux";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import { shortTeamLabelsArray } from "../helpers/fixture-list-parser";

let PreviousFixturesScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);

  if (!fixtures || fixtures.filter(item=>!item.isRemoved).length == 0) {
    props.navigation.pop()
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {fixtures
        .filter(item => !item.isRemoved && !item.isOpen).sort((a,b)=>a.id<b.id)
        .map(fixture => {
          let title = "מחזור "+fixture.number

          if (fixture.type == 1) /*final*/ {
            title += " - גמר"
          } else if (fixture.type == 2) /*friendly*/{
            title += " - ידידות"
          } else if (fixture.mvpId) {
            title += " ("+players[fixture.mvpId].name+")"
          }

          return (
            <SubButton
              style={{ marginTop: 10, marginBottom: 10 }}
              key={fixture.id}
              title={title}
              onPress={() => {
                props.navigation.navigate({
                  routeName: "ViewFixture",
                  params: {
                    fixtureId: fixture.id,
                  }
                });
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

export default PreviousFixturesScreen;
