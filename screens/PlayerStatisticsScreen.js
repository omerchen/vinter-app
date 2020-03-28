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
import { parseSecondsToTime } from "../helpers/time-parser";

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
  let matches = 0;
  let cleansheets = 0;
  let matchWins = 0;
  let fixturesPlayed = [];
  let fixturesGKPlayed = [];
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
    matches += currentScore.matches;

    if (currentScore.appearence) {
      fixturesPlayed.push({
        ...currentScore,
        fixtureId: filteredFixtures[i].id
      });

      if (currentScore.isGoalkeeper) {
        fixturesGKPlayed.push({
          ...currentScore,
          fixtureId: filteredFixtures[i].id
        });
      }
    }
  }

  for (let i in fixturesPlayed) {
    // Statistics about the fixture itself
    let playerTeam =
      fixtures[fixturesPlayed[i].fixtureId].playersList[
        fixturesPlayed[i].teamId
      ].players;
    for (let j in playerTeam) {
      playerTracking[playerTeam[j].id].playedTogether += 1;

      if (fixturesPlayed[i].teamWin) {
        playerTracking[playerTeam[j].id].winTogether += 1;
      }
    }

    // Statistics About matches
    let matches = fixtures[fixturesPlayed[i].fixtureId].matches;
    matches = matches ? matches : [];

    let activeMatches = matches.filter(m => !m.isRemoved);

    // check global events
    for (let w in activeMatches) {
      let events = activeMatches[w].events
        ? activeMatches[w].events.filter(e => !e.isRemoved)
        : [];

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
        let matchTime = Math.floor(
          (homeMatches[w].endWhistleTime - homeMatches[w].startWhistleTime) /
            1000
        );
        matchTime = matchTime ? matchTime : homeMatches[w].time;
        secondsPlayed += matchTime;
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

      if (!awayMatches[w].isOpen) {
        let matchTime = Math.floor(
          (awayMatches[w].endWhistleTime - awayMatches[w].startWhistleTime) /
            1000
        );
        matchTime = matchTime ? matchTime : awayMatches[w].time;
        secondsPlayed += matchTime;
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
      playerTracking[i].playedTogether >
      playerTracking[bestPlayedTogether].playedTogether
    ) {
      bestPlayedTogether = i;
    }

    if (bestWinTogether == null) bestWinTogether = i;
    else if (
      playerTracking[i].winTogether >
      playerTracking[bestWinTogether].winTogether
    ) {
      bestWinTogether = i;
    }
  }

  // gk statistics
  let gkGoalsAgainst = 0;
  let gkCleansheets = 0;
  let gkSaves = 0;
  let gkMatches = 0;
  let gkCleanSheetmaxTime = 0;
  let gkCurrentRecord = 0;
  let gkRecordStillActive = false;
  let gkPlayingSeconds = 0;
  let gkZeroGoals = 0;
  let gkOneGoal = 0;
  let gkMultiGoals = 0;
  let gkBestFixtureSaves = null;
  let gkBestFixtureCleanSheet = null;
  let gkBestFixtureGoalAgainst = null;

  for (let i in fixturesGKPlayed) {
    gkMatches += fixturesGKPlayed[i].matches;
    gkSaves += fixturesGKPlayed[i].saves;
    gkCleansheets += fixturesGKPlayed[i].cleansheets;
    gkGoalsAgainst += fixturesGKPlayed[i].teamGoalAgainst;

    if (
      gkBestFixtureSaves == null ||
      gkBestFixtureSaves.value < fixturesGKPlayed[i].saves
    ) {
      gkBestFixtureSaves = {
        fixtureId: fixturesGKPlayed[i].fixtureId,
        value: fixturesGKPlayed[i].saves
      };
    }
    if (
      gkBestFixtureCleanSheet == null ||
      gkBestFixtureCleanSheet.value < fixturesGKPlayed[i].cleansheets
    ) {
      gkBestFixtureCleanSheet = {
        fixtureId: fixturesGKPlayed[i].fixtureId,
        value: fixturesGKPlayed[i].cleansheets
      };
    }
    if (
      gkBestFixtureGoalAgainst == null ||
      gkBestFixtureGoalAgainst.value > fixturesGKPlayed[i].teamGoalAgainst
    ) {
      gkBestFixtureGoalAgainst = {
        fixtureId: fixturesGKPlayed[i].fixtureId,
        value: fixturesGKPlayed[i].teamGoalAgainst
      };
    }

    let currentFixture = fixtures[fixturesGKPlayed[i].fixtureId];
    let teamId = fixturesGKPlayed[i].teamId;
    if (currentFixture.matches) {
      for (let j in currentFixture.matches) {
        if (
          currentFixture.matches[j].isRemoved ||
          currentFixture.matches[j].isOpen
        ) {
          continue;
        }

        let isHome = false;
        if (currentFixture.matches[j].homeId == teamId) {
          isHome = true;
        } else if (currentFixture.matches[j].awayId != teamId) {
          continue;
        }

        let matchTime = Math.floor(
          (currentFixture.matches[j].endWhistleTime -
            currentFixture.matches[j].startWhistleTime) /
            1000
        );
        if (matchTime == null || matchTime == undefined) {
          matchTime = currentFixture.matches[j].time;
        }
        gkPlayingSeconds += matchTime;

        let relevantEvents = mergeSort(
          currentFixture.matches[j].events
            ? currentFixture.matches[j].events.filter(
                e =>
                  !e.isRemoved &&
                  e.isHome != isHome &&
                  e.type == EVENT_TYPE_GOAL
              )
            : [],
          (a, b) => {
            return a.time > b.time;
          }
        );

        if (relevantEvents.length == 0) gkZeroGoals += 1;
        else if (relevantEvents.length == 1) gkOneGoal += 1;
        else gkMultiGoals += 1;

        let lastAddedTime = 0;

        for (let w in relevantEvents) {
          gkCurrentRecord += relevantEvents[w].time - lastAddedTime;
          if (gkCurrentRecord > gkCleanSheetmaxTime) {
            gkCleanSheetmaxTime = gkCurrentRecord;
          }
          gkCurrentRecord = 0;
          lastAddedTime = relevantEvents[w].time;
        }
        gkCurrentRecord += matchTime - lastAddedTime;
      }
    }

    if (gkCurrentRecord > gkCleanSheetmaxTime) {
      gkCleanSheetmaxTime = gkCurrentRecord;
      gkCurrentRecord = 0;
      gkRecordStillActive = true;
    }
  }

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
  let gkPieData = [
    {
      name: "שער נקי",
      population: gkZeroGoals,
      color: "#ea728c",
      legendFontColor: Colors.black,
      legendFontSize: 17
    },
    {
      name: "גול בודד",
      population: gkOneGoal,
      color: "#fc9d9d",
      legendFontColor: Colors.black,
      legendFontSize: 17
    },
    {
      name: "כמה גולים",
      population: gkMultiGoals,
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
    gkPieData = gkPieData.map(d => {
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
                <Text style={styles.dataText4}>{matches}</Text>
                <Text style={styles.metaText2}>משחקונים</Text>
              </View>
            </View>
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
                    <TouchableOpacity onPress={()=>{
                      props.navigation.navigate({
                        routeName: "Player",
                        params: {
                          playerId: bestPlayedTogether
                        }
                      })
                    }}>
                      <Text style={styles.dataText5}>
                        {playerTracking[bestPlayedTogether].name}
                      </Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity onPress={()=>{
                      props.navigation.navigate({
                        routeName: "Player",
                        params: {
                          playerId: bestWinTogether
                        }
                      })
                    }}>
                      <Text style={styles.dataText5}>
                        {playerTracking[bestWinTogether].name}
                      </Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity onPress={()=>{
                      props.navigation.navigate({
                        routeName: "Player",
                        params: {
                          playerId: bestAssistToIndex
                        }
                      })
                    }}>
                      <Text style={styles.dataText5}>
                        {playerTracking[bestAssistToIndex].name}
                      </Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity onPress={()=>{
                      props.navigation.navigate({
                        routeName: "Player",
                        params: {
                          playerId: bestScoreFromIndex
                        }
                      })
                    }}>
                      <Text style={styles.dataText5}>
                        {playerTracking[bestScoreFromIndex].name}
                      </Text>
                    </TouchableOpacity>
                    
                      <Text style={styles.metaText5}>
                        {"הבקיע הכי הרבה בישולים (" +
                          playerTracking[bestScoreFromIndex].scoreFrom +
                          ")"}
                      </Text>
                  </View>
                )}
            </View>
          </View>
          {gkMatches > 0 && (
            <View style={styles.card}>
              <Text style={styles.title}>נתוני שוערים</Text>

              <View style={styles.col}>
                <View style={styles.dataView}>
                  <Text style={styles.dataText6}>{gkMatches}</Text>
                  <Text style={styles.metaText2}>משחקונים כשוער</Text>
                </View>

                <View style={styles.dataView}>
                  <Text style={styles.dataText6}>
                    {((gkCleansheets / gkMatches) * 100).toFixed(2) + "%"}
                  </Text>
                  <Text style={styles.metaText2}>שערים נקיים</Text>
                </View>

                <View style={styles.dataView}>
                  <Text style={styles.dataText6}>
                    {(gkGoalsAgainst / gkMatches).toFixed(2)}
                  </Text>
                  <Text style={styles.metaText2}>ספיגות למשחקון</Text>
                </View>

                <View style={styles.dataView}>
                  <Text style={styles.dataText6}>
                    {(gkSaves / gkMatches).toFixed(2)}
                  </Text>
                  <Text style={styles.metaText2}>הצלות למשחקון</Text>
                </View>

                {gkGoalsAgainst > 0 && (
                  <View style={styles.dataView}>
                    <Text style={styles.metaText2op}>ספיגה כל</Text>
                    <Text style={styles.dataText6}>
                      {
                        parseSecondsToTime(
                          Math.floor(gkPlayingSeconds / gkGoalsAgainst)
                        ).time
                      }
                    </Text>
                    <Text style={styles.metaText2}>
                      {
                        parseSecondsToTime(
                          Math.floor(gkPlayingSeconds / gkGoalsAgainst)
                        ).unit
                      }
                    </Text>
                  </View>
                )}
                {gkSaves > 0 && (
                  <View style={styles.dataView}>
                    <Text style={styles.metaText2op}>הצלה כל</Text>
                    <Text style={styles.dataText6}>
                      {
                        parseSecondsToTime(
                          Math.floor(gkPlayingSeconds / gkSaves)
                        ).time
                      }
                    </Text>
                    <Text style={styles.metaText2}>
                      {
                        parseSecondsToTime(
                          Math.floor(gkPlayingSeconds / gkSaves)
                        ).unit
                      }
                    </Text>
                  </View>
                )}
                <Text style={styles.metaText2op}>התפלגות ספיגות במשחקונים</Text>
                <View style={{ height: 10 }} />
                <PieChart
                  data={gkPieData}
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
            </View>
          )}
          {gkMatches > 0 && (
            <View style={styles.card}>
              <Text style={styles.title}>שיאי שוערים</Text>

              <View style={styles.col}>
                <View style={styles.dataView}>
                  <Text style={styles.metaText2op}>
                    זמן שיא ללא ספיגות{gkRecordStillActive && "*"}
                  </Text>
                  <Text style={styles.dataText3}>
                    {parseSecondsToTime(gkCleanSheetmaxTime).time}
                  </Text>
                  <Text style={styles.metaText2}>
                    {parseSecondsToTime(gkCleanSheetmaxTime).unit}
                  </Text>
                </View>

                <View style={styles.dataView}>
                  <Text style={styles.metaText2op}>
                    הכי הרבה הצלות במחזור
                  </Text>
                  <Text style={styles.dataText3}>
                    {gkBestFixtureSaves.value}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate({
                        routeName: "ViewFixture",
                        params: {
                          fixtureId: gkBestFixtureSaves.fixtureId,
                          fixtureNumber:
                            fixtures[gkBestFixtureSaves.fixtureId].number
                        }
                      });
                    }}
                  >
                    <Text style={styles.metaText2}>
                      {"מחזור " + fixtures[gkBestFixtureSaves.fixtureId].number}
                    </Text>
                  </TouchableOpacity>
                </View>


                <View style={styles.dataView}>
                  <Text style={styles.metaText2op}>
                    הכי הרבה שערים נקיים במחזור
                  </Text>
                  <Text style={styles.dataText3}>
                    {gkBestFixtureCleanSheet.value}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate({
                        routeName: "ViewFixture",
                        params: {
                          fixtureId: gkBestFixtureCleanSheet.fixtureId,
                          fixtureNumber:
                            fixtures[gkBestFixtureCleanSheet.fixtureId].number
                        }
                      });
                    }}
                  >
                    <Text style={styles.metaText2}>
                      {"מחזור " + fixtures[gkBestFixtureCleanSheet.fixtureId].number}
                    </Text>
                  </TouchableOpacity>
                </View>


                <View style={styles.dataView}>
                  <Text style={styles.metaText2op}>
                    הכי פחות ספיגות במחזור
                  </Text>
                  <Text style={styles.dataText3}>
                    {gkBestFixtureGoalAgainst.value}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate({
                        routeName: "ViewFixture",
                        params: {
                          fixtureId: gkBestFixtureGoalAgainst.fixtureId,
                          fixtureNumber:
                            fixtures[gkBestFixtureGoalAgainst.fixtureId].number
                        }
                      });
                    }}
                  >
                    <Text style={styles.metaText2}>
                      {"מחזור " + fixtures[gkBestFixtureGoalAgainst.fixtureId].number}
                    </Text>
                  </TouchableOpacity>
                </View>


              </View>

              
            </View>
          )}
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
  col: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center"
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
    minWidth: 300
  },
  dataText6: {
    fontFamily: "assistant-bold",
    fontSize: 70,
    color: "#fdd365",
    textAlign: "center",
    minWidth: 150
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
  metaText2op: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25,
    marginTop: 10,
    marginBottom: -15,
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
