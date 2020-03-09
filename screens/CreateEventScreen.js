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
import {
  eventTypesRadio,
  EVENT_TYPE_GOAL,
  EVENT_TYPE_YELLOW,
  EVENT_TYPE_SECOND_YELLOW
} from "../constants/event-types";
import Spinner from 'react-native-loading-spinner-overlay';

let CreateEventScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId");
  const isHome = props.navigation.getParam("isHome");
  const time = props.navigation.getParam("time");
  const matchId = props.navigation.getParam("matchId");
  let fixture = props.fixtures[fixtureId];
  let match = fixture.matches[matchId];
  let events = match.events ? match.events : [];
  let executerTitles = [
    "כובש השער",
    "מבצע ההצלה",
    "מבצע העבירה",
    "מבצע העבירה"
  ];
  let [loading,setLoading] = useState(false)

  // states
  const [eventType, setEventType] = useState(EVENT_TYPE_GOAL);
  const [eventExecuterId, setEventExecuterId] = useState(null);
  const [eventHelperId, setEventHelperId] = useState(null);

  let playersData = [];

  for (let i in fixture.playersList) {
    playersData.push(...fixture.playersList[i].players);
  }

  let isYellowed = playerId => {
    let officialMatches = fixture.matches.filter(item=>!item.isRemoved)
    let yellowCounter = 0
    for (let i in officialMatches) {
      let currentEvents = officialMatches[i].events
      yellowCounter += countYellows(playerId, currentEvents?currentEvents:[])
    }
    return yellowCounter % 2 === 1
  };

  let countYellows = (playerId , events) => {
    let yellowCounter = events.filter(
      item =>
        !item.isRemoved &&
        item.executerId === playerId &&
        (item.type === EVENT_TYPE_YELLOW ||
          item.type === EVENT_TYPE_SECOND_YELLOW)
    ).length;

    return yellowCounter;
  }

  let addNewEvent = () => {
    let actualEventType = eventType

    if (eventType === EVENT_TYPE_YELLOW && isYellowed(eventExecuterId))
    {
      actualEventType = EVENT_TYPE_SECOND_YELLOW
    }

    let newEvent = {
      id: events.length,
      isRemoved: false,
      isHome: isHome,
      time: time,
      createTime: Date.now(),
      type: actualEventType,
      executerId: eventExecuterId,
      helperId: eventHelperId,
    }

    updateFixtures(newEvent)
  }

  let updateFixtures = newEvent => {
    setLoading(true)
    let newFixtures = [...props.fixtures];
    if (newFixtures[fixtureId].matches[matchId].events) {
      newFixtures[fixtureId].matches[matchId].events.push(newEvent);
    } else {
      newFixtures[fixtureId].matches[matchId].events =[newEvent];
    }

    DBCommunicator.setFixtures(newFixtures).then(res => {
      if (res.status === 200) {
        props.setFixtures(newFixtures);
        props.navigation.pop()
      } else {
        setLoading(false)
        Alert.alert("הפעולה נכשלה", "ודא שהינך מחובר לרשת ונסה שנית", null, {
          cancelable: true
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <Spinner
          visible={loading}
          textContent={""}
          textStyle={{}}
        />
      <RadioForm
        radio_props={eventTypesRadio}
        initial={0}
        onPress={value => {
          setEventType(value);
          setEventHelperId(null);
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
            setEventExecuterId(value);
          }}
          labelFontSize={20}
          fontSize={25}
          itemCount={6}
          animationDuration={0}
          valueExtractor={item => item.id}
          labelExtractor={item => {
            let label = props.players[item.id].name;

            if (eventType === EVENT_TYPE_YELLOW && isYellowed(item.id)) {
              label += " (מוצהב)";
            }

            return label;
          }}
        />
        {eventType === EVENT_TYPE_GOAL && (
          <Dropdown
            label="מבשל השער"
            data={playersData.sort(
              (a, b) => props.players[a.id].name > props.players[b.id].name
            )}
            onChangeText={value => {
              setEventHelperId(value);
            }}
            labelFontSize={20}
            fontSize={25}
            itemCount={6}
            animationDuration={0}
            valueExtractor={item => item.id}
            containerStyle={{ marginTop: 25 }}
            labelExtractor={item => props.players[item.id].name}
            error={eventHelperId !== null && eventHelperId === eventExecuterId}
          />
        )}
        <MainButton
          offline={
            eventExecuterId === null ||
            (eventType === EVENT_TYPE_GOAL &&
              eventHelperId !== null &&
              eventHelperId === eventExecuterId)
          }
          title="הוסף אירוע"
          style={{ marginTop: 20 }}
          width={450}
          onPress={addNewEvent}
        />
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
