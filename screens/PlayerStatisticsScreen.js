import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  Dimensions
} from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { Table, Row, Rows, Col } from "react-native-table-component";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { shortTeamLabelsArray } from "../helpers/fixture-list-parser";
import { EVENT_TYPE_GOAL, EVENT_TYPE_WALL } from "../constants/event-types";
import { calculatePoints, RULES_EXTRA_POINT } from "../helpers/rules";
import { FIXTURE_TYPE_FRIENDLY } from "../constants/fixture-properties";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { IoniconsHeaderButton } from "../components/HeaderButton";
import { mergeSort } from "../helpers/mergeSort";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

let PlayerStatisticsScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  const playerId = props.navigation.getParam("playerId");
  const filteredFixtures = fixtures
    ? fixtures.filter(
        fixture => !fixture.isRemoved && fixture.type != FIXTURE_TYPE_FRIENDLY
      )
    : [];

  let goals = 0;
  let assists = 0;
  let saves = 0;
  let points = 0;
  let captains = 0;
  let wins = 0;
  let ties = 0;
  let cleansheets = 0;
  let matchWins = 0;
  let fixturesPlayed = [];
  let goalsFor = 0;
  let goalAgaints = 0;
  let secondsPlayed = 0;
  let playerTracking = players.map(p => ({
    ...p,
    playedTogether: 0,
    winTogether: 0,
    scoreFrom: 0,
    assistTo: 0
  }));

  for (let i in filteredFixtures) {
    let currentScore = calculatePoints(
      players,
      fixtures,
      playerId,
      filteredFixtures[i].id
    );

    goals += currentScore.goals;
    assists += currentScore.assists;
    saves += currentScore.saves;
    matchWins += currentScore.matchWins;
    cleansheets += currentScore.cleansheets;
    wins += currentScore.teamWin ? 1 : 0;
    ties += currentScore.teamTie ? 1 : 0;
    captains += currentScore.isCaptain ? 1 : 0;
    points = parseFloat(points) + parseFloat(currentScore.points);

    if (currentScore.appearence) {
      fixturesPlayed.push({
        ...currentScore,
        fixtureId: filteredFixtures[i].id
      });
    }
  }

  for (let i in fixturesPlayed) {
    // Statistics about the fixture itself
    let playerTeam = fixtures[fixturesPlayed[i].fixtureId].playersList[fixturesPlayed[i].teamId].players
    for (let j in playerTeam) {
      playerTracking[playerTeam[j].id].playedTogether += 1

      if (fixturesPlayed[i].teamWin) {
        playerTracking[playerTeam[j].id].winTogether += 1
      }
    }


    // Statistics About matches
    let matches = fixtures[fixturesPlayed[i].fixtureId].matches;
    matches = matches ? matches : [];

    let activeMatches = matches.filter(m=>!m.isRemoved)

    // check global events
    for (let w in activeMatches) {
      let events = activeMatches[w].events ? activeMatches[w].events.filter(e=>!e.isRemoved) : [];

      for (let j in events) {
        if (
          events[j].executerId == playerId &&
          events[j].helperId != null &&
          events[j].helperId != null
        ) {
          playerTracking[events[j].helperId].assistTo += 1;
        } else if (events[j].helperId == playerId) {
          playerTracking[events[j].executerId].scoreFrom += 1;
        }
      }
    }

    // when home
    let homeMatches = matches.filter(
      m => !m.isRemoved && m.homeId == fixturesPlayed[i].teamId
    );

    for (let w in homeMatches) {
      let homeEvents = homeMatches[w].events ? homeMatches[w].events : [];

      if (!homeMatches[w].isOpen) {
        secondsPlayed += homeMatches[w].time;
      }

      for (let j in homeEvents) {
        if (!homeEvents[j].isRemoved && homeEvents[j].type == EVENT_TYPE_GOAL) {
          if (homeEvents[j].isHome) {
            goalsFor += 1;
          } else {
            goalAgaints += 1;
          }
        }
      }
    }

    // when away
    let awayMatches = matches.filter(
      m => !m.isRemoved && m.awayId == fixturesPlayed[i].teamId
    );

    for (let w in awayMatches) {
      let awayEvents = awayMatches[w].events ? awayMatches[w].events : [];
      console.log(awayMatches[w]);

      if (!awayMatches[w].isOpen) {
        secondsPlayed += awayMatches[w].time;
      }

      for (let j in awayEvents) {
        if (!awayEvents[j].isRemoved && awayEvents[j].type == EVENT_TYPE_GOAL) {
          if (awayEvents[j].isHome) {
            goalAgaints += 1;
          } else {
            goalsFor += 1;
          }
        }
      }
    }
  }

  let bestScoreFromIndex = null;
  let bestAssistToIndex = null;
  let bestPlayedTogether = null;
  let bestWinTogether = null;

  for (let i in playerTracking) {
    if (i == playerId) continue;

    if (bestScoreFromIndex == null) bestScoreFromIndex = i;
    else if (
      playerTracking[i].scoreFrom > playerTracking[bestScoreFromIndex].scoreFrom
    ) {
      bestScoreFromIndex = i;
    }

    if (bestAssistToIndex == null) bestAssistToIndex = i;
    else if (
      playerTracking[i].assistTo > playerTracking[bestAssistToIndex].assistTo
    ) {
      bestAssistToIndex = i;
    }

    if (bestPlayedTogether == null) bestPlayedTogether = i;
    else if (
      playerTracking[i].playedTogether > playerTracking[bestPlayedTogether].playedTogether
    ) {
      bestPlayedTogether = i;
    }

    if (bestWinTogether == null) bestWinTogether = i;
    else if (
      playerTracking[i].winTogether > playerTracking[bestWinTogether].winTogether
    ) {
      bestWinTogether = i;
    }
  }

  const pad = (n, width, z = 0) => {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  };

  const parseSecondsToTime = seconds => {
    if (seconds < 60) return { time: seconds, unit: "שניות" };
    if (seconds < 60 * 60)
      return {
        time: (seconds / 60).toFixed(0) + ":" + pad(seconds % 60, 2),
        unit: "דקות"
      };
    if (seconds < 60 * 60 * 99)
      return {
        time:
          (seconds / (60 * 60)).toFixed(0) +
          ":" +
          pad(((seconds % (60 * 60)) / 60).toFixed(0), 2),
        unit: "שעות"
      };
    return { time: (seconds / (60 * 60)).toFixed(0), unit: "שעות" };
  };

  // charts configuration

  let chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.white,
    backgroundGradientToOpacity: 1,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    color: (opacity = 1) => {
      return `rgba(200, 200, 200, ${opacity})`;
    },
    barPercentage: 0.9
  };

  let pointsChartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.white,
    backgroundGradientToOpacity: 1,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    color: (opacity = 1) => {
      return `rgba(0, 150, 220, ${opacity})`;
    },
    barPercentage: 0.9
  };

  let goalsChartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.white,
    backgroundGradientToOpacity: 1,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    color: (opacity = 1) => {
      return `rgba(0, 200, 140, ${opacity})`;
    },
    barPercentage: 0.9
  };

  let assistsChartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.white,
    backgroundGradientToOpacity: 1,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    color: (opacity = 1) => {
      return `rgba(250, 150, 0, ${opacity})`;
    },
    barPercentage: 0.9
  };

  let savesChartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.white,
    backgroundGradientToOpacity: 1,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    color: (opacity = 1) => {
      return `rgba(250, 0, 100, ${opacity})`;
    },
    barPercentage: 0.9
  };

  let pointsLineChartData = {
    labels: fixturesPlayed.map(f => fixtures[f.fixtureId].number),
    datasets: [
      {
        data: fixturesPlayed.map(f => parseFloat(f.points))
      }
    ]
  };

  let goalsLineChartData = {
    labels: fixturesPlayed.map(f => fixtures[f.fixtureId].number),
    datasets: [
      {
        data: fixturesPlayed.map(f => parseFloat(f.goals))
      }
    ]
  };

  let assistsLineChartData = {
    labels: fixturesPlayed.map(f => fixtures[f.fixtureId].number),
    datasets: [
      {
        data: fixturesPlayed.map(f => parseFloat(f.assists))
      }
    ]
  };

  let savesLineChartData = {
    labels: fixturesPlayed.map(f => fixtures[f.fixtureId].number),
    datasets: [
      {
        data: fixturesPlayed.map(f => parseFloat(f.saves))
      }
    ]
  };

  let pieData = [
    {
      name: "שערים",
      population: goals,
      color: "#ea728c",
      legendFontColor: Colors.black,
      legendFontSize: 17
    },
    {
      name: "בישולים",
      population: assists,
      color: "#fc9d9d",
      legendFontColor: Colors.black,
      legendFontSize: 17
    },
    {
      name: "הצלות",
      population: saves,
      color: "#f3d4d4",
      legendFontColor: Colors.black,
      legendFontSize: 17
    }
  ];

  if (Platform.OS == "android") {
    pieData = pieData.map(d => {
      let nd = { ...d };
      nd.name = nd.name
        .split("")
        .reverse()
        .join("");
      return nd;
    });
  }

  const screenWidth = Math.min(Dimensions.get("window").width * 0.85, 500);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {fixturesPlayed.length == 0 ? (
        <View style={styles.card}>
          <Text style={styles.title}>לא נמצאו נתונים</Text>
          <Text style={styles.subText}>
            ניתן לראות סטטיסטיקה רק עבור שחקנים שהגיעו העונה
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          {(goals > 0 || assists > 0 || saves > 0) && (
            <View style={styles.card}>
              <Text style={styles.title}>מאזן אישי</Text>
              <PieChart
                data={pieData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={{
                  alignSelf: "center"
                }}
                absolute
              />
            </View>
          )}
          <View style={styles.card}>
            <Text style={styles.title}>נקודות לאורך העונה</Text>
            <LineChart
              data={pointsLineChartData}
              width={screenWidth}
              height={300}
              chartConfig={pointsChartConfig}
              bezier
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>שערים לאורך העונה</Text>
            <LineChart
              data={goalsLineChartData}
              width={screenWidth}
              height={300}
              chartConfig={goalsChartConfig}
              bezier
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>בישולים לאורך העונה</Text>
            <LineChart
              data={assistsLineChartData}
              width={screenWidth}
              height={300}
              chartConfig={assistsChartConfig}
              bezier
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>הצלות לאורך העונה</Text>
            <LineChart
              data={savesLineChartData}
              width={screenWidth}
              height={300}
              chartConfig={savesChartConfig}
              bezier
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>ממוצעים למחזור</Text>

            <View style={styles.row}>
              <View style={styles.dataView}>
                <Text style={styles.dataText}>
                  {(points / fixturesPlayed.length).toFixed(1)}
                </Text>
                <Text style={styles.metaText}>נקודות</Text>
              </View>

              <View style={styles.dataView}>
                <Text style={styles.dataText}>
                  {(goals / fixturesPlayed.length).toFixed(1)}
                </Text>
                <Text style={styles.metaText}>שערים</Text>
              </View>

              <View style={styles.dataView}>
                <Text style={styles.dataText}>
                  {(assists / fixturesPlayed.length).toFixed(1)}
                </Text>
                <Text style={styles.metaText}>בישולים</Text>
              </View>

              <View style={styles.dataView}>
                <Text style={styles.dataText}>
                  {(saves / fixturesPlayed.length).toFixed(1)}
                </Text>
                <Text style={styles.metaText}>הצלות</Text>
              </View>

              <View style={styles.dataView}>
                <Text style={styles.dataText}>
                  {(cleansheets / fixturesPlayed.length).toFixed(1)}
                </Text>
                <Text style={styles.metaText}>שערים נקיים</Text>
              </View>

              <View style={styles.dataView}>
                <Text style={styles.dataText}>
                  {(matchWins / fixturesPlayed.length).toFixed(1)}
                </Text>
                <Text style={styles.metaText}>ניצחונות</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>נתונים כלליים</Text>

            <View style={styles.row}>
              <View style={styles.dataView}>
                <Text style={styles.dataText2}>{fixturesPlayed.length}</Text>
                <Text style={styles.metaText2}>הופעות</Text>
              </View>

              <View style={styles.dataView}>
                <Text style={styles.dataText2}>{captains}</Text>
                <Text style={styles.metaText2}>קפטן</Text>
              </View>

              <View style={styles.dataView}>
                <Text style={styles.dataText2}>{wins}</Text>
                <Text style={styles.metaText2}>זכיות</Text>
              </View>

              <View style={styles.dataView}>
                <Text style={styles.dataText2}>{ties}</Text>
                <Text style={styles.metaText2}>תיקו</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>מאזן שערים קבוצתי</Text>

            <View style={styles.row}>
              <View style={styles.dataView}>
                <Text style={styles.dataText3}>{goalsFor}</Text>
                <Text style={styles.metaText2}>שערי זכות</Text>
              </View>

              <View style={styles.dataView}>
                <Text style={styles.dataText3}>{goalAgaints}</Text>
                <Text style={styles.metaText2}>שערי חובה</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>זמן משחק עונתי</Text>

            <View style={styles.row}>
              <View style={styles.dataView}>
                <Text style={styles.dataText4}>
                  {parseSecondsToTime(secondsPlayed).time}
                </Text>
                <Text style={styles.metaText2}>
                  {parseSecondsToTime(secondsPlayed).unit}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>הנבחרת של {players[playerId].name}</Text>

            <View style={styles.row}>
              {bestPlayedTogether != null &&
                playerTracking[bestPlayedTogether].playedTogether > 0 && (
                  <View style={styles.dataView}>
                    <Text style={styles.dataText5}>
                      {playerTracking[bestPlayedTogether].name}
                    </Text>
                    <Text style={styles.metaText5}>
                      {"שיחקו הכי הרבה יחד (" +
                        playerTracking[bestPlayedTogether].playedTogether +
                        ")"}
                    </Text>
                  </View>
                )}
              {bestWinTogether != null &&
                playerTracking[bestWinTogether].winTogether > 0 && (
                  <View style={styles.dataView}>
                    <Text style={styles.dataText5}>
                      {playerTracking[bestWinTogether].name}
                    </Text>
                    <Text style={styles.metaText5}>
                      {"ניצחו הכי הרבה יחד (" +
                        playerTracking[bestWinTogether].winTogether +
                        ")"}
                    </Text>
                  </View>
                )}
              {bestAssistToIndex != null &&
                playerTracking[bestAssistToIndex].assistTo > 0 && (
                  <View style={styles.dataView}>
                    <Text style={styles.dataText5}>
                      {playerTracking[bestAssistToIndex].name}
                    </Text>
                    <Text style={styles.metaText5}>
                      {"בישל הכי הרבה גולים (" +
                        playerTracking[bestAssistToIndex].assistTo +
                        ")"}
                    </Text>
                  </View>
                )}
              {bestScoreFromIndex != null &&
                playerTracking[bestScoreFromIndex].scoreFrom > 0 && (
                  <View style={styles.dataView}>
                    <Text style={styles.dataText5}>
                      {playerTracking[bestScoreFromIndex].name}
                    </Text>
                    <Text style={styles.metaText5}>
                      {"הבקיע הכי הרבה בישולים (" +
                        playerTracking[bestScoreFromIndex].scoreFrom +
                        ")"}
                    </Text>
                  </View>
                )}
            </View>
          </View>
        </View>
      )}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.brightGray
  },
  card: {
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    maxWidth: "92%",
    width: 500,
    minHeight: 200,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  text: {
    fontFamily: "assistant-light",
    fontSize: 25,
    color: Colors.black
  },
  dataView: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 20
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    flexWrap: "wrap"
  },
  dataText: {
    fontFamily: "assistant-bold",
    fontSize: 65,
    color: "#61d4b3",
    textAlign: "center"
  },
  dataText2: {
    fontFamily: "assistant-bold",
    fontSize: 100,
    color: "#fdd365",
    textAlign: "center",
    minWidth: 150
  },
  dataText3: {
    fontFamily: "assistant-bold",
    fontSize: 100,
    color: "#fd2eb3",
    textAlign: "center",
    marginHorizontal: 20,
    minWidth: 100
  },
  dataText4: {
    fontFamily: "assistant-bold",
    fontSize: 100,
    color: "#fb8d62",
    textAlign: "center",
    marginHorizontal: 20,
    minWidth: 100
  },
  dataText5: {
    fontFamily: "assistant-bold",
    fontSize: 40,
    color: "#61d4b3",
    textAlign: "center",
    marginHorizontal: 20,
    minWidth: 100
  },
  metaText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 18,
    marginTop: -10,
    marginBottom: 12,
    color: Colors.darkGray
  },
  metaText2: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25,
    marginTop: -10,
    marginBottom: 12,
    color: Colors.darkGray
  },
  metaText3: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25,
    marginTop: -10,
    marginBottom: 12,
    color: Colors.darkGray
  },
  metaText5: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25,
    marginTop: 0,
    marginBottom: 12,
    color: Colors.darkGray
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 25,
    marginBottom: 10
  },
  subText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 20,
    marginBottom: 10,
    color: Colors.darkGray
  }
});

PlayerStatisticsScreen.navigationOptions = navigationData => {
  return {
    headerTitle: navigationData.navigation.getParam("playerName")
      ? navigationData.navigation.getParam("playerName")
      : "סטטיסטיקות אישיות"
    // headerRight: () => {
    //   return (
    //     <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
    //       <Item
    //         title="Learn More"
    //         iconName="md-help"
    //         onPress={() => navigationData.navigation.navigate("Rules")}
    //       />
    //     </HeaderButtons>
    //   );
    // }
  };
};

export default PlayerStatisticsScreen;
