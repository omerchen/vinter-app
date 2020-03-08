import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { connect } from "react-redux";
import Colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";
import DBCommunicator from "../helpers/db-communictor";
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


let MatchScreen = props => {
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
  let vestPadding= 100;

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

  const [clockTime, setClockTime] = useState(calculateClock());

  // sign up interval for updating the clock every second
  useEffect(() => {
    let interval = setInterval(() => {
      setClockTime(calculateClock());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [match]);

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

  let forward = () => {
    if (!match.startTime) {
      Alert.alert("אופס!", "עליך קודם כל להתחיל את המשחק", null, {
        cancelable: true
      });
    } else {
      let newMatch = { ...match };
      newMatch.startWhistleTime -= 30 * 1000;
      updateMatchState(newMatch);
    }
  };
  let backward = () => {
    if (!match.startTime) {
      Alert.alert("אופס!", "עליך קודם כל להתחיל את המשחק", null, {
        cancelable: true
      });
    } else {
      let newMatch = { ...match };
      let potentialNewTime = match.startWhistleTime + 30 * 1000;
      newMatch.startWhistleTime = match.endWhistleTime
        ? Math.min(potentialNewTime, match.endWhistleTime)
        : Math.min(potentialNewTime, Date.now());
      updateMatchState(newMatch);
    }
  };
  let play = () => {
    let newMatch = { ...match };

    if (!match.startTime) {
      newMatch.startWhistleTime = Date.now();
      newMatch.startTime = newMatch.startWhistleTime;
    } else {
      newMatch.startWhistleTime =
        Date.now() + match.startWhistleTime - match.endWhistleTime;
      newMatch.endWhistleTime = null;
    }
    updateMatchState(newMatch);
  };
  let pause = () => {
    let newMatch = { ...match };
    newMatch.endWhistleTime = Date.now();

    updateMatchState(newMatch);
  };
  let end = () => {
    console.log("end");
  };

  let showEndDialog = () => {
    Alert.alert(
      "אתה עומד לסיים את המשחק",
      "האם אתה בטוח שהמשחק הסתיים?",
      [
        { text: "עדיין לא", style: "cancel" },
        { text: "שרוק לסיום", onPress: end, style: "destructive" }
      ],
      {
        cancelable: true
      }
    );
  };

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

  const deleteMatch = () => {
    let newMatch = { ...match };
    newMatch.isRemoved = true;
    newMatch.removeTime = Date.now();

    updateMatchState(newMatch, () => {
      props.navigation.pop();
    });
  };

  const showDeleteDialog = useCallback(() => {
    Alert.alert(
      "מחיקת משחק",
      "האם אתה בטוח שברצונך למחוק את המשחק הנוכחי?",
      [
        { text: "לא", style: "cancel" },
        { text: "מחק", onPress: deleteMatch, style: "destructive" }
      ],
      {
        cancelable: true
      }
    );
  }, [props.fixtures, props.setFixtures, fixtureId]);

  useEffect(() => {
    props.navigation.setParams({
      deleteMatch: showDeleteDialog
    });
  }, [showDeleteDialog]);

  let createEventComponent = (type, time, description, key) => {
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
      <TouchableOpacity style={styles.eventView} key={key}>
        <FootballIcon source={icon} />
        <Text style={styles.eventText}>
          <Text style={styles.regularText}>{parseToString(time)}</Text>
        </Text>
        <Text style={styles.eventText}>
          <Text style={styles.boldText}>{title}</Text>
          <Text style={styles.regularText}>{description}</Text>
        </Text>
      </TouchableOpacity>
    );
  };

  // EVENT CALCULATIONS

  let events = match.events ? match.events : [];

  let homeEvents = events.filter(item => !item.isRemoved && item.isHome);
  let awayEvents = events.filter(item => !item.isRemoved && !item.isHome);

  let renderEvents = events => {
    //TODO: addsort by time
  return events.sort((a,b)=>a.time>b.time).map(item => {
    let desctiption = props.players[item.executerId].name

    if (item.helperId) {
      desctiption += " ("+props.players[item.helperId].name+")"
    }
    return createEventComponent(item.type, item.time, desctiption, item.id)
  })
  }
  let homeEventsComponent = renderEvents(homeEvents);
  let awayEventsComponent = renderEvents(awayEvents);

  let homeResult = homeEvents.filter(item => item.type === EVENT_TYPE_GOAL)
    .length;

    let awayResult = awayEvents.filter(item => item.type === EVENT_TYPE_GOAL)
      .length;


  return (
    <View style={styles.container}>
      <View style={styles.timeLayer}>
        <View style={styles.timeView}>
          <View style={styles.clockWrapper}>
            <Text style={styles.clockText}>{parseToString(clockTime)}</Text>
          </View>
          <View style={styles.commandsWrapper}>
            <TouchableOpacity onPress={forward} style={styles.commandView}>
              <MaterialIcons
                name="forward-30"
                size={iconsSize}
                color={Colors.black}
              />
              <Text style={styles.commandText}>קדימה</Text>
            </TouchableOpacity>
            {match.startWhistleTime && !match.endWhistleTime ? (
              <TouchableOpacity onPress={pause} style={styles.commandView}>
                <AntDesign
                  name="pausecircle"
                  size={iconsSize}
                  color={Colors.black}
                />

                <Text style={styles.commandText}>עצור</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={play} style={styles.commandView}>
                <AntDesign name="play" size={iconsSize} color={Colors.black} />

                <Text style={styles.commandText}>
                  {match.startTime ? "המשך" : "התחל"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={backward} style={styles.commandView}>
              <MaterialIcons
                name="replay-30"
                size={iconsSize}
                color={Colors.black}
              />

              <Text style={styles.commandText}>אחורה</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.border} />
        <TouchableOpacity onPress={showEndDialog} style={styles.endMatchView}>
          <MaterialCommunityIcons
            name="whistle"
            size={60}
            color={Colors.white}
          />
          <Text style={styles.endMatchText}>שרוק לסיום!</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gameLayer}>
        <View style={styles.teamView}>
          <View style={{...styles.teamHeaderView, paddingEnd:vestPadding}}>
            <Image
              resizeMode="contain"
              source={vestArray[match.homeId]}
              style={styles.vestImage}
            />
            <Text style={styles.resultText}>{homeResult}</Text>
          </View>
          <View style={styles.eventsView}>{homeEventsComponent}</View>
          <TouchableOpacity
            style={{
              ...styles.addView,
              alignSelf: "flex-start",
              backgroundColor: colorsArray[match.homeId].vest
            }}
            onPress={() => {
              props.navigation.navigate({
                routeName: "CreateEvent",
                params: {
                  time: clockTime,
                  isHome: true,
                  matchId: matchId,
                  fixtureId: fixtureId
                }
              });
            }}
          >
            <AntDesign name="plus" size={plusSize} color={Colors.opacityPlus} />
          </TouchableOpacity>
        </View>
        <View style={styles.teamView}>
          <View style={{...styles.teamHeaderView, paddingStart:vestPadding}}>
            <Image
              resizeMode="contain"
              source={vestArray[match.awayId]}
              style={styles.vestImage}
            />
            <Text style={styles.resultText}>{awayResult}</Text>
          </View>
          <View style={styles.eventsView}>{awayEventsComponent}</View>
          <TouchableOpacity
            style={{
              ...styles.addView,
              alignSelf: "flex-end",
              backgroundColor: colorsArray[match.awayId].vest
            }}
            onPress={() => {
              props.navigation.navigate({
                routeName: "CreateEvent",
                params: {
                  time: clockTime,
                  isHome: false,
                  matchId: matchId,
                  fixtureId: fixtureId
                }
              });
            }}
          >
            <AntDesign name="plus" size={plusSize} color={Colors.opacityPlus} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

MatchScreen.navigationOptions = navigationData => {
  let refresh = navigationData.navigation.getParam("refresh");

  return {
    headerTitle: "דף משחק",
    headerRight: () => {
      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item
            title="Add Player"
            iconName="delete"
            onPress={navigationData.navigation.getParam("deleteMatch")}
          />
        </HeaderButtons>
      );
    }
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
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  timeView: {
    backgroundColor: Colors.primaryBright,
    height: 180,
    width: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  clockWrapper: {},
  clockText: {
    fontFamily: "assistant-bold",
    fontSize: 60
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
    fontSize: 20
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
    width: 2,
    flex: 1,
    backgroundColor: Colors.gray
  },
  gameLayer: {
    flexDirection: "row",
    flex: 1
  },
  teamView: {
    width: "50%",
    alignItems: "center"
  },
  teamHeaderView: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom:20,
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
    elevation: 10
  },
  eventView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  eventText: {
    fontSize: 20,
    marginStart: 15
  },
  regularText: {
    fontFamily: "assistant-semi-bold"
  },
  boldText: {
    fontFamily: "assistant-bold"
  }
});

const mapStateToProps = state => ({
  fixtures: state.fixtures,
  players: state.players
});

const mapDispatchToProps = {
  setFixtures: fixtures => ({ type: SET_FIXTURES, newFixtures: fixtures })
};

export default connect(mapStateToProps, mapDispatchToProps)(MatchScreen);
