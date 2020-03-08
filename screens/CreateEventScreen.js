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
import RadioForm from "react-native-simple-radio-button";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";
import DBCommunicator from "../helpers/db-communictor";
import MainButton from "../components/MainButton";
import { SET_FIXTURES } from "../store/actions/fixtures";
import { Dropdown } from "react-native-material-dropdown";
import { eventTypesRadio, EVENT_TYPE_GOAL } from "../constants/event-types";

let CreateEventScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId");
  const isHome = props.navigation.getParam("isHome");
  const time = props.navigation.getParam("time");
  const matchId = props.navigation.getParam("matchId");
  let fixture = props.fixtures[fixtureId];
  let match = fixture.matches[matchId];
  let executerTitles= ["כובש השער","מבצע ההצלה","מבצע העבירה","מבצע העבירה"]

  // states
  const [eventType, setEventType] = useState(EVENT_TYPE_GOAL);
  const [eventExecuterId, setEventExecuterId] = useState(null);
  const [eventHelperId, setEventHelperId] = useState(null);

  console.log(
    "type: " +
      eventType +
      ", executerId:" +
      (eventExecuterId === null ? "-" : eventExecuterId) +
      ", helperId:" +
      (eventHelperId === null ? "-" : eventHelperId)
  );

  let playersData = [];

  for (let i in fixture.playersList) {
    playersData.push(...fixture.playersList[i].players);
  }

  return (
    <View style={styles.container}>
      <RadioForm
        radio_props={eventTypesRadio}
        initial={0}
        onPress={value => {
          setEventType(value)
          setEventHelperId(null)
        }}
        animation={false}
        style={styles.radio}
        buttonColor={Colors.darkGray}
        selectedButtonColor={Colors.primary}
        labelStyle={{ fontSize: 18, marginTop: 4 }}
      />
      <View style={{ width: 450 }}>
        <Dropdown
          label={executerTitles[eventType]}
          data={playersData.sort(
            (a, b) => props.players[a.id].name > props.players[b.id].name
          )}
          onChangeText={value => {
            setEventExecuterId(value)
          }}
          labelFontSize={20}
          fontSize={25}
          itemCount={6}
          animationDuration={0}
          valueExtractor={item => item.id}
          labelExtractor={item => props.players[item.id].name}
        />
        {eventType===EVENT_TYPE_GOAL&&<Dropdown
          label="מבשל השער"
          data={playersData.sort(
            (a, b) => props.players[a.id].name > props.players[b.id].name
          )}
          onChangeText={value => {
            setEventHelperId(value)
          }}
          labelFontSize={20}
          fontSize={25}
          itemCount={6}
          animationDuration={0}
          valueExtractor={item => item.id}
          containerStyle={{ marginTop: 25 }}
          labelExtractor={item => props.players[item.id].name}
          error={eventHelperId!==null&&eventHelperId===eventExecuterId}
        />}
        <MainButton offline={eventExecuterId===null||(eventType===EVENT_TYPE_GOAL&&eventHelperId!==null&&eventHelperId===eventExecuterId)} title="הוסף אירוע" style={{ marginTop: 20 }} width={450} />
      </View>
    </View>
  );
};

CreateEventScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "הוספת אירוע חדש"
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
  radio: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: 500,
    marginBottom: 25
  }
});

const mapStateToProps = state => ({
  fixtures: state.fixtures,
  players: state.players
});

const mapDispatchToProps = {
  setFixtures: fixtures => ({ type: SET_FIXTURES, newFixtures: fixtures })
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEventScreen);
