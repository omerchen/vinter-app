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
  let fixturesPlayed = [];

  for (let i in filteredFixtures) {
    let currentScore = calculatePoints(players, fixtures, playerId, filteredFixtures[i].id);

    goals += currentScore.goals;
    assists += currentScore.assists;
    saves += currentScore.saves;

    if (currentScore.appearence) {
      fixturesPlayed.push({ ...currentScore, fixtureId: filteredFixtures[i].id });
    }
  }

  // charts configuration

  const pointsChartConfig = {
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
 
  const goalsChartConfig = {
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
 
  const assistsChartConfig = {
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
 
  const savesChartConfig = {
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
        data: fixturesPlayed.map(f => parseFloat(f.points)),
      }
    ]
  };

  let goalsLineChartData = {
    labels: fixturesPlayed.map(f => fixtures[f.fixtureId].number),
    datasets: [
      {
        data: fixturesPlayed.map(f => parseFloat(f.goals)),
      }
    ]
  };

  let assistsLineChartData = {
    labels: fixturesPlayed.map(f => fixtures[f.fixtureId].number),
    datasets: [
      {
        data: fixturesPlayed.map(f => parseFloat(f.assists)),
      }
    ]
  };

  let savesLineChartData = {
    labels: fixturesPlayed.map(f => fixtures[f.fixtureId].number),
    datasets: [
      {
        data: fixturesPlayed.map(f => parseFloat(f.saves)),
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
      {fixturesPlayed.length == 0 && (
        <View style={styles.card}>
          <Text style={styles.title}>לא נמצאו נתונים</Text>
          <Text style={styles.subText}>
            ניתן לראות סטטיסטיקה רק עבור שחקנים שהגיעו העונה
          </Text>
        </View>
      )}
      {(goals > 0 || assists > 0 || saves > 0) && (
        <View style={styles.card}>
          <Text style={styles.title}>מאזן אישי</Text>
          <PieChart
            data={pieData}
            width={screenWidth}
            height={220}
            chartConfig={pointsChartConfig}
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
      {fixturesPlayed.length > 0 && (
        <View style={{flex:1, width:'100%', alignItems:"center"}}>
          <View style={styles.card}>
            <Text style={styles.title}>התקדמות נקודות</Text>
            <LineChart
              data={pointsLineChartData}
              width={screenWidth}
              height={300}
              chartConfig={pointsChartConfig}
              bezier
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>התקדמות שערים</Text>
            <LineChart
              data={goalsLineChartData}
              width={screenWidth}
              height={300}
              chartConfig={goalsChartConfig}
              bezier
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>התקדמות בישולים</Text>
            <LineChart
              data={assistsLineChartData}
              width={screenWidth}
              height={300}
              chartConfig={assistsChartConfig}
              bezier
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>התקדמות הצלות</Text>
            <LineChart
              data={savesLineChartData}
              width={screenWidth}
              height={300}
              chartConfig={savesChartConfig}
              bezier
            />
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
    backgroundColor: Colors.gray
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
    minHeight: 200
  },
  text: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25
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
