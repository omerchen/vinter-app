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
import {mergeSort} from "../helpers/mergeSort"

let PreviousFixturesScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);

  const playerId = props.navigation.getParam("playerId");
  const filterByPlayer = playerId!=null&&playerId!=undefined

  if (!fixtures || fixtures.filter(item=>!item.isRemoved).length == 0) {
    props.navigation.pop()
  }

  let filteredFixtures = fixtures?mergeSort(fixtures
  .filter(item => !item.isRemoved && !item.isOpen),(a,b)=>a.id<b.id).filter(item=>{
    if (!filterByPlayer) return true

    for (let i in item.playersList) {
      if (item.playersList[i].players.filter(p=>p.id==playerId).length>0) return true
    }

    return false
  }):[]

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {filteredFixtures.length>0?filteredFixtures.map(fixture => {
          let title = "מחזור "+fixture.number

          if (fixture.type == 1) /*final*/ {
            title += " - גמר"
          } else if (fixture.type == 2) /*friendly*/{
            title += " - ידידות"
          } 
          
          if (fixture.mvpId != undefined && fixture.mvpId != null) {
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
        }):<Text style={{marginTop:50, fontFamily:"assistant-semi-bold", fontSize:25, color: Colors.darkGray}}>לא נמצו מחזורים</Text>}
    </ScrollView>
  );
};

PreviousFixturesScreen.navigationOptions = navigationData => {
  return {
    headerTitle: navigationData.navigation.getParam("playerName")
      ? navigationData.navigation.getParam("playerName")
      : "מחזורים קודמים",
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  }
});

export default PreviousFixturesScreen;
