import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  Vibration,
  ImageBackground
} from "react-native";
import { connect } from "react-redux";
import Colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";
import DBCommunicator from "../helpers/db-communictor";
import { mergeSort } from "../helpers/mergeSort";
import {
  EVENT_TYPE_GOAL,
  EVENT_TYPE_RED,
  EVENT_TYPE_SECOND_YELLOW,
  EVENT_TYPE_WALL,
  EVENT_TYPE_YELLOW
} from "../constants/event-types";
import { SET_FIXTURES } from "../store/actions/fixtures";
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { FootballIcon, footballIconTypes } from "../components/FootballIcon";
import { teamLabelsArray } from "../helpers/fixture-list-parser";
import { liveRequestInterval, maxLiveRequests } from "../constants/configs";
import dbCommunictor from "../helpers/db-communictor";

let WebMatchScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId");
  const matchId = props.navigation.getParam("matchId");
  let fixture = props.fixtures[fixtureId];
  let match = fixture.matches[matchId];
  const vestArray = [
    require("../assets/images/blue_vest-250h.png"),
    require("../assets/images/orange_vest-250h.png"),
    require("../assets/images/green_vest-250h.png")
  ];
  const colorsArray = [Colors.teamBlue, Colors.teamOrange, Colors.teamGreen];
  let iconsSize = 36;
  let plusSize = 80;
  let vestPadding = 100;
  let removable = fixture.isOpen;
  let editable = fixture.isOpen && match.isOpen;
  let isOtherMathcesOpen = fixture.matches
    ? fixture.matches.filter(m => !m.isRemoved && m.id != matchId && m.isOpen)
        .length > 0
    : false;

  let calculateClock = () => {
    if (!match.startWhistleTime) {
      return 0;
    } else {
      if (!match.endWhistleTime) {
        return Math.floor((Date.now() - match.startWhistleTime) / 1000);
      } else {
        return Math.floor(
          (match.endWhistleTime - match.startWhistleTime) / 1000
        );
      }
    }
  };

  if (match.isRemoved) {
    props.navigation.pop()
  }

  const [clockTime, setClockTime] = useState(calculateClock());

  // sign up interval for updating the clock every second
  useEffect(() => {
    let interval = setInterval(() => {
      setClockTime(calculateClock());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [match.startWhistleTime, match.endWhistleTime]);

  let pad = (n, width, z) => {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  };

  let parseToString = timeInSeconds => {
    let seconds = timeInSeconds % 60;
    let minutes = (timeInSeconds - seconds) / 60;
    return pad(minutes, 2) + ":" + pad(seconds, 2);
  };

  let createEventComponent = (type, time, description, eventId) => {
    let title = "";
    let icon = null;
    switch (type) {
      case EVENT_TYPE_GOAL:
        title = "גול! ";
        icon = footballIconTypes.goal;
        break;
      case EVENT_TYPE_RED:
        title = "כרטיס אדום! ";
        icon = footballIconTypes.red;
        break;
      case EVENT_TYPE_YELLOW:
        title = "כרטיס צהוב ";
        icon = footballIconTypes.yellow;
        break;
      case EVENT_TYPE_SECOND_YELLOW:
        title = "צהוב שני! ";
        icon = footballIconTypes.second_yellow;
        break;
      case EVENT_TYPE_WALL:
        title = "הצלה גדולה! ";
        icon = footballIconTypes.wall;
        break;
      default:
        return null;
    }

    return (
      <View style={styles.eventView} key={eventId}>
        <FootballIcon source={icon} />
        <Text style={styles.regularText}>{parseToString(time)}</Text>
        <Text style={styles.boldText}>{title}</Text>
        <Text style={styles.regularText}>{description}</Text>
      </View>
    );
  };

  // EVENT CALCULATIONS

  let events = match.events ? match.events : [];

  let homeEvents = events.filter(item => !item.isRemoved && item.isHome);
  let awayEvents = events.filter(item => !item.isRemoved && !item.isHome);

  let renderEvents = events => {
    return mergeSort(events, (a, b) => a.time > b.time).map(item => {
      let desctiption = props.players[item.executerId].name;

      if (item.helperId) {
        desctiption += " (" + props.players[item.helperId].name + ")";
      }
      return createEventComponent(item.type, item.time, desctiption, item.id);
    });
  };

  let homeEventsComponent = renderEvents(homeEvents);
  let awayEventsComponent = renderEvents(awayEvents);

  let homeResult = homeEvents.filter(item => item.type === EVENT_TYPE_GOAL)
    .length;

  let awayResult = awayEvents.filter(item => item.type === EVENT_TYPE_GOAL)
    .length;

  let homeResultStyle =
    match.winnerId === match.homeId
      ? { fontFamily: "assistant-extra-bold" }
      : match.winnerId === match.awayId
      ? { fontFamily: "assistant-semi-bold", color: Colors.gray }
      : {};
  let awayResultStyle =
    match.winnerId === match.homeId
      ? { fontFamily: "assistant-semi-bold", color: Colors.gray }
      : match.winnerId === match.awayId
      ? { fontFamily: "assistant-extra-bold" }
      : {};

  const updateMatchState = (
    newMatch,
    onFinish = () => {
      console.log("update finished successfully!");
    }
  ) => {
    let newFixtures = [...props.fixtures];

    newFixtures[fixtureId].matches[matchId] = newMatch;

    DBCommunicator.setFixtures(newFixtures).then(res => {
      if (res.status === 200) {
        props.setFixtures(newFixtures);
        onFinish();
      } else {
        Alert.alert("הפעולה נכשלה", "ודא שהינך מחובר לרשת ונסה שנית", null, {
          cancelable: true
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeLayer}>
        <View style={styles.timeView}>
          <View style={styles.clockWrapper}>
            <Text style={styles.clockText}>{parseToString(clockTime)}</Text>
            {match.isOpen ? (
              match.startWhistleTime == null ||
              match.startWhistleTime == undefined ? (
                <Text style={styles.commandText}>המשחק עוד לא התחיל</Text>
              ) : match.endWhistleTime != null &&
                match.endWhistleTime != undefined ? (
                <Text style={styles.commandText}>המשחק נעצר</Text>
              ) : null
            ) : (
              <Text style={styles.commandText}>המשחק הסתיים</Text>
            )}
          </View>
        </View>
        <View style={styles.border} />
      </View>
      <View style={styles.gameLayer}>
        <View style={styles.teamView}>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: 20,
              paddingEnd: vestPadding
            }}
          >
            <ImageBackground
              resizeMode="contain"
              source={vestArray[match.homeId]}
              style={styles.vestImage}
            />
            <Text
              style={{
                fontFamily: "assistant-bold",
                fontSize: 60,
                ...homeResultStyle
              }}
            >
              {homeResult}
            </Text>
          </View>
          <View style={styles.eventsView}>{homeEventsComponent}</View>
        </View>
        <View style={styles.teamView}>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: 20,
              paddingStart: vestPadding
            }}
          >
            <ImageBackground
              resizeMode="contain"
              source={vestArray[match.awayId]}
              style={styles.vestImage}
            />
            <Text
              style={{
                fontFamily: "assistant-bold",
                fontSize: 60,
                ...awayResultStyle
              }}
            >
              {awayResult}
            </Text>
          </View>
          <View style={styles.eventsView}>{awayEventsComponent}</View>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: -10,
          justifyContent: "flex-end",
          alignItems: "center"
        }}
      >
        <ImageBackground
          resizeMode="contain"
          style={{ opacity: 0.4, height: 150, marginBottom: 40, width: 150 }}
          source={require("../assets/images/colorful-logo-200h.png")}
        />
      </View>
    </View>
  );
};

WebMatchScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "דף משחק"
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  timeLayer: {
    zIndex: 10,
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  timeView: {
    backgroundColor: Colors.primaryBright,
    height: 150,
    width: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  clockWrapper: {
    alignItems: "center"
  },
  clockText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 60,
    textAlign: "center"
  },
  commandsWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%"
  },
  commandView: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1
  },
  commandText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 20,
    textAlign: "center"
  },
  endMatchView: {
    backgroundColor: Colors.primary,
    height: 120,
    width: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  endMatchText: {
    fontFamily: "assistant-bold",
    fontSize: 20,
    color: Colors.white
  },
  border: {
    width: 1,
    flex: 1,
    backgroundColor: Colors.gray,
    opacity: 0.7,
    marginBottom: 250
  },
  gameLayer: {
    zIndex: -1,
    flexDirection: "row",
    flex: 1,
    width: "100%"
  },
  teamView: {
    width: "50%",
    alignItems: "center",
    zIndex: -1
  },
  teamHeaderView: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20
  },
  resultText: {
    fontFamily: "assistant-bold",
    fontSize: 60
  },
  eventsView: {
    width: "100%",
    alignItems: "flex-start",
    paddingStart: 20,
    flex: 1
  },
  vestImage: {
    height: 150,
    width: 100,
    marginTop: 20
  },
  addView: {
    backgroundColor: Colors.black,
    marginBottom: 30,
    marginHorizontal: 30,
    height: 120,
    marginTop: -150,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    elevation: 10,
    backgroundColor: Colors.darkGray
  },
  eventView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  eventTextView: {
    flexDirection: "row"
  },
  regularText: {
    fontSize: 20,
    marginStart: 15,
    fontFamily: "assistant-semi-bold"
  },
  boldText: {
    fontSize: 20,
    marginStart: 15,
    marginEnd: -15,
    fontFamily: "assistant-bold"
  },
  winnerText: {
    fontFamily: "assistant-extra-bold"
  },
  loserText: {
    fontFamily: "assistant-semi-bold",
    color: Colors.gray
  }
});

const mapStateToProps = state => ({
  fixtures: state.fixtures,
  players: state.players
});

const mapDispatchToProps = {
  setFixtures: fixtures => ({ type: SET_FIXTURES, newFixtures: fixtures })
};

export default connect(mapStateToProps, mapDispatchToProps)(WebMatchScreen);
