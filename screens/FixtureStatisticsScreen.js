import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ColorPropType,
  Image,
  Platform
} from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { shortTeamLabelsArray } from "../helpers/fixture-list-parser";
import { EVENT_TYPE_GOAL, EVENT_TYPE_WALL } from "../constants/event-types";
import { calculatePoints } from "../helpers/rules";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { IoniconsHeaderButton } from "../components/HeaderButton";
import { mergeSort } from "../helpers/mergeSort";

let FixtureStatisticsScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  const fixtureId = props.navigation.getParam("fixtureId");
  const fixture = fixtures[fixtureId];

  const matches = fixture.matches ? fixture.matches : [];
  const closedMatches = matches.filter(item => !item.isRemoved && !item.isOpen);

  const TABLE_TEAM_COL = 0;
  const TABLE_NAME_COL = 1;
  const TABLE_POINTS_COL = 2;
  const TABLE_GOAL_COL = 3;
  const TABLE_ASSIST_COL = 4;
  const TABLE_SAVE_COL = 5;
  const TABLE_CLEAN_COL = -1;

  const [playersOrderBy, setPlayersOrderBy] = useState(TABLE_POINTS_COL);

  let playersTableHead = [
    "קבוצה",
    "שם השחקן",
    "צבירת נקודות",
    "שערים",
    "בישולים",
    // "שער נקי",
    "הצלות גדולות"
  ];

  let playersOrderDirection = [true, true, false, false, false, false];

  playersTableHead = playersTableHead.map((title, index) => {
    return (
      <TouchableOpacity
        disabled={index == playersOrderBy}
        onPress={() => {
          setPlayersOrderBy(index);
        }}
      >
        <Text
          style={playersOrderBy == index ? styles.textLight : styles.textBold}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  });

  const playersList = [];
  for (let i in fixture.playersList) {
    playersList.push(
      ...fixture.playersList[i].players.map(item => {
        return { ...item, team: i };
      })
    );
  }

  if (closedMatches.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "assistant-semi-bold",
            fontSize: 25,
            color: Colors.darkGray
          }}
        >
          לא ניתן להציג סטטיסטיקה למחזור זה
        </Text>
      </View>
    );
  }

  // STATISTICS CALCULATIONS STARTS HERE (closedMatches.length > 0)

  const getTeam = playerObject => {
    return shortTeamLabelsArray[playerObject.team];
  };

  const getName = playerObject => {
    let name = players[playerObject.id].name;
    if (playerObject.isCaptain) {
      name += " (C)";
    }
    if (playerObject.isGoalkeeper) {
      name += " (GK)";
    }

    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate({
            routeName: "Player",
            params: {
              playerId: playerObject.id
            }
          });
        }}
      >
        <Text style={styles.text}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const getGoals = playerObject => {
    let counter = 0;
    for (let i in closedMatches) {
      counter += closedMatches[i].events
        ? closedMatches[i].events.filter(
            item =>
              !item.isRemoved &&
              item.executerId === playerObject.id &&
              item.type === EVENT_TYPE_GOAL
          ).length
        : 0;
    }
    return counter;
  };

  const getAssists = playerObject => {
    let counter = 0;
    for (let i in closedMatches) {
      counter += closedMatches[i].events
        ? closedMatches[i].events.filter(
            item =>
              !item.isRemoved &&
              item.helperId === playerObject.id &&
              item.type === EVENT_TYPE_GOAL
          ).length
        : 0;
    }
    return counter;
  };

  const getCleanSheet = playerObject => {
    return getCleanSheetFromTeam(playerObject.team);
  };

  const getCleanSheetFromTeam = teamId => {
    let counter = 0;

    // count at home
    counter += closedMatches
      .filter(match => match.homeId == teamId)
      .filter(match =>
        match.events
          ? match.events.filter(
              event =>
                !event.isRemoved &&
                !event.isHome &&
                event.type == EVENT_TYPE_GOAL
            ).length == 0
          : true
      ).length;

    // count aWAY
    counter += closedMatches
      .filter(match => match.awayId == teamId)
      .filter(match =>
        match.events
          ? match.events.filter(
              event =>
                !event.isRemoved &&
                event.isHome &&
                event.type == EVENT_TYPE_GOAL
            ).length == 0
          : true
      ).length;
    return counter;
  };
  const getSaves = playerObject => {
    let counter = 0;
    for (let i in closedMatches) {
      counter += closedMatches[i].events
        ? closedMatches[i].events.filter(
            item =>
              !item.isRemoved &&
              item.executerId === playerObject.id &&
              item.type === EVENT_TYPE_WALL
          ).length
        : 0;
    }
    return counter;
  };
  const getPoints = playerObject => {
    return calculatePoints(players, fixtures, playerObject.id, fixtureId)
      .points;
  };

  let playersTableData = mergeSort(
    playersList.map(playerObject => {
      let tableObject = [];

      for (let i = 0; i < playersTableHead.length; i++) {
        switch (i) {
          case TABLE_TEAM_COL:
            tableObject.push(getTeam(playerObject));
            break;
          case TABLE_NAME_COL:
            tableObject.push(getName(playerObject));
            break;
          case TABLE_GOAL_COL:
            tableObject.push(getGoals(playerObject));
            break;
          case TABLE_ASSIST_COL:
            tableObject.push(getAssists(playerObject));
            break;
          case TABLE_CLEAN_COL:
            tableObject.push(getCleanSheet(playerObject));
            break;
          case TABLE_SAVE_COL:
            tableObject.push(getSaves(playerObject));
            break;
          case TABLE_POINTS_COL:
            tableObject.push(getPoints(playerObject));
            break;
          default:
            tableObject.push("");
        }
      }

      return tableObject;
    }),
    (a, b) => {
      if (playersOrderBy == TABLE_POINTS_COL) {
        return parseFloat(a[playersOrderBy]) <= parseFloat(b[playersOrderBy]);
      }

      if (playersOrderBy == TABLE_NAME_COL) {
        return (
          a[playersOrderBy].props.children.props.children >
          b[playersOrderBy].props.children.props.children
        );
      }

      if (playersOrderDirection[playersOrderBy])
        return a[playersOrderBy] > b[playersOrderBy];

      return a[playersOrderBy] <= b[playersOrderBy];
    }
  );

  // if (Platform.OS == "web") {
  //   playersTableData = mergeSort(playersTableData, (a, b) => a[TABLE_POINTS_COL] < b[TABLE_POINTS_COL])
  // }

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

  const teamsTableHead = [
    "קבוצה",
    "משחקים",
    "נצ׳ (בפנדל׳)",
    "הפ׳ (בפנדל׳)",
    // "תיקו",
    "מאזן שערים",
    "מהפכים",
    "שערים נקיים",
    "זמן נצ׳ ממוצע",
    "זמן הפ׳ ממוצע",
    "הניצחון המהיר",
    "רצף נצ׳ שיא"
  ];

  const teamFlexArr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  const teamsTableData = [];

  for (let i in fixture.playersList) {
    let row = [];

    // Team Name
    row.push(shortTeamLabelsArray[i]);

    // Team Win
    let wins = closedMatches.filter(match => match.winnerId == i);
    let penaltyWins = wins.filter(match => {
      let homeGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;
      let awayGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && !event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;

      return homeGoals == awayGoals;
    });

    // Team Lose
    let loses = closedMatches.filter(
      match =>
        match.winnerId != i &&
        match.winnerId != null &&
        match.winnerId != undefined &&
        (match.homeId == i || match.awayId == i)
    );
    let penaltyLoses = loses.filter(match => {
      let homeGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;
      let awayGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && !event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;

      return homeGoals == awayGoals;
    });

    // Team tie
    let ties = closedMatches.filter(
      match =>
        (match.winnerId == null || match.winnerId == undefined) &&
        (match.homeId == i || match.awayId == i)
    );

    let appearences = wins.length + loses.length + ties.length;
    let winLabel = "(" + penaltyWins.length + ") " + wins.length;
    let loseLabel = "(" + penaltyLoses.length + ") " + loses.length;

    row.push(appearences, winLabel, loseLabel);

    // goals
    let goalsFor = 0;
    let goalsAgainst = 0;
    let revolutions = 0;

    for (let j in closedMatches) {
      if (closedMatches[j].homeId == i && closedMatches[j].events) {
        let goalEvents = mergeSort(
          closedMatches[j].events.filter(
            item => !item.isRemoved && item.type == EVENT_TYPE_GOAL
          ),
          (a, b) => a.time >= b.time
        );
        if (
          closedMatches[j].winnerId == i &&
          goalEvents.length > 0 &&
          !goalEvents[0].isHome
        ) {
          revolutions += 1;
        }
        for (let w in goalEvents) {
          if (goalEvents[w].isHome) {
            goalsFor++;
          } else {
            goalsAgainst++;
          }
        }
      } else if (closedMatches[j].awayId == i && closedMatches[j].events) {
        let goalEvents = mergeSort(
          closedMatches[j].events.filter(
            item => !item.isRemoved && item.type == EVENT_TYPE_GOAL
          ),
          (a, b) => a.time >= b.time
        );
        if (
          closedMatches[j].winnerId == i &&
          goalEvents.length > 0 &&
          goalEvents[0].isHome
        ) {
          revolutions += 1;
        }
        for (let w in goalEvents) {
          if (!goalEvents[w].isHome) {
            goalsFor++;
          } else {
            goalsAgainst++;
          }
        }
      }
    }

    // Add goals
    row.push(goalsAgainst + "-" + goalsFor);

    // Add revolutions
    row.push(revolutions);

    /// Add Clean sheets
    row.push(getCleanSheetFromTeam(i));

    // avg time
    let minWin = null;
    let winTime = 0;
    let loseTime = 0;

    for (let j in wins) {
      let matchTime = Math.floor(
        (wins[j].endWhistleTime - wins[j].startWhistleTime) / 1000
      );
      matchTime = matchTime ? matchTime : wins[j].time;
      if (j == 0 || matchTime < minWin) {
        minWin = matchTime;
      }

      winTime += matchTime;
    }

    for (let j in loses) {
      let matchTime = Math.floor(
        (loses[j].endWhistleTime - loses[j].startWhistleTime) / 1000
      );
      matchTime = matchTime ? matchTime : loses[j].time;
      loseTime += matchTime;
    }

    let fastestWin = minWin == null ? "--" : parseToString(minWin);
    let winAvgTimeLabel =
      wins.length == 0
        ? "--"
        : parseToString(Math.floor(winTime / wins.length));
    let loseAvgTimeLabel =
      loses.length == 0
        ? "--"
        : parseToString(Math.floor(loseTime / loses.length));

    row.push(winAvgTimeLabel, loseAvgTimeLabel, fastestWin);

    // top wins
    let topWins = 0;
    let currentScore = 0;

    for (let j in closedMatches) {
      if (closedMatches[j].winnerId == i) {
        currentScore++;
      } else {
        currentScore = 0;
      }

      if (currentScore > topWins) topWins = currentScore;
    }

    row.push(topWins);

    teamsTableData.push(row);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        {Platform.OS != "web" && (
          <Image
            resizeMode="contain"
            source={require("../assets/images/colorful-logo-280h.png")}
            style={styles.logo}
          />
        )}
      </View>
      <Text style={styles.tableTitle}>נתונים קבוצתיים</Text>
      <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
        <Row
          data={teamsTableHead}
          style={{ ...styles.head, backgroundColor: "#f1f8ff" }}
          textStyle={styles.text}
          flexArr={teamFlexArr}
        />
        <Rows
          data={teamsTableData}
          textStyle={styles.text}
          flexArr={teamFlexArr}
        />
      </Table>
      <View style={{ height: 50 }} />
      <Text style={styles.tableTitle}>נתונים אישיים</Text>
      <Table
        borderStyle={{ borderWidth: 2, borderColor: Colors.primaryBright }}
      >
        <Row
          data={playersTableHead}
          style={styles.head}
          textStyle={styles.text}
        />
        <Rows data={playersTableData} textStyle={styles.text} />
      </Table>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: Colors.primaryBrightest },
  text: { margin: 6, textAlign: "left" },
  textLight: {
    margin: 6,
    textAlign: "left",
    fontSize: 14,
    fontFamily: "assistant-bold"
  },
  textBold: {
    margin: 6,
    textAlign: "left",
    fontSize: 14,
    fontFamily: "assistant-semi-bold"
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: Colors.white
  },
  tableTitle: {
    fontFamily: "assistant-semi-bold",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20
  },
  logoContainer: {
    alignItems: "center"
  },
  logo: {
    height: 180,
    marginBottom: 30
  }
});

FixtureStatisticsScreen.navigationOptions = navigationData => {
  let title =
    "נתוני מחזור " + navigationData.navigation.getParam("fixtureNumber");

  return {
    headerTitle: title,
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="Learn More"
            iconName="md-help"
            onPress={() => navigationData.navigation.navigate("Rules")}
          />
        </HeaderButtons>
      );
    }
  };
};

export default FixtureStatisticsScreen;
