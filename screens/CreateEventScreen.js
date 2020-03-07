import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import { connect } from "react-redux";
import Colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";
import DBCommunicator from "../helpers/db-communictor";

import { SET_FIXTURES } from "../store/actions/fixtures";
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { FootballIcon, footballIconTypes } from "../components/FootballIcon";

let CreateEventScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId");
  const isHome = props.navigation.getParam("isHome");
  const time = props.navigation.getParam("time");
  const matchId = props.navigation.getParam("matchId");
  let fixture = props.fixtures[fixtureId];
  let match = fixture.matches[matchId];

  return (
    <View style={styles.container}>
      <Text>side={isHome?"home":"away"}, time={time}, fixtureId={fixtureId}, matchId={matchId}</Text>
    </View>
  );
};

CreateEventScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "הוספת אירוע חדש",
    // headerRight: () => {
    //   return (
    //     <HeaderButtons
    //       HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
    //     >
    //       <Item
    //         title="Add Player"
    //         iconName="delete"
    //         onPress={}
    //       />
    //     </HeaderButtons>
    //   );
    // }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
});

const mapStateToProps = state => ({
  fixtures: state.fixtures,
  players: state.players
});

const mapDispatchToProps = {
  setFixtures: fixtures => ({ type: SET_FIXTURES, newFixtures: fixtures })
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEventScreen);
